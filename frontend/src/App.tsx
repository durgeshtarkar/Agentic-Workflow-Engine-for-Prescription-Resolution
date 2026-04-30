import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import PrescriptionUpload from './components/PrescriptionUpload'
import Landing from './components/Landing'
import About from './components/About'
import PublicNavbar from './components/PublicNavbar'
import AlertLogs from './components/AlertLogs'
import Profile from './components/Profile'
import DrugLookup from './components/DrugLookup'
import PatientTimeline from './components/PatientTimeline'
import { Upload, LogOut, Grid, Shield, Bell, User, Search, Calendar, Info } from 'lucide-react'
import ThemeToggle from './components/ThemeToggle'
import './styles/layout.css'
import './styles/lookup.css'
import './styles/timeline.css'
import './styles/about.css'

interface UserState {
  username: string
  role: string
}

const LandingWrapper: React.FC = () => {
  const navigate = useNavigate()
  return <Landing onStart={() => navigate('/login')} />
}

const App: React.FC = () => {
  const [user, setUser] = useState<UserState | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      if (!saved || saved === "undefined") return null;
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse user from storage", e);
      return null;
    }
  })

  const handleLogin = (u: any) => {
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
    if (u.token) {
      localStorage.setItem('token', u.token)
    }
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<PublicPage user={user}><LandingWrapper /></PublicPage>} />
          <Route path="/about" element={<PublicPage user={user}><About /></PublicPage>} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={handleLogin} />} />
          <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute user={user}><PrescriptionUpload onComplete={() => window.location.href='/dashboard'} /></ProtectedRoute>} />
          <Route path="/drugs" element={<ProtectedRoute user={user}><DrugLookup /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute user={user}><PatientTimeline /></ProtectedRoute>} />

          <Route path="/alerts" element={<ProtectedRoute user={user}><AlertLogs /></ProtectedRoute>} />

          <Route path="/profile" element={<ProtectedRoute user={user}><Profile onUpdateUser={handleLogin} /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

const PublicPage: React.FC<{ children: React.ReactNode, user: UserState | null }> = ({ children, user }) => {
  return (
    <>
      {!user && <PublicNavbar />}
      {children}
    </>
  )
}

const ProtectedRoute: React.FC<{ children: React.ReactNode, user: UserState | null }> = ({ children, user }) => {
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-container" style={{ flexDirection: 'row' }}>
      <nav className="sidebar scrollbar-hide">
        <div className="sidebar-header">
          <div className="brand-icon">
             <LogoIcon />
          </div>
          <h1 className="brand-name">RxEngine <span className="brand-dot">.</span></h1>
        </div>

        <div className="nav-section">
          <p className="nav-label">Services</p>
          <Link 
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : 'inactive'}`}
          >
            <Grid size={18} />
            <span>Safety Check</span>
            {location.pathname === '/dashboard' && <div className="active-indicator" />}
          </Link>
          <Link 
            to="/upload"
            className={`nav-link ${location.pathname === '/upload' ? 'active' : 'inactive'}`}
          >
            <Upload size={18} />
            <span>Scan Prescription</span>
            {location.pathname === '/upload' && <div className="active-indicator" />}
          </Link>
          <Link 
            to="/drugs"
            className={`nav-link ${location.pathname === '/drugs' ? 'active' : 'inactive'}`}
          >
            <Search size={18} />
            <span>Drug Finder</span>
            {location.pathname === '/drugs' && <div className="active-indicator" />}
          </Link>
          <Link 
            to="/timeline"
            className={`nav-link ${location.pathname === '/timeline' ? 'active' : 'inactive'}`}
          >
            <Calendar size={18} />
            <span>Patient Timeline</span>
            {location.pathname === '/timeline' && <div className="active-indicator" />}
          </Link>

          
          <div className="pt-8">
            <p className="nav-label">System</p>
            <Link 
                to="/alerts"
                className={`nav-link ${location.pathname === '/alerts' ? 'active' : 'inactive'}`}
            >
                <Bell size={18} />
                <span>Alerts</span>
                {location.pathname === '/alerts' && <div className="active-indicator rose" />}
            </Link>

            <Link 
                to="/profile"
                className={`nav-link ${location.pathname === '/profile' ? 'active' : 'inactive'}`}
            >
                <User size={18} />
                <span>Account</span>
                {location.pathname === '/profile' && <div className="active-indicator" />}
            </Link>
          </div>
        </div>

        <div className="sidebar-footer">
           <div className="mb-6">
             <ThemeToggle />
           </div>
           <div className="user-card">
              <div className="user-avatar">
                {user?.username ? user.username[0].toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <p className="user-name">{user?.username || 'User'}</p>
                <div className="user-role-badge">
                    <Shield size={10} className="text-sky-600" />
                    <p className="user-role-text">{user?.role || 'Clinician'}</p>
                </div>
              </div>
           </div>
          <button 
            onClick={() => {
              localStorage.removeItem('user')
              localStorage.removeItem('token')
              window.location.href = '/'
            }}
            className="logout-btn"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </nav>

      <main className="main-layout">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  )
}

const LogoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M22 7L12 12L2 7M22 7L12 2L2 7M22 7V17L12 22L2 17V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
)

export default App
