import { 
  Mic, 
  Video, 
  PhoneOff, 
  MonitorSmartphone, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ControlsProps {
  onToggleMicrophone?: () => void;
  onToggleCamera?: () => void;
  onEndCall?: () => void;
  onShareScreen?: () => void;
  onOpenChat?: () => void;
}

export function Controls({
  onToggleMicrophone,
  onToggleCamera,
  onEndCall,
  onShareScreen,
  onOpenChat
}: ControlsProps) {
  return (
    <footer className="flex justify-center items-center space-x-6 py-6 mt-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full shadow-md hover:shadow-lg hover:bg-secondary/80 transition-all"
              onClick={onToggleMicrophone}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Toggle Microphone
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full shadow-md hover:shadow-lg hover:bg-secondary/80 transition-all"
              onClick={onToggleCamera}
            >
              <Video className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Toggle Camera
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full h-14 w-14 shadow-md hover:shadow-lg transition-all"
              onClick={onEndCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            End Call
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full shadow-md hover:shadow-lg hover:bg-secondary/80 transition-all"
              onClick={onShareScreen}
            >
              <MonitorSmartphone className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Share Screen
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full shadow-md hover:shadow-lg hover:bg-secondary/80 transition-all"
              onClick={onOpenChat}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Chat
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </footer>
  );
} 