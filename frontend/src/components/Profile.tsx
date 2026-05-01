import React, { useState } from 'react'
import { 
  User, Mail, Lock, Save, Eye, EyeOff, 
  AlertCircle, CheckCircle2, Loader2, Terminal
} from 'lucide-react'
import { prescriptionService } from '../services/api'
import '../styles/profile.css'

interface ProfileProps {
  onUpdateUser: (u: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ onUpdateUser }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        const parsed = saved ? JSON.parse(saved) : { full_name: "Clinical User", role: "Doctor" }
        return {
            ...parsed,
            username: parsed.full_name || parsed.username || "User"
        }
    })
    
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email || "doctor@rxengine.com",
        currentPassword: '',
        newPassword: ''
    })



    const [showPasswords, setShowPasswords] = useState(false)
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setMessage('')
        
        // Prepare data: Only send passwords if they have non-whitespace content
        const currentPass = formData.currentPassword.trim();
        const newPass = formData.newPassword.trim();
        
        try {
            const response = await prescriptionService.updateProfile(
                formData.username, 
                currentPass || undefined, 
                newPass || undefined
            );
            
            // Sync local storage
            const updatedUser = { 
                ...user, 
                username: formData.username, 
                full_name: formData.username
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setUser(updatedUser);
            onUpdateUser(updatedUser); 
            setStatus('success');
            setMessage(response.message || 'Profile successfully updated.');
            
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err: any) {
            setStatus('error');
            const responseData = err.response?.data;
            const errorDetail = responseData?.detail || responseData?.msg || 'Clinical server synchronization failed.';
            setMessage(errorDetail);
            setTimeout(() => setStatus('idle'), 6000);
        }

    }



    return (
        <div className="profile-container">
            <header className="profile-header">
                <div className="profile-avatar-wrapper">
                    <div className="avatar-ring" />
                    <div className="profile-avatar-large">
                        {user.username[0].toUpperCase()}
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="profile-header-title">Profile</h2>
                </div>
            </header>

            <div className="profile-main-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <main className="profile-content">
                    <form onSubmit={handleUpdate} className="profile-editor-card">
                        {status === 'success' && (
                            <div className="form-success-shield" style={{ borderRadius: '4rem' }}>
                                <div className="checkmark-circle">
                                    <CheckCircle2 size={44} />
                                </div>
                                <h5 className="text-xl font-black text-slate-900 tracking-tight">{message}</h5>
                            </div>
                        )}

                        <div>
                            <div className="form-section-label">
                                <div className="section-bullet" />
                                <span className="section-text">Basic Information</span>
                            </div>
                            
                            <div className="input-rows half">
                                <div className="premium-input-wrap">
                                    <label className="premium-label">Username</label>
                                    <div className="premium-field-container">
                                        <User size={18} className="premium-icon-left" />
                                        <input 
                                            type="text" 
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            className="premium-input"
                                            placeholder="Enter username"
                                        />
                                    </div>
                                </div>
                                <div className="premium-input-wrap">
                                    <label className="premium-label">Email</label>
                                    <div className="premium-field-container">
                                        <Mail size={18} className="premium-icon-left" />
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            className="premium-input"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="form-section-label">
                                <div className="section-bullet" />
                                <span className="section-text">Security</span>
                            </div>
                            
                            <div className="input-rows half">
                                <div className="premium-input-wrap">
                                    <label className="premium-label">Current Password</label>
                                    <div className="premium-field-container">
                                        <Lock size={18} className="premium-icon-left" />
                                        <input 
                                            type={showPasswords ? "text" : "password"} 
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                            className="premium-input"
                                            placeholder="••••••••"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPasswords(!showPasswords)}
                                            className="password-toggle-btn"
                                        >
                                            {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="premium-input-wrap">
                                    <label className="premium-label">New Password</label>
                                    <div className="premium-field-container">
                                        <Terminal size={18} className="premium-icon-left" />
                                        <input 
                                            type={showPasswords ? "text" : "password"} 
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                            className="premium-input"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="status-msg-premium error mt-8">
                                    <AlertCircle size={20} />
                                    {message}
                                </div>
                            )}
                        </div>

                        <div className="action-bar">
                            <button 
                                type="submit" 
                                disabled={status === 'loading'}
                                className="submit-btn-premium"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}

export default Profile
