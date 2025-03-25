"use client"

import { useState } from "react";
import { MeetingHeader } from "@/components/video-meeting/MeetingHeader";
import { MainParticipant } from "@/components/video-meeting/MainParticipant";
import { ParticipantGrid } from "@/components/video-meeting/ParticipantGrid";
import { Controls } from "@/components/video-meeting/Controls";

// Sample data for demonstration - adding more participants to test pagination
const SAMPLE_PARTICIPANTS = [
  { id: "1", name: "Jane Smith" },
  { id: "2", name: "Mike Johnson" },
  { id: "3", name: "Sarah Williams" },
  { id: "4", name: "Alex Wong" },
  { id: "5", name: "Emily Chen" },
  { id: "6", name: "Carlos Rodriguez" },
  { id: "7", name: "Aisha Patel" },
  { id: "8", name: "David Kim" },
  { id: "9", name: "Maria Garcia" },
  { id: "10", name: "Tom Wilson" },
  { id: "11", name: "Priya Sharma" },

  // Add more participants as needed for testing
];

export default function Home() {
  const [participants] = useState(SAMPLE_PARTICIPANTS);
  const meetingId = "123-456-789";

  // Function stubs for controls
  const handleToggleMicrophone = () => {
    console.log("Toggle microphone");
  };
  
  const handleToggleCamera = () => {
    console.log("Toggle camera");
  };
  
  const handleEndCall = () => {
    console.log("End call");
  };
  
  const handleShareScreen = () => {
    console.log("Share screen");
  };
  
  const handleOpenChat = () => {
    console.log("Open chat");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 p-10 bg-slate-100">
      <div className="w-full space-y-6 backdrop-blur-sm bg-background/80 p-6 rounded-xl shadow-lg">
        <MeetingHeader meetingId={meetingId} />

        <main className="flex flex-col md:flex-row gap-4 h-[60vh] max-h-[750px]">
          {/* Main participant - with padding to match remote section height */}
          <div className="flex-1 h-full flex pt-[9px] pb-[9px]">
            <MainParticipant name="John Doe" />
          </div>
          
          {/* Remote participants */}
          <div className="w-full md:w-[350px] h-full">
            <ParticipantGrid participants={participants} maxVisible={2} />
          </div>
        </main>

        <Controls 
          onToggleMicrophone={handleToggleMicrophone}
          onToggleCamera={handleToggleCamera}
          onEndCall={handleEndCall}
          onShareScreen={handleShareScreen}
          onOpenChat={handleOpenChat}
        />
      </div>
    </div>
  );
}
