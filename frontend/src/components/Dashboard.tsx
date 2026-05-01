import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, Clock,
  Brain, FileText, Info,
  ShieldAlert, Zap, Activity, Download, Trash2
} from 'lucide-react'
import { prescriptionService } from '../services/api'
import '../styles/dashboard.css'

interface Prescription {
  _id: string
  filename: string
  analysis: {
    patient_info: { name: string, age: string, date: string }
    medications: Array<{ name: string, dosage: string, frequency: string, instructions: string }>
    doctor_info: { name: string, specialty: string }
    clinical_assessment: {
      confidence_score: number
      warnings: string[]
      summary: string
    }
  }
  created_at: string
}

import { generatePrescriptionPDF } from '../utils/pdfGenerator'

const Dashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  // Tab Management
  const [activeTab, setActiveTab] = useState<'summary' | 'medications' | 'warnings'>('summary')

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await prescriptionService.list()
        setPrescriptions(data || [])
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPrescriptions()
    const interval = setInterval(fetchPrescriptions, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await prescriptionService.delete(id)
      setPrescriptions(prev => prev.filter(p => p._id !== id))
      if (selectedId === id) setSelectedId(null)
    } catch (error) {
      console.error("Failed to delete record:", error)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing with Clinical Ledger...</p>
    </div>
  )

  const selectedPx = prescriptions.find(p => p._id === selectedId)

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="flex justify-between items-end w-full">
          <div>
            <h2 className="header-title">Clinical Decision Support</h2>
            <p className="header-subtitle text-sky-600 dark:text-sky-400 font-black uppercase tracking-[0.2em] text-[0.6rem]">Autonomous Safety Observation & OCR Engine</p>
          </div>
          <div className="flex gap-4 mb-2">
            <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 flex flex-col items-center min-w-[120px]">
                <div className={`flex items-center gap-2 text-[0.5rem] font-black uppercase tracking-[0.2em] mb-1 text-slate-400 dark:text-white/50`}>
                  <FileText size={14}/>
                  Records
                </div>
                <div className={`text-sm font-black tracking-wider text-slate-900 dark:text-white`}>
                  {prescriptions.length}
                </div>
              </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content-grid">
        <div className="resolutions-column">
          {prescriptions.length === 0 ? (
            <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-20 text-center">
              <p className="text-slate-400 font-black uppercase tracking-widest">No Active Records</p>
            </div>
          ) : (
            prescriptions.map((px) => (
              <div 
                key={px._id} 
                onClick={() => setSelectedId(px._id)}
                className={`resolution-card ${selectedId === px._id ? 'selected' : ''}`}
              >
                <div className={`status-indicator ${px.analysis?.clinical_assessment?.warnings?.length > 0 ? 'conflict' : 'safe'}`} />
                <div className="card-main">
                  <div className="card-info">
                    <div className={`card-icon-container ${px.analysis?.clinical_assessment?.warnings?.length > 0 ? 'conflict' : 'safe'}`}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="drug-name">
                        {px.analysis?.patient_info?.name || 'Anonymous Patient'}
                      </h3>
                      <p className="timestamp">
                        <Clock size={12} /> {new Date(px.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="status-badge-container">
                    <span className={`status-badge ${px.analysis?.clinical_assessment?.confidence_score > 80 ? 'emerald' : 'amber'}`}>
                      {px.analysis?.clinical_assessment?.confidence_score || 0}% Match
                    </span>
                    <p className="prescription-id">ID: {px._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="details-column">
          <div className="sticky-panel">
            {selectedPx ? (
              <div id="ai-report-content" className="details-panel">
                <div className="panel-header panel-section">
                    <div className="panel-header-info">
                        <div className="panel-icon-bg">
                            <Brain size={28} className="text-white" />
                        </div>
                        <h4 className="panel-title">AI Analysis Results</h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={async () => await generatePrescriptionPDF(selectedPx.analysis as any, selectedPx._id)}
                            className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-400/20" 
                            title="Download Report"
                        >
                            <Download size={18} />
                        </button>
                        <button onClick={() => handleDelete(selectedPx._id)} className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-400/20">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center gap-8 mb-8 p-6 bg-slate-100 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/5 mx-6">
                    <div className="relative">
                      <Zap size={32} className={selectedPx?.analysis?.clinical_assessment?.warnings?.length > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'} />
                    </div>
                    <div>
                      <h5 className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Safety Status</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {selectedPx?.analysis?.clinical_assessment?.warnings?.length > 0 
                          ? `${selectedPx.analysis.clinical_assessment.warnings.length} Issues Detected` 
                          : 'Cleared by Clinical AI'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl mb-6 mx-6">
                    {['summary', 'medications', 'warnings'].map(t => (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t as any)}
                        className={`flex-1 py-2.5 rounded-xl text-[0.6rem] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="scrollable-details flex-1 overflow-y-auto px-6 pb-6">
                    {activeTab === 'summary' && (
                      <div className="space-y-6">
                        <div className="data-box bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                            <div className="text-[0.55rem] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Patient Profile</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[0.5rem] text-slate-500 uppercase mb-1">Name</div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedPx.analysis?.patient_info?.name || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-[0.5rem] text-slate-500 uppercase mb-1">Age</div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedPx.analysis?.patient_info?.age || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="data-box bg-sky-50 dark:bg-sky-500/5 p-6 rounded-3xl border border-sky-100 dark:border-sky-500/10">
                            <div className="text-[0.55rem] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-4">Clinical Summary</div>
                            <div className="text-sm italic text-sky-900 dark:text-sky-100 leading-relaxed font-medium">"{selectedPx.analysis?.clinical_assessment?.summary || 'No summary available.'}"</div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'medications' && (
                      <div className="space-y-4">
                        {selectedPx.analysis?.medications?.map((med, i) => (
                          <div key={i} className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2rem] hover:border-sky-500/30 transition-all">
                              <div className="flex justify-between items-start mb-3">
                                <div className="text-sm font-black text-sky-600 dark:text-sky-400">{med.name}</div>
                                <div className="px-2 py-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded text-[0.5rem] font-black uppercase">{med.dosage}</div>
                              </div>
                              <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-1.5 text-[0.6rem] text-slate-600 dark:text-slate-400">
                                    <Activity size={12} />
                                    {med.frequency}
                                </div>
                                <div className="flex items-center gap-1.5 text-[0.6rem] text-slate-600 dark:text-slate-400">
                                    <Info size={12} />
                                    {med.instructions}
                                </div>
                              </div>
                          </div>
                        )) || <p className="text-center text-slate-500 py-10">No medications identified.</p>}
                      </div>
                    )}

                    {activeTab === 'warnings' && (
                      <div className="space-y-3">
                        {selectedPx?.analysis?.clinical_assessment?.warnings?.length > 0 ? (
                           selectedPx.analysis.clinical_assessment.warnings.map((w, i) => (
                            <div key={i} className="p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-4 text-amber-900 dark:text-amber-200">
                                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                                <span className="text-[0.7rem] font-bold leading-relaxed">{w}</span>
                            </div>
                           ))
                        ) : (
                          <div className="p-10 text-center bg-white/5 rounded-[2.5rem] border border-white/5">
                              <CheckCircle size={32} className="mx-auto mb-4 text-emerald-400" />
                              <p className="text-[0.6rem] font-black uppercase text-slate-500">No Security Risks Detected</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* REAL-TIME AGENT CHAT SECTION */}
                  <div className="mt-auto border-t border-white/5 p-6 bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h5 className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">Clinical Query Interface</h5>
                    </div>
                    <AgentChat prescriptionId={selectedPx._id} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-panel h-full flex items-center justify-center text-center p-20 opacity-30">
                 <div>
                    <Activity size={48} className="mx-auto mb-4" />
                    <p className="text-[0.6rem] font-black uppercase tracking-widest">Select clinical record for AI Review</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const AgentChat: React.FC<{ prescriptionId: string }> = ({ prescriptionId }) => {
    const [msg, setMsg] = useState('')
    const [chat, setChat] = useState<{q: string, a: string}[]>([])
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!msg.trim()) return
        setLoading(true)
        const currentQ = msg
        setMsg('')
        try {
            const res = await prescriptionService.chat(prescriptionId, 'Clinical Strategist', currentQ)
            setChat(prev => [...prev, { q: currentQ, a: res.answer }])
        } catch (e) {
            setChat(prev => [...prev, { q: currentQ, a: "Error: Clinical cloud disconnected." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {chat.map((c, i) => (
                    <div key={i} className="space-y-2">
                        <div className="text-[0.65rem] text-sky-600 dark:text-sky-400 font-bold ml-auto text-right">You: {c.q}</div>
                        <div className="text-[0.65rem] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 p-3 rounded-2xl italic leading-relaxed">Agent: {c.a}</div>
                    </div>
                ))}
                {loading && <div className="text-[0.6rem] text-slate-500 animate-pulse">Agent is thinking...</div>}
            </div>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about medications, risks..."
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-sky-500/50 outline-none transition-all"
                />
                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-sky-500 hover:bg-sky-400 text-white px-4 rounded-xl transition-all disabled:opacity-50"
                >
                    <Zap size={16} />
                </button>
            </div>
        </div>
    )
}

export default Dashboard
