import React, { useState } from 'react'
import { Search, Activity, BookOpen, AlertCircle, Pill, ShieldCheck, Zap } from 'lucide-react'
import { prescriptionService } from '../services/api'
import '../styles/lookup.css'

interface DrugFactSheet {
  drug_name: string;
  category: string;
  usage: string;
  common_dosages: string[];
  side_effects: string[];
  brand_alternatives: string[];
  contraindications: string[];
  clinical_pearl: string;
}

const DrugLookup: React.FC = () => {
  const [query, setQuery] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('English')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DrugFactSheet | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const languages = ["English", "Hindi", "Spanish", "Arabic", "French", "German"]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const data = await prescriptionService.lookupDrug(query, targetLanguage)
      setResult(data)
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Clinical database timed out or drug not found."
      setError(msg)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lookup-container">
      <header className="lookup-header">
        <div className="lookup-header-top">
          <div>
            <h2 className="header-title-premium">Pharmacological index</h2>
            <p className="header-subtitle-muted">Real-time CDSS drug factor intelligence</p>
          </div>
          <div className="lookup-lang-picker">
              <span className="picker-label">Fact Sheet Language:</span>
              <select 
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="picker-select"
              >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
          </div>
        </div>
      </header>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-bar-wrapper">
          <Search size={24} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search medication name (e.g. Paracetamol, Metformin...)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input-fancy"
          />
          <button type="submit" disabled={loading} className="search-btn-gradient">
            {loading ? <Zap size={20} className="animate-spin" /> : "Analyze"}
          </button>
        </form>
      </div>

      <div className="result-section">
        {loading && (
          <div className="loading-state">
            <div className="scanning-line" />
            <p className="loading-text">Consulting Clinical Knowledge Base...</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <AlertCircle size={24} className="text-rose-500" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="fact-sheet-card">
            <div className="fact-header">
              <div className="flex items-center gap-4">
                <div className="pill-icon-container">
                  <Pill size={32} />
                </div>
                <div>
                  <h3 className="drug-title">{result.drug_name}</h3>
                  <span className="drug-category">{result.category}</span>
                </div>
              </div>
              <div className="verified-badge">
                <ShieldCheck size={14} />
                AI VERIFIED
              </div>
            </div>

            <div className="fact-item fact-full-width-usage">
                <div className="fact-label"><ShieldCheck size={14}/> Therapeutic Usage</div>
                <p className="usage-text">{result.usage}</p>
            </div>

            <div className="fact-grid">
              <div className="fact-item">
                <div className="fact-label"><Activity size={14}/> Common Dosages</div>
                <div className="fact-list">
                  {result.common_dosages.map((d, i) => <span key={i} className="fact-tag dosage">{d}</span>)}
                </div>
              </div>

              <div className="fact-item">
                <div className="fact-label"><BookOpen size={14}/> Brand Alternatives</div>
                <div className="fact-list">
                  {result.brand_alternatives.map((b, i) => <span key={i} className="fact-tag brand">{b}</span>)}
                </div>
              </div>
            </div>

            <div className="fact-full-width">
              <div className="fact-label text-rose-600 dark:text-rose-400">Side Effects & Contraindications</div>
              <div className="side-effects-grid">
                {result.side_effects.map((s, i) => <div key={i} className="list-item">• {s}</div>)}
              </div>
              <div className="contra-list">
                  {result.contraindications.map((c, i) => <div key={i} className="list-item text-amber-700 dark:text-amber-200 font-semibold">⚠ {c}</div>)}
              </div>
            </div>

            <div className="clinical-pearl-box">
               <Zap size={20} className="text-sky-600 dark:text-sky-400" />
               <div>
                  <div className="pearl-label">Clinical Strategist Tip</div>
                  <p className="pearl-text">"{result.clinical_pearl}"</p>
               </div>
            </div>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="lookup-empty">
             <div className="empty-circle">
                <Search size={48} className="text-slate-700" />
             </div>
             <p>Enter any drug name to awaken the Clinical Decision Support AI.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DrugLookup
