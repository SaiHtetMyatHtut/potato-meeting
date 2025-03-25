import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface ParticipantCardProps {
  name: string;
  isLocal?: boolean;
  size?: 'small' | 'large';
}

export function ParticipantCard({ name, isLocal = false, size = 'small' }: ParticipantCardProps) {
  const isLarge = size === 'large';
  
  return (
    <Card className="overflow-hidden relative rounded-xl shadow-md border border-border/50 bg-card/60 w-full h-full">
      <CardContent className="p-0 h-full">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
          <User 
            size={isLarge ? 120 : 40} 
            className="text-primary-foreground/30 stroke-[1.5]" 
          />
          {name && (
            <div className={`absolute ${isLarge ? 'bottom-4 left-4' : 'bottom-2 left-2'} bg-primary text-primary-foreground px-2 py-0.5 rounded-md ${isLarge ? 'text-base' : 'text-xs'} shadow-sm`}>
              {name} {isLocal ? '(You)' : ''}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 