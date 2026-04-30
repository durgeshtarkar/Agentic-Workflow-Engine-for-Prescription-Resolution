import React, { useState, useRef } from 'react'
import { Upload, Send, Sparkles, AlertCircle, FileText, Mic, MicOff } from 'lucide-react'
import { prescriptionService } from '../services/api'
import '../styles/upload.css'

interface PrescriptionUploadProps {
  onComplete: () => void
}

const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ onComplete }) => {
  const [text, setText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('English')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const languages = ["English", "Hindi", "Spanish", "Arabic", "French", "German"]
  const [isListening, setIsListening] = useState(false)
  const [step, setStep] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  const steps = [
    "Agent 0: Initializing Neural Optical Character Recognition (OCR)...",
    "Agent 1: Clinical Entity Recognition & Parameter Extraction...",
    "Agent 2: Compliance Validation against Pharmaco-Safety Indices...",
    "Agent 3: Multi-Parameter Drug-Drug Interaction (DDI) Matrix...",
    "Agent 4: Heuristic Synthesis of Resolution Protocols...",
    "System: Finalizing Secure Clinical Ledger Synchronization..."
  ]

  const toggleListening = () => {
    if (isListening) {
       recognitionRef.current?.stop()
       setIsListening(false)
       return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setText(prev => (prev + " " + finalTranscript).trim())
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error)
      setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const animateWorkflow = async () => {
    for (let i = 0; i < steps.length; i++) {
        setStep(i)
        await new Promise(r => setTimeout(r, 600))
    }
  }

  const handleTextExecute = async () => {
    if (!text.trim()) return
    setIsProcessing(true)
    
    try {
      const apiPromise = prescriptionService.process(text, targetLanguage)
      await animateWorkflow()
      await apiPromise
      setIsProcessing(false)
      onComplete()
    } catch (error: any) {
      console.error("Workflow failed:", error)
      const errorMsg = error.response?.data?.detail || "AI check failed."
      alert("Error: " + errorMsg)
      setIsProcessing(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsProcessing(true)
    
    try {
      const apiPromise = prescriptionService.upload(file, targetLanguage)
      await animateWorkflow()
      await apiPromise
      setIsProcessing(false)
      onComplete()
    } catch (error: any) {
      console.error("Upload failed:", error)
      let errorMsg = "The AI could not read the photo."
      
      if (error.response) {
        // The server responded with a status code
        errorMsg = error.response.data?.detail || "Backend Error"
      } else if (error.request) {
        // The request was made but no response was received
        errorMsg = "No response from Server. Check that the backend is running and reachable."
      } else {
        errorMsg = error.message
      }
      
      alert("Error: " + errorMsg)
      setIsProcessing(false)
    }
  }

  return (
    <div className="intake-container">
      <header className="intake-header">
        <h2 className="intake-title">Scan New Prescription</h2>
        <p className="intake-subtitle">Upload or type your prescription details below for a safety check.</p>
      </header>

      <div className="intake-grid">
        <div className="intake-main-column">
          <div className="intake-card">
            <div className="input-section-header">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-sky-600" />
                <label className="input-section-label">Type Prescription Here</label>
              </div>
              <div className="lang-selector-wrapper">
                <span className="lang-label">Translate to:</span>
                <select 
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="lang-select-fancy"
                >
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="narrative-textarea"
              placeholder="Example: Amoxicillin 500mg, 1 Capsule three times a day for 10 days."
            />
            
            <div className="intake-actions-row">
              <button 
                onClick={handleTextExecute}
                disabled={isProcessing || !text.trim()}
                className="deploy-btn"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AI Checking...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Start AI Safety Check
                  </>
                )}
              </button>

              <button 
                onClick={toggleListening}
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                title={isListening ? "Stop Dictation" : "Voice Dictation"}
              >
                {isListening ? <MicOff size={20} className="text-rose-500 animate-pulse" /> : <Mic size={20} className="text-sky-400" />}
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="upload-btn-secondary"
              >
                <Upload size={24} />
                <span className="hidden sm:inline font-black text-xs uppercase tracking-widest">Upload Photo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pipeline-column">
          {isProcessing ? (
            <div className="pipeline-sticky-panel">
              <div className="workflow-header">
                <Sparkles size={24} className="text-sky-400" />
                <h3 className="workflow-title-tiny">AI Checking Process</h3>
              </div>
              
              <div className="step-list">
                {steps.map((s, i) => (
                  <div key={i} className={`pipeline-step-item ${i <= step ? 'opacity-100' : 'opacity-10'}`}>
                    <div className={`step-indicator ${
                      i < step ? 'done' : i === step ? 'active' : 'pending'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`step-text ${i === step ? 'active' : 'pending'}`}>{s}</span>
                  </div>
                ))}
              </div>
              
              <div className="pipeline-footer">
                <div className="pipeline-stats-header">
                    <span className="pipeline-stats-label">Pipeline Saturation</span>
                    <span className="pipeline-stats-label text-sky-500">Agentic Mode</span>
                </div>
                <div className="pipeline-track">
                    <div 
                        className="pipeline-progress-bar" 
                        style={{ width: `${(step + 1) / steps.length * 100}%` }} 
                    />
                </div>
              </div>
            </div>
          ) : (
            <div className="pipeline-empty-state">
              <div className="placeholder-icon-ring">
                <AlertCircle size={48} className="text-slate-300" />
              </div>
              <h3 className="placeholder-title">Awaiting Instruction</h3>
              <p className="placeholder-subtitle">
                Feed the clinical narrative or upload an image to awaken the autonomous safety agents.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrescriptionUpload
