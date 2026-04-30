import React, { useState, useEffect } from 'react'
import { AlertTriangle, Clock, Shield, Search, Filter, Trash2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { prescriptionService } from '../services/api'
import '../styles/alerts.css'

interface ConflictRecord {
  _id: string
  drug_name: string
  severity: string
  type: string
  description: string
  created_at: string
}

const AlertLogs: React.FC = () => {
  const [alerts, setAlerts] = useState<ConflictRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null)

  const fetchAlerts = async () => {
    try {
      const data = await prescriptionService.list()
      const allAlerts: ConflictRecord[] = []
      
      data.forEach((px: any) => {
        // Fix: Data is nested inside the 'analysis' object
        const conflicts = px.analysis?.conflicts || []
        
        conflicts.forEach((c: any) => {
          allAlerts.push({
            _id: px._id,
            // Use the first medication or patient name as a descriptor
            drug_name: px.analysis?.medications?.[0]?.name || px.analysis?.patient_info?.name || 'Clinical Case',
            severity: c.severity || 'medium',
            type: c.conflict_type || 'Safety Alert',
            description: c.description || 'Review required by clinician.',
            created_at: px.created_at
          })
        })
      })
      
      setAlerts(allAlerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
    } catch (error) {
      console.error("Failed to fetch alert logs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await prescriptionService.delete(id)
      setDeleteStatus(id)
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a._id !== id))
        setDeleteStatus(null)
      }, 1000)
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete record from ledger.")
    }
  }

  const filteredAlerts = alerts.filter(a => 
    a.drug_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="alerts-container">
      <header className="alerts-header">
        <div>
          <h2 className="header-title-italic">Alert History</h2>
          <p className="header-subtitle-muted">View all past safety alerts and notifications</p>
        </div>
        <div className="alerts-toolbar">
            <div className="search-input-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search clinical alerts..." 
                  className="search-field-tiny" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="filter-btn-round">
                <Filter size={18} />
            </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Querying Safety Matrix...</p>
        </div>
      ) : (
        <div className="alerts-list">
          <AnimatePresence>
            {filteredAlerts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="alerts-empty-panel"
              >
                <div className="empty-alert-icon-ring">
                  <Shield className="text-emerald-500" size={32} />
                </div>
                <h3 className="placeholder-title">No Matches Found</h3>
                <p className="header-subtitle-muted">Refine your search parameters or check the resolution ledger.</p>
              </motion.div>
            ) : (
              filteredAlerts.map((alert, i) => (
                <motion.div 
                  key={`${alert._id}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`alert-card-premium ${deleteStatus === alert._id ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className={`alert-severity-indicator ${alert.severity === 'high' ? 'high' : 'medium'}`} />
                  
                  <div className="alert-card-inner">
                    <div className="alert-main-content">
                      <div className={`alert-icon-box ${alert.severity === 'high' ? 'high' : 'medium'}`}>
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="alert-drug-name-italic">{alert.drug_name}</h4>
                          <span className={`severity-tag ${alert.severity === 'high' ? 'high' : 'medium'}`}>
                            {alert.severity} Priority
                          </span>
                        </div>
                        <p className="alert-description-text">{alert.description}</p>
                      </div>
                    </div>
                    
                    <div className="alert-meta">
                      <button 
                        onClick={() => handleDelete(alert._id)}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Purge from ledger"
                      >
                        {deleteStatus === alert._id ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Trash2 size={20} />}
                      </button>
                      <div className="text-right">
                        <div className="alert-timestamp-badge justify-end">
                          <Clock size={14} />
                          {new Date(alert.created_at).toLocaleDateString()}
                        </div>
                        <p className="alert-reference-code">Ref: {alert._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default AlertLogs
