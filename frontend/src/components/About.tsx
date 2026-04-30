import React from 'react'
import { Shield, Users, Zap, Heart, Globe, Activity, Search, Clipboard, UserCheck } from 'lucide-react'
import '../styles/about.css'

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="mission-tag">Our Clinical Core</div>
        <h1 className="about-title">Safety is not an option. <br/> It's a standard.</h1>
        <p className="about-description">
          RxEngine was founded on the belief that medication errors should be a relic of the past. 
          We use proprietary agentic intelligence to ensure every prescription is a promise kept.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <div className="card-icon-box sky">
            <Shield size={24} strokeWidth={3} />
          </div>
          <h3 className="card-title">The Foundation</h3>
          <p className="card-text">
            We built this system from the ground up using real-world pharmacological safety guidelines. 
            No more complex medical jargon—just clear, actionable safety insights.
          </p>
        </div>

        <div className="about-card">
          <div className="card-icon-box emerald">
            <Users size={24} strokeWidth={3} />
          </div>
          <h3 className="card-title">Patient First</h3>
          <p className="card-text">
            Whether you are a doctor at a high-volume hospital or a family caregiver, 
            our system treats every patient identity with the highest clinical rigor.
          </p>
        </div>

        <div className="about-card">
          <div className="card-icon-box indigo">
            <Globe size={24} strokeWidth={3} />
          </div>
          <h3 className="card-title">Global Impact</h3>
          <p className="card-text">
            Our multi-language engine allows clinicians worldwide to process prescriptions in local 
            scripts while maintaining 100% safety check accuracy.
          </p>
        </div>
      </section>

      <section className="agent-showcase">
        <h4 className="agent-title-small">Autonomous Systems</h4>
        <h2 className="agent-main-title">Meet the Clinical Agents</h2>
        
        <div className="agent-grid">
          <div className="agent-item">
            <Search className="text-sky-400 mb-4 mx-auto" size={32} />
            <p className="agent-name">The Linguist</p>
            <p className="agent-role">Deciphers handwriting and translates scripts instantly.</p>
          </div>
          <div className="agent-item">
            <Clipboard className="text-emerald-400 mb-4 mx-auto" size={32} />
            <p className="agent-name">The Pharmacist</p>
            <p className="agent-role">Analyzes drug interactions and pharmacological conflicts.</p>
          </div>
          <div className="agent-item">
            <UserCheck className="text-indigo-400 mb-4 mx-auto" size={32} />
            <p className="agent-name">The Strategist</p>
            <p className="agent-role">Generates resolution protocols and safe alternatives.</p>
          </div>
          <div className="agent-item">
            <Zap className="text-amber-400 mb-4 mx-auto" size={32} />
            <p className="agent-name">The Auditor</p>
            <p className="agent-role">Validates the entire report against safety standards.</p>
          </div>
        </div>
      </section>

      <footer className="about-footer">
          <h3 className="card-title mb-8">Ready to secure your clinical workflow?</h3>
          <button 
            onClick={() => window.location.href = '/login'}
            className="cta-button-about"
          >
            Access the Engine
          </button>
          <p className="mt-12 text-slate-400 font-bold text-xs uppercase tracking-widest">Powered by Agentic Healthcare AI</p>
      </footer>
    </div>
  )
}

export default About
