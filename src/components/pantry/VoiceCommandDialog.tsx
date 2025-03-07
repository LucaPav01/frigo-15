
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Mic, MicOff, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceCommandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCommandProcess: (command: string) => void;
}

const VoiceCommandDialog = ({ isOpen, onOpenChange, onCommandProcess }: VoiceCommandDialogProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [waveformBars, setWaveformBars] = useState<number[]>([]);

  // Simulate microphone activation when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Start listening with a slight delay for better UX
      const timer = setTimeout(() => {
        setIsListening(true);
        simulateWaveform();
      }, 500);
      
      return () => {
        clearTimeout(timer);
        setIsListening(false);
        setTranscript("");
      };
    }
  }, [isOpen]);

  // Simulate voice processing after a few seconds
  useEffect(() => {
    if (isListening) {
      const simulateVoiceCommands = [
        "Ho mangiato 4 uova e ne rimane 1",
        "Ho bevuto una tazza di latte"
      ];
      
      // Select a random command for demo purposes
      const randomCommand = simulateVoiceCommands[Math.floor(Math.random() * simulateVoiceCommands.length)];
      
      const timer = setTimeout(() => {
        setTranscript(randomCommand);
        
        // Process after showing the transcript
        setTimeout(() => {
          setIsListening(false);
          onCommandProcess(randomCommand);
        }, 1500);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isListening, onCommandProcess]);
  
  // Create animated waveform effect
  const simulateWaveform = () => {
    // Create random height bars for waveform visualization
    const createRandomBars = () => {
      return Array.from({ length: 20 }, () => 
        isListening ? Math.random() * 50 + 10 : 5
      );
    };
    
    // Update waveform at intervals
    const interval = setInterval(() => {
      if (isListening) {
        setWaveformBars(createRandomBars());
      } else {
        clearInterval(interval);
        setWaveformBars(Array(20).fill(5));
      }
    }, 100);
    
    return () => clearInterval(interval);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full bg-pantry-light flex items-center justify-center mb-4">
          {isListening ? (
            <Mic size={28} className="text-pantry-DEFAULT animate-pulse" />
          ) : (
            <MicOff size={28} className="text-muted-foreground" />
          )}
        </div>
        
        <h2 className="text-xl font-medium mb-1">
          {isListening ? "Ti sto ascoltando..." : "Funzione Vocale"}
        </h2>
        
        <p className="text-sm text-muted-foreground text-center mb-4">
          {isListening 
            ? "Parla chiaramente per aggiornare le quantità" 
            : transcript || "Premi il pulsante del microfono per iniziare"}
        </p>
        
        {/* Audio waveform visualization */}
        <div className="flex items-end justify-center h-16 w-full space-x-1 mb-4">
          {waveformBars.map((height, index) => (
            <div 
              key={index}
              className={cn(
                "w-1 rounded-full transition-all duration-100",
                isListening ? "bg-pantry-DEFAULT" : "bg-gray-200"
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        
        {transcript && (
          <div className="w-full p-3 bg-secondary/50 rounded-md flex items-center mb-2">
            <Wand2 size={16} className="text-pantry-DEFAULT mr-2" />
            <p className="text-sm">{transcript}</p>
          </div>
        )}
        
        <p className="text-xs text-center text-muted-foreground mt-2">
          Esempi: "Ho mangiato 4 uova e ne rimane 1", "Ho bevuto una tazza di latte"
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceCommandDialog;
