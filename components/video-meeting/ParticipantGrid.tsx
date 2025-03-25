import { ParticipantCard } from "./ParticipantCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Participant {
  id: string;
  name: string;
}

interface ParticipantGridProps {
  participants: Participant[];
  maxVisible?: number;
}

export function ParticipantGrid({ participants, maxVisible = 3 }: ParticipantGridProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate total pages
  const totalPages = Math.ceil(participants.length / maxVisible);

  // Get current visible participants
  const visibleParticipants = participants.slice(
    currentPage * maxVisible,
    (currentPage + 1) * maxVisible
  );

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Up navigation button - always visible */}
      <Button
        variant="outline"
        size="sm"
        className="w-full h-7 flex items-center justify-center rounded"
        onClick={prevPage}
        disabled={!(totalPages > 1 && currentPage > 0)}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      {/* Participants grid - exact height to match main video */}
      <div className="flex flex-col flex-1 w-full h-full py-2 justify-evenly">
        {visibleParticipants.map((participant) => (
          <div key={participant.id} className="aspect-video w-full">
            <ParticipantCard name={participant.name} />
          </div>
        ))}

        {/* Add empty placeholders to maintain grid structure if needed */}
        {visibleParticipants.length < maxVisible &&
          Array.from({ length: maxVisible - visibleParticipants.length }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-video w-full invisible">
              <ParticipantCard name="" />
            </div>
          ))
        }
        {/* Page indicator - only visible when absolutely necessary */}
        {totalPages > 1 && (
          <div className="h-0 flex justify-center relative">
            <span className="text-xs text-muted-foreground absolute -top-6 bg-background px-1 rounded">
              {currentPage + 1} / {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Down navigation button - always visible */}
      <Button
        variant="outline"
        size="sm"
        className="w-full h-7 flex items-center justify-center rounded"
        onClick={nextPage}
        disabled={!(totalPages > 1 && currentPage < totalPages - 1)}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>


    </div>
  );
} 