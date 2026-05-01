import React, { useState, useMemo } from 'react'
import { Search, Calendar, Pill, Clock, AlertTriangle, ChevronRight, User } from 'lucide-react'
import { prescriptionService } from '../services/api'
import '../styles/timeline.css'

interface TimelineMed {
  record_id: string;
  prescribed_at: string;
  name: string;
  dosage: string;
  duration_days?: number;
  start_date?: string;
}

const PatientTimeline: React.FC = () => {
  const [patientName, setPatientName] = useState('')
  const [loading, setLoading] = useState(false)
  const [meds, setMeds] = useState<TimelineMed[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientName.trim()) return
    
    setLoading(true)
    setError(null)
    try {
      const data = await prescriptionService.getPatientTimeline(patientName)
      setMeds(data)
    } catch (err) {
      setError("Failed to fetch patient history.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const { windowStart, windowEnd, timelineDays, totalDays } = useMemo(() => {
    if (meds.length === 0) {
      return { windowStart: new Date(), windowEnd: new Date(), timelineDays: [], totalDays: 14 };
    }
    
    const dates = meds.map(m => new Date(m.prescribed_at).getTime());
    const minDate = new Date(Math.min(...dates));
    minDate.setDate(minDate.getDate() - 2); // 2-day padding at start
    
    const maxDate = new Date(Math.max(...dates));
    maxDate.setDate(maxDate.getDate() + 14); // 14-day buffer for future look
    
    const diffTime = Math.abs(maxDate.getTime() - minDate.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const daysArr = [];
    for (let i = 0; i < daysCount; i += Math.max(1, Math.floor(daysCount / 10))) {
        const d = new Date(minDate);
        d.setDate(d.getDate() + i);
        daysArr.push(d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
    }

    return { 
        windowStart: minDate, 
        windowEnd: maxDate, 
        timelineDays: daysArr, 
        totalDays: daysCount 
    };
  }, [meds]);

  const getPos = (dateStr: string, duration: number = 7) => {
    const start = new Date(dateStr).getTime();
    const windowMin = windowStart.getTime();
    const totalMs = windowEnd.getTime() - windowMin;
    
    const left = ((start - windowMin) / totalMs) * 100;
    const width = ((duration * 24 * 60 * 60 * 1000) / totalMs) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="timeline-container">
      <header className="timeline-header">
        <h2 className="title-premium">Patient Clinical Timeline</h2>
        <p className="subtitle-muted">Aggregated medication journey mapping</p>
      </header>

      <div className="timeline-search-section">
        <form onSubmit={handleSearch} className="tl-search-bar">
          <User className="tl-icon" size={20} />
          <input 
            type="text" 
            placeholder="Enter Patient Name (e.g. Rajesh Kumar)..." 
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="tl-input"
          />
          <button type="submit" disabled={loading} className="tl-btn">
            {loading ? "Syncing..." : "Process History"}
          </button>
        </form>
      </div>

      <div className="timeline-view">
        {loading && (
            <div className="tl-loading">
                <div className="tl-pulse" />
                <p>Retrieving Clinical Ledger...</p>
            </div>
        )}

        {meds.length > 0 && (
          <div className="gantt-wrapper">
             <div className="gantt-header" style={{ gridTemplateColumns: `15rem repeat(${timelineDays.length}, 1fr)` }}>
                <div className="gantt-col-med">Medication</div>
                {timelineDays.map((day, i) => (
                    <div key={i} className="gantt-col-day">{day}</div>
                ))}
             </div>

             <div className="gantt-body">
                {meds.map((med, idx) => {
                    const duration = med.duration_days || 7;
                    const { left, width } = getPos(med.prescribed_at, duration);
                    
                    return (
                        <div key={idx} className="gantt-row">
                            <div className="med-info-col">
                                <div className="flex items-center gap-2">
                                    <Pill size={14} className="text-sky-500" />
                                    <span className="med-name">{med.name}</span>
                                </div>
                                <span className="med-dosage-tl">{med.dosage}</span>
                            </div>
                            <div className="timeline-track-tl">
                                <div 
                                    className="gantt-bar" 
                                    style={{ left, width }}
                                >
                                    <div className="bar-label">{duration} days</div>
                                    {duration > 10 && <div className="long-term-indicator"><Clock size={10} /> LONG TERM</div>}
                                </div>
                            </div>
                        </div>
                    )
                })}
             </div>
          </div>
        )}

        {meds.length === 0 && !loading && (
            <div className="tl-empty">
                <Calendar size={64} className="opacity-10 mb-4" />
                <p>No medication history found for this patient identity.</p>
            </div>
        )}
      </div>

      <div className="tl-legend">
         <div className="legend-item"><div className="legend-dot sky" /> Active Treatment</div>
         <div className="legend-item"><div className="legend-dot amber" /> Overlap detected</div>
         <div className="legend-item"><div className="legend-dot rose" /> Safety Warning</div>
      </div>
    </div>
  )
}

export default PatientTimeline
