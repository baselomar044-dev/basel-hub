'use client'

import { useState, useEffect } from 'react'

interface UserProfileType {
  name: string
  email: string
  job: string
  company: string
  location: string
  interests: string[]
  preferences: {
    language: string
    theme: string
    voiceEnabled: boolean
    autoSave: boolean
  }
}

interface UserProfileProps {
  onComplete?: () => void
  mode?: 'setup' | 'edit'
}

// Simple localStorage-based storage
const storage = {
  getUserProfile: (): UserProfileType | null => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('basel_user_profile')
    return saved ? JSON.parse(saved) : null
  },
  saveUserProfile: (profile: Partial<UserProfileType>) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('basel_user_profile', JSON.stringify(profile))
  }
}

export default function UserProfileSetup({ onComplete, mode = 'setup' }: UserProfileProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<UserProfileType>>({
    name: '',
    email: '',
    job: '',
    company: '',
    location: 'Dubai',
    interests: [],
    preferences: {
      language: 'en',
      theme: 'dark',
      voiceEnabled: true,
      autoSave: true,
    }
  })
  const [customInterest, setCustomInterest] = useState('')

  const interestOptions = [
    { id: 'construction', label: '🏗️ Construction', value: 'construction' },
    { id: 'engineering', label: '⚙️ Engineering', value: 'engineering' },
    { id: 'architecture', label: '🏛️ Architecture', value: 'architecture' },
    { id: 'realestate', label: '🏢 Real Estate', value: 'realestate' },
    { id: 'projectmgmt', label: '📊 Project Management', value: 'project-management' },
    { id: 'qs', label: '📐 Quantity Surveying', value: 'quantity-surveying' },
    { id: 'interior', label: '🎨 Interior Design', value: 'interior-design' },
    { id: 'mep', label: '🔧 MEP', value: 'mep' },
    { id: 'tech', label: '💻 Technology', value: 'technology' },
    { id: 'business', label: '💼 Business', value: 'business' },
  ]

  const jobOptions = [
    'Quantity Surveyor',
    'Project Manager',
    'Civil Engineer',
    'Architect',
    'Site Engineer',
    'MEP Engineer',
    'Contracts Manager',
    'Cost Consultant',
    'Construction Manager',
    'Interior Designer',
    'Other',
  ]

  useEffect(() => {
    const existing = storage.getUserProfile()
    if (existing) {
      setProfile(existing)
      if (mode === 'setup') {
        onComplete?.()
      }
    }
  }, [mode, onComplete])

  const toggleInterest = (value: string) => {
    const current = profile.interests || []
    if (current.includes(value)) {
      setProfile({ ...profile, interests: current.filter(i => i !== value) })
    } else {
      setProfile({ ...profile, interests: [...current, value] })
    }
  }

  const addCustomInterest = () => {
    if (customInterest.trim()) {
      const current = profile.interests || []
      setProfile({ ...profile, interests: [...current, customInterest.trim()] })
      setCustomInterest('')
    }
  }

  const saveProfile = () => {
    storage.saveUserProfile(profile)
    onComplete?.()
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h2>👋 Welcome! Let me know you</h2>
            <p>To help you better, I need to know a bit about you</p>
            
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g., Basel"
              />
            </div>
            
            <div className="form-group">
              <label>Email (optional)</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="example@company.com"
              />
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="step-content">
            <h2>💼 What do you do?</h2>
            <p>This helps me understand your needs better</p>
            
            <div className="form-group">
              <label>Job Title</label>
              <select
                value={profile.job}
                onChange={(e) => setProfile({ ...profile, job: e.target.value })}
              >
                <option value="">Select your job</option>
                {jobOptions.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                placeholder="Company name"
              />
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <select
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              >
                <option value="Dubai">Dubai</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Ajman">Ajman</option>
                <option value="RAK">Ras Al Khaimah</option>
                <option value="Fujairah">Fujairah</option>
                <option value="UAQ">Umm Al Quwain</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="step-content">
            <h2>🎯 Your Interests</h2>
            <p>Select the areas that interest you</p>
            
            <div className="interests-grid">
              {interestOptions.map(opt => (
                <button
                  key={opt.id}
                  className={`interest-btn ${profile.interests?.includes(opt.value) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            
            <div className="custom-interest">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add another interest..."
                onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
              />
              <button onClick={addCustomInterest}>+</button>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="step-content">
            <h2>⚙️ Preferences</h2>
            
            <div className="preference-item">
              <span>🎤 Voice Enabled</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={profile.preferences?.voiceEnabled}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences!, voiceEnabled: e.target.checked }
                  })}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="preference-item">
              <span>💾 Auto Save</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={profile.preferences?.autoSave}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences!, autoSave: e.target.checked }
                  })}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="summary">
              <h3>📋 Summary</h3>
              <div className="summary-item">
                <span>Name:</span>
                <strong>{profile.name || '-'}</strong>
              </div>
              <div className="summary-item">
                <span>Job:</span>
                <strong>{profile.job || '-'}</strong>
              </div>
              <div className="summary-item">
                <span>Company:</span>
                <strong>{profile.company || '-'}</strong>
              </div>
              <div className="summary-item">
                <span>Location:</span>
                <strong>{profile.location || '-'}</strong>
              </div>
              <div className="summary-item">
                <span>Interests:</span>
                <strong>{profile.interests?.length || 0} areas</strong>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="user-profile-setup">
      {/* Progress */}
      <div className="progress">
        {[1, 2, 3, 4].map(s => (
          <div 
            key={s} 
            className={`progress-step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Content */}
      {renderStep()}

      {/* Navigation */}
      <div className="navigation">
        {step > 1 && (
          <button className="btn-secondary" onClick={() => setStep(step - 1)}>
            ← Previous
          </button>
        )}
        <div className="spacer"></div>
        {step < 4 ? (
          <button className="btn-primary" onClick={() => setStep(step + 1)}>
            Next →
          </button>
        ) : (
          <button className="btn-primary" onClick={saveProfile}>
            ✓ Save & Start
          </button>
        )}
      </div>

      {mode === 'setup' && (
        <button className="skip-btn" onClick={onComplete}>
          Skip for now
        </button>
      )}

      <style jsx>{`
        .user-profile-setup {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .progress {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
        }
        
        .progress-step {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          background: #374151;
          color: #9ca3af;
          transition: all 0.3s;
        }
        
        .progress-step.active {
          background: #3b82f6;
          color: white;
        }
        
        .progress-step.current {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
        
        .step-content {
          background: #1f2937;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }
        
        .step-content h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: white;
        }
        
        .step-content p {
          margin: 0 0 20px 0;
          color: #9ca3af;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: white;
        }
        
        .form-group input, .form-group select {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #374151;
          background: #111827;
          color: white;
          font-size: 16px;
        }
        
        .interests-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .interest-btn {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #374151;
          background: #111827;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        
        .interest-btn:hover {
          border-color: #3b82f6;
        }
        
        .interest-btn.selected {
          background: rgba(59, 130, 246, 0.2);
          border-color: #3b82f6;
          color: #3b82f6;
        }
        
        .custom-interest {
          display: flex;
          gap: 8px;
        }
        
        .custom-interest input {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #374151;
          background: #111827;
          color: white;
        }
        
        .custom-interest button {
          width: 40px;
          border-radius: 8px;
          border: none;
          background: #3b82f6;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }
        
        .preference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #374151;
          color: white;
        }
        
        .switch {
          position: relative;
          width: 50px;
          height: 26px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #374151;
          border-radius: 26px;
          transition: 0.3s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }
        
        .switch input:checked + .slider {
          background: #3b82f6;
        }
        
        .switch input:checked + .slider:before {
          transform: translateX(24px);
        }
        
        .summary {
          margin-top: 20px;
          padding: 16px;
          background: #111827;
          border-radius: 12px;
        }
        
        .summary h3 {
          margin: 0 0 12px 0;
          color: white;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #374151;
          color: #9ca3af;
        }
        
        .summary-item strong {
          color: white;
        }
        
        .summary-item:last-child {
          border-bottom: none;
        }
        
        .navigation {
          display: flex;
          gap: 12px;
        }
        
        .spacer {
          flex: 1;
        }
        
        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
        }
        
        .btn-primary:hover {
          background: #2563eb;
        }
        
        .btn-secondary {
          background: transparent;
          color: white;
          border: 1px solid #374151;
        }
        
        .btn-secondary:hover {
          background: #374151;
        }
        
        .skip-btn {
          display: block;
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
