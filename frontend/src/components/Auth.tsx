import React, { useState } from 'react'
import { Shield, Lock, User, AlertCircle, Mail, Briefcase } from 'lucide-react'
import api from '../services/api'
import '../styles/auth.css'

interface AuthProps {
  onLogin: (user: {username: string, role: string, token?: string}) => void
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('doctor')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      if (isLogin) {
        const response = await api.post('/auth/login', {
            email: email,
            password: password
        });

        const { access_token, email: userEmail, full_name, role: userRole } = response?.data || {};
        if (!access_token) throw new Error("No access token received from server");

        onLogin({
          username: full_name || userEmail.split('@')[0] || 'User', 
          full_name: full_name || 'User',
          email: userEmail,
          role: userRole || 'doctor', 
          token: access_token
        });
      } else {
        // Signup logic
        await api.post('/auth/register', {
          full_name: fullName,
          email: email,
          password: password,
          role: role,
        });
        setSuccess('Clinical identity created. Please login with your new credentials.')
        setIsLogin(true)
      }
    } catch (err: any) {
      console.error("Auth failed:", err);
      setError(err.response?.data?.detail || "Connection to clinical cloud failed.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-center">
          <div className="auth-icon-bg">
            <Shield size={40} />
          </div>
        </div>
        
        <h2 className="auth-title">{isLogin ? 'Clinical Portal' : 'Join the Network'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Verify cloud credentials for RxEngine' : 'Create a secure workspace in the clinical cloud'}
        </p>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-alert bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-xs flex items-center gap-2 mb-6">
            <Shield size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-column">
          {!isLogin && (
            <div className="auth-input-item">
              <label className="auth-input-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User className="auth-input-icon" size={20} />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="auth-input-field"
                  placeholder="Dr. John Doe"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-item">
            <label className="auth-input-label">Clinical Email</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input-field"
                placeholder="name@hospital.org"
                required
              />
            </div>
          </div>

          <div className="auth-input-item">
            <label className="auth-input-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input-field"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="auth-input-item">
              <label className="auth-input-label">Clinical Role</label>
              <div className="auth-input-wrapper">
                <Briefcase className="auth-input-icon" size={20} />
                <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="auth-input-field auth-select-field"
                >
                    <option value="doctor">Physician / Prescriber</option>
                    <option value="pharmacist">Clinical Pharmacist</option>
                    <option value="admin">System Administrator</option>
                </select>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="auth-submit-btn"
          >
            {isLoading ? (
              <div className="spinner-light" />
            ) : (
              isLogin ? 'Access System' : 'Authorize Identity'
            )}
          </button>
        </form>

        <div className="auth-toggle-area">
          <p className="toggle-prompt">
            {isLogin ? "New to the platform?" : "Already verified?"}
          </p>
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-btn"
          >
            {isLogin ? 'Apply for credentials' : 'Return to Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
