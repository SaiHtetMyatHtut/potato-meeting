import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";

interface MeetingHeaderProps {
  meetingId: string;
}

export function MeetingHeader({ meetingId }: MeetingHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="flex justify-between items-center">
      <div className="flex text-3xl space-x-3">
        <h1 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Video Meeting</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-muted px-3 py-1.5 rounded-lg">
            <span className="text-sm mr-2">Meeting ID: {meetingId}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={copyMeetingId}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copied!" : "Copy Meeting ID"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
} 