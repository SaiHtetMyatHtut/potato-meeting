import { ParticipantCard } from "./ParticipantCard";

interface MainParticipantProps {
  name: string;
}

export function MainParticipant({ name }: MainParticipantProps) {
  return (
    <div className="w-full h-full flex">
      <ParticipantCard 
        name={name} 
        isLocal={true} 
        size="large" 
      />
    </div>
  );
} 