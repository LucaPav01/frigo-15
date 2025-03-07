
import { Mic, Plus, ScanLine } from 'lucide-react';

interface ActionButtonsProps {
  onVoiceCommand: () => void;
  onAddItem: () => void;
  onScan: () => void;
}

const ActionButtons = ({ onVoiceCommand, onAddItem, onScan }: ActionButtonsProps) => {
  return (
    <>
      <div className="fixed right-6 bottom-24">
        <button 
          onClick={onScan}
          className="bg-pantry-light text-pantry-DEFAULT p-3 rounded-full shadow-md transform transition-transform hover:scale-105 active:scale-95 border border-pantry-light"
          aria-label="Scan QR code"
        >
          <ScanLine size={20} />
        </button>
      </div>

      <div className="fixed left-6 bottom-24 flex flex-col space-y-3">
        <button
          onClick={onVoiceCommand}
          className="bg-white text-pantry-dark p-3 rounded-full shadow-sm transform transition-transform hover:scale-105 active:scale-95 border border-pantry-light"
          aria-label="Voice command"
        >
          <Mic size={20} />
        </button>
        
        <button
          onClick={onAddItem}
          className="bg-white text-pantry-dark p-3 rounded-full shadow-sm transform transition-transform hover:scale-105 active:scale-95 border border-pantry-light"
          aria-label="Add item manually"
        >
          <Plus size={20} />
        </button>
      </div>
    </>
  );
};

export default ActionButtons;
