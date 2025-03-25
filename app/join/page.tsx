"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createLocalTracks, LocalTrack, VideoPresets } from "livekit-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function JoinPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([])
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioLevelRef = useRef<HTMLDivElement>(null)

  // Initialize camera and microphone preview
  useEffect(() => {
    let audioAnalyzer: AnalyserNode | null = null
    let audioContext: AudioContext | null = null
    let animationFrame: number | null = null

    async function initializePreview() {
      try {
        setIsLoading(true)
        const tracks = await createLocalTracks({
          audio: true,
          video: {
            resolution: VideoPresets.h720.resolution,
          }
        })
        
        setLocalTracks(tracks)
        setIsLoading(false)
        
        // Set up video preview
        const videoTrack = tracks.find(track => track.kind === 'video')
        if (videoTrack && videoRef.current) {
          videoTrack.attach(videoRef.current)
        }
        
        // Set up audio visualization
        const audioTrack = tracks.find(track => track.kind === 'audio')
        if (audioTrack && audioLevelRef.current) {
          const mediaStreamTrack = audioTrack.mediaStreamTrack
          try {
            audioContext = new AudioContext()
            // Resume the audio context - needed for browsers with autoplay policy
            await audioContext.resume()
            
            const source = audioContext.createMediaStreamSource(new MediaStream([mediaStreamTrack]))
            audioAnalyzer = audioContext.createAnalyser()
            audioAnalyzer.fftSize = 256
            source.connect(audioAnalyzer)
            
            const bufferLength = audioAnalyzer.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)
            
            const updateAudioLevel = () => {
              if (!audioAnalyzer || !audioLevelRef.current || audioContext?.state === 'closed') return
              
              try {
                audioAnalyzer.getByteFrequencyData(dataArray)
                let sum = 0
                for (let i = 0; i < bufferLength; i++) {
                  sum += dataArray[i]
                }
                
                const average = sum / bufferLength
                const level = Math.min(100, average * 2) // Scale to percentage
                
                audioLevelRef.current.style.width = `${level}%`
                
                // Set the color based on the audio level
                if (level < 33) {
                  audioLevelRef.current.style.backgroundColor = "#ef4444"; // Red
                } else if (level < 66) {
                  audioLevelRef.current.style.backgroundColor = "#fbbf24"; // Yellow/Orange
                } else {
                  audioLevelRef.current.style.backgroundColor = "#4ade80"; // Green
                }
              } catch (err) {
                console.error('Error processing audio data:', err)
              }
              
              animationFrame = requestAnimationFrame(updateAudioLevel)
            }
            
            updateAudioLevel()
          } catch (err) {
            console.error('Error setting up audio context:', err)
          }
        }
      } catch (err) {
        console.error('Failed to create local tracks', err)
        setError('Could not access camera or microphone. Please check your permissions.')
        setIsLoading(false)
      }
    }

    initializePreview()

    // Cleanup function
    return () => {
      localTracks.forEach(track => track.stop())
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      if (audioContext && audioContext.state !== 'closed') {
        try {
          audioContext.close()
        } catch (err) {
          console.error('Error closing audio context:', err)
        }
      }
    }
  }, [])

  const toggleAudio = () => {
    const audioTrack = localTracks.find(track => track.kind === 'audio')
    if (audioTrack) {
      if (audioEnabled) {
        audioTrack.mute()
      } else {
        audioTrack.unmute()
      }
      setAudioEnabled(!audioEnabled)
    }
  }

  const toggleVideo = () => {
    const videoTrack = localTracks.find(track => track.kind === 'video')
    if (videoTrack) {
      if (videoEnabled) {
        videoTrack.mute()
      } else {
        videoTrack.unmute()
      }
      setVideoEnabled(!videoEnabled)
    }
  }

  const handleJoin = () => {
    if (!name || !roomCode) {
      setError("Please enter your name and room code")
      return
    }
    
    // Stop tracks before navigating
    localTracks.forEach(track => track.stop())
    
    // Navigate to meeting room with parameters
    router.push(`/meet?name=${encodeURIComponent(name)}&room=${encodeURIComponent(roomCode)}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Join Meeting</h1>
          <p className="text-sm text-muted-foreground">Preview your camera and audio before joining</p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`h-full w-full object-cover ${videoEnabled ? '' : 'hidden'}`} 
              />
            )}
            
            {!videoEnabled && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                onClick={toggleAudio}
                className={`rounded-full p-2 ${audioEnabled ? 'bg-primary text-white' : 'bg-destructive text-white'}`}
              >
                {audioEnabled ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>
              <button
                onClick={toggleVideo}
                className={`rounded-full p-2 ${videoEnabled ? 'bg-primary text-white' : 'bg-destructive text-white'}`}
              >
                {videoEnabled ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex flex-row items-center gap-3">
            <div className="text-sm font-medium">Audio Level:</div>
            <div className="h-3 flex-grow bg-muted rounded-full overflow-hidden">
              <div 
                ref={audioLevelRef} 
                className="h-full w-0 transition-all duration-100"
              ></div>
            </div>
          </div>
          
          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="w-full"
          />
          
          <Input
            placeholder="Room Code"
            value={roomCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomCode(e.target.value)}
            className="w-full"
          />
          
          <Button onClick={handleJoin} className="w-full" disabled={isLoading || !name || !roomCode}>
            Join Meeting
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 