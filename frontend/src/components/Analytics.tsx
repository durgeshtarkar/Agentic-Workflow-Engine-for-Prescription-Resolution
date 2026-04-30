import React from 'react'
import { Activity, ShieldAlert, CheckCircle, BarChart2, TrendingUp, Zap } from 'lucide-react'
import '../styles/dashboard.css'

interface AnalyticsProps {
  stats: {
    total: number
    conflicts: number
    safe: number
    avgConfidence: number
  }
}

const Analytics: React.FC<AnalyticsProps> = ({ stats }) => {
  return (
    <div className="analytics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <StatCard 
        title="Total Samples" 
        value={stats.total} 
        icon={<Activity size={20} />} 
        color="sky"
        subtitle="Analyses completed"
      />
      <StatCard 
        title="Risks Detected" 
        value={stats.conflicts} 
        icon={<ShieldAlert size={20} />} 
        color="rose"
        subtitle={`${((stats.conflicts / (stats.total || 1)) * 100).toFixed(1)}% of total`}
      />
      <StatCard 
        title="Cleared Safe" 
        value={stats.safe} 
        icon={<CheckCircle size={20} />} 
        color="emerald"
        subtitle="No interventions needed"
      />
      <StatCard 
        title="Avg. Confidence" 
        value={`${stats.avgConfidence}%`} 
        icon={<Zap size={20} />} 
        color="amber"
        subtitle="Llama 4 Vision accuracy"
      />
    </div>
  )
}

const StatCard: React.FC<{ title: string, value: string | number, icon: any, color: string, subtitle: string }> = ({ title, value, icon, color, subtitle }) => {
  const colors: any = {
    sky: 'from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/20',
    rose: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20'
  }

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-[2rem] p-6 backdrop-blur-xl hover:scale-[1.02] transition-all duration-500`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl">
          {icon}
        </div>
        <TrendingUp size={16} className="opacity-30" />
      </div>
      <div>
        <h4 className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{title}</h4>
        <div className="text-2xl font-black tracking-tight mb-2">{value}</div>
        <p className="text-[0.55rem] font-medium opacity-40">{subtitle}</p>
      </div>
    </div>
  )
}

export default Analytics
