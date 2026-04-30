import React from 'react'
import { ArrowRight, Activity, Check } from 'lucide-react'

interface LandingProps {
  onStart: () => void
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-secondary)] pt-24 w-full transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-50/50 dark:bg-sky-900/20 -skew-x-12 translate-x-32 z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-sm font-bold mb-8 animate-in fade-in slide-in-from-left duration-700">
              <Sparkles size={16} />
              <span>Making clinical prescriptions 100% safe for everyone</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              Stop medication errors <br/>
              <span className="text-sky-600 dark:text-sky-400">before they happen.</span>
            </h1>
            
            <p className="text-xl text-slate-500 dark:text-slate-300 font-medium leading-relaxed mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
              RxEngine uses friendly AI assistants to read your doctor's handwriting, check for dangerous drug mixtures, and ensure the right dose for your age—all in under 2 seconds.
            </p>
            
            <div className="flex flex-wrap gap-6 animate-in fade-in zoom-in duration-1000">
              <button 
                onClick={onStart}
                className="bg-sky-600 hover:bg-sky-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-sky-200 dark:shadow-sky-900/20 transition-all flex items-center gap-3 transform active:scale-95 group"
              >
                Scan Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Workflow Section */}
      <section className="py-32 bg-[var(--bg-primary)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <h2 className="text-[0.65rem] font-black text-sky-600 dark:text-sky-400 uppercase tracking-[0.4em]">The Intelligence</h2>
              <h3 className="text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
                An Expert Assistant <br/> That Never <span className="text-sky-600 dark:text-sky-400 italic">Sleeps.</span>
              </h3>
              <p className="text-xl text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                RxEngine is built to support busy doctors and pharmacists, acting as a second pair of eyes to catch small mistakes that can save lives.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Smart Double-Checking", desc: "Always checks against global health safety standards." },
                  { title: "Friendly Explanations", desc: "No confusing medical jargon. Just clear safety advice." },
                  { title: "Patient-Focused", desc: "Designed to keep every family member safe and informed." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 bg-sky-100 dark:bg-sky-900/50 p-1.5 rounded-full text-sky-600 dark:text-sky-400 h-fit">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-300 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right duration-1000">
              <div className="absolute -inset-10 bg-sky-200/20 dark:bg-sky-900/20 blur-[100px] rounded-full" />
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-2xl shadow-sky-900/10 dark:shadow-black/50 relative z-10">
                <div className="flex items-center gap-4 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                  <div className="bg-sky-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-200 dark:shadow-sky-900/40">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 dark:text-white text-lg tracking-tight">Active Safety Check</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Running in background</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Reading Prescription", progress: 100, status: "Done" },
                    { label: "Checking Interactions", progress: 65, status: "Checking" },
                    { label: "Calculating Dose", progress: 0, status: "Ready" }
                  ].map((s, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[0.65rem] font-black uppercase tracking-widest">
                        <span className="text-slate-400 dark:text-slate-300">{s.label}</span>
                        <span className={s.status === 'Checking' ? 'text-sky-600 dark:text-sky-400 animate-pulse' : 'text-slate-400 dark:text-slate-300'}>{s.status}</span>
                      </div>
                      <div className="h-3 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
                        <div 
                          className={`h-full transition-all duration-1000 ${s.status === 'Done' ? 'bg-emerald-500' : 'bg-sky-600'}`}
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <p className="text-slate-400 dark:text-slate-300 font-black text-xs uppercase tracking-[0.3em] mb-12">Trusted by Leading Institutions</p>
            <div className="flex flex-wrap justify-center gap-16 opacity-30 dark:opacity-50 grayscale items-center">
                <div className="text-2xl font-black text-[var(--text-primary)]">HEALTHSYNC</div>
                <div className="text-2xl font-black text-[var(--text-primary)]">MEDCORE</div>
                <div className="text-2xl font-black text-[var(--text-primary)]">BIOVANT</div>
                <div className="text-2xl font-black text-[var(--text-primary)]">UNITYLABS</div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
                <div className="bg-sky-500 p-2 rounded-lg">
                    <Activity size={20} />
                </div>
                <span className="font-black text-xl tracking-tighter">RxEngine</span>
            </div>
            <div className="flex gap-10 text-slate-400 text-sm font-bold">
                <a href="#" className="hover:text-white transition-colors">Safety Standards</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Get Help</a>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium italic">© 2026 Caring AI Healthcare Systems.</p>
        </div>
      </footer>
    </div>
  )
}

const Sparkles: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
)

export default Landing
