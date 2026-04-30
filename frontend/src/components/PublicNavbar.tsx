import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const PublicNavbar: React.FC = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-secondary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-sky-600 p-2 rounded-xl text-white shadow-lg shadow-sky-200 dark:shadow-sky-900/20 group-hover:scale-110 transition-transform">
            <LogoIcon />
          </div>
          <span className="font-black text-2xl tracking-tighter text-[var(--text-primary)]">RxEngine</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-sm font-bold text-[var(--text-secondary)] hover:text-sky-600 transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-bold text-[var(--text-secondary)] hover:text-sky-600 transition-colors">About Us</Link>
          <ThemeToggle />
          <button 
            onClick={() => navigate('/login')}
            className="bg-slate-900 dark:bg-sky-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 dark:shadow-sky-900/40 whitespace-nowrap"
          >
            Portal Login
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-600 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link to="/" className="block font-bold text-slate-600 dark:text-slate-300" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="block font-bold text-slate-600 dark:text-slate-300" onClick={() => setIsOpen(false)}>About Us</Link>
          <ThemeToggle />
          <button 
            onClick={() => { navigate('/login'); setIsOpen(false); }}
            className="w-full bg-slate-900 dark:bg-sky-600 text-white py-4 rounded-xl font-bold"
          >
            Portal Login
          </button>
        </div>
      )}
    </nav>
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
  
export default PublicNavbar
