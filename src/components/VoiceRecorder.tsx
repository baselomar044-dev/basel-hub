'use client'

import { useState, useRef, useEffect } from 'react'

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
  onRecordingChange?: (isRecording: boolean) => void
  language?: string
}

export default function VoiceRecorder({ onTranscript, onRecordingChange, language = 'ar' }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      })
      
      // Set up audio analysis for visual feedback
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser
      
      // Animate audio level
      const updateLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(average / 255)
        }
        animationRef.current = requestAnimationFrame(updateLevel)
      }
      updateLevel()
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        // Clean up
        stream.getTracks().forEach(track => track.stop())
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
        setAudioLevel(0)
        
        // Process audio
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudio(audioBlob)
      }
      
      mediaRecorder.start(100)
      setIsRecording(true)
      onRecordingChange?.(true)
      
      // Start timer
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
      
    } catch (err) {
      console.error('Recording error:', err)
      setError('لا يمكن الوصول للميكروفون. تأكد من السماح بالوصول.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      onRecordingChange?.(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    
    try {
      // Convert to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1]
          resolve(base64)
        }
      })
      reader.readAsDataURL(audioBlob)
      const base64Audio = await base64Promise
      
      // Send to transcription API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          audio: base64Audio,
          language: language 
        }),
      })
      
      if (!response.ok) {
        throw new Error('Transcription failed')
      }
      
      const data = await response.json()
      
      if (data.text) {
        onTranscript(data.text)
      } else {
        setError('لم يتم التعرف على الكلام. حاول مرة أخرى.')
      }
      
    } catch (err) {
      console.error('Processing error:', err)
      // Fallback: use browser's speech recognition
      useBrowserSpeechRecognition()
    } finally {
      setIsProcessing(false)
    }
  }

  const useBrowserSpeechRecognition = () => {
    // @ts-ignore - SpeechRecognition may not be in types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError('متصفحك لا يدعم التعرف على الصوت')
      return
    }
    
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
    }
    
    recognition.onerror = () => {
      setError('فشل التعرف على الصوت. حاول مرة أخرى.')
    }
    
    recognition.start()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="voice-recorder">
      {error && (
        <div className="voice-error">
          ⚠️ {error}
        </div>
      )}
      
      {isProcessing ? (
        <div className="voice-processing">
          <div className="processing-spinner"></div>
          <span>جاري التحويل...</span>
        </div>
      ) : isRecording ? (
        <div className="voice-recording">
          <div 
            className="audio-visualizer"
            style={{ 
              transform: `scale(${1 + audioLevel * 0.5})`,
              opacity: 0.5 + audioLevel * 0.5 
            }}
          ></div>
          <div className="recording-info">
            <span className="recording-dot"></span>
            <span className="recording-time">{formatTime(recordingTime)}</span>
          </div>
          <button 
            className="stop-button"
            onClick={stopRecording}
            title="إيقاف التسجيل"
          >
            ⬛
          </button>
        </div>
      ) : (
        <button 
          className="record-button"
          onClick={startRecording}
          title="تسجيل صوتي"
        >
          🎤
        </button>
      )}

      <style jsx>{`
        .voice-recorder {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .voice-error {
          font-size: 12px;
          color: #ef4444;
          padding: 4px 8px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 4px;
        }
        
        .voice-processing {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 20px;
          color: #3b82f6;
          font-size: 14px;
        }
        
        .processing-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #3b82f6;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .voice-recording {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 25px;
          position: relative;
        }
        
        .audio-visualizer {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: rgba(239, 68, 68, 0.2);
          border-radius: 25px;
          transition: transform 0.1s, opacity 0.1s;
          z-index: 0;
        }
        
        .recording-info {
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 1;
        }
        
        .recording-dot {
          width: 10px;
          height: 10px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1s ease-in-out infinite;
        }
        
        .recording-time {
          font-family: monospace;
          font-size: 14px;
          color: #ef4444;
          font-weight: 600;
        }
        
        .record-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .record-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .stop-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #ef4444;
          color: white;
          font-size: 12px;
          cursor: pointer;
          z-index: 1;
          transition: all 0.2s;
        }
        
        .stop-button:hover {
          background: #dc2626;
          transform: scale(1.1);
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
