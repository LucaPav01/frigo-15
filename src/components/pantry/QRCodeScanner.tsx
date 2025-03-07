
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ScanLine } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface QRCodeScannerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (items: { name: string; quantity: number }[]) => void;
}

const QRCodeScanner = ({ isOpen, onOpenChange, onScan }: QRCodeScannerProps) => {
  const [scanning, setScanning] = useState(false);

  // Lista degli ingredienti disponibili
  const ingredientiDisponibili = [
    "Riso", "Pasta", "Avena", "Uova", "Pollo", 
    "Spinaci", "Carote", "Pomodori", "Latte", 
    "Formaggio", "Yogurt", "Mela", "Banana", "Arancia",
    "Farina", "Zucchero", "Caffè", "Tè", "Pane",
    "Patate", "Cipolle", "Aglio", "Peperoni", "Zucchine"
  ];

  // Funzione per selezionare ingredienti casuali
  const selezionaIngredientiCasuali = () => {
    const numIngredienti = Math.floor(Math.random() * 5) + 1; // Numero casuale tra 1 e 5
    const ingredientiCasuali = [];
    const ingredientiSelezionati = new Set();

    for (let i = 0; i < numIngredienti; i++) {
      // Assicuriamoci di non selezionare lo stesso ingrediente due volte
      let ingredienteIndex;
      do {
        ingredienteIndex = Math.floor(Math.random() * ingredientiDisponibili.length);
      } while (ingredientiSelezionati.has(ingredienteIndex));
      
      ingredientiSelezionati.add(ingredienteIndex);
      const ingredienteCasuale = ingredientiDisponibili[ingredienteIndex];
      const quantitaCasuale = Math.floor(Math.random() * 5) + 1; // Quantità casuale tra 1 e 5
      
      ingredientiCasuali.push({ 
        name: ingredienteCasuale, 
        quantity: quantitaCasuale 
      });
    }

    return ingredientiCasuali;
  };

  // Simulate scanning process
  useEffect(() => {
    if (isOpen && !scanning) {
      setScanning(true);

      // Simulate successful scan after 3 seconds
      const timer = setTimeout(() => {
        const ingredientiAggiunti = selezionaIngredientiCasuali(); // Seleziona ingredienti casuali
        onScan(ingredientiAggiunti); // Passa gli ingredienti al componente genitore
        setScanning(false);
        onOpenChange(false);

        // Show success toast
        toast({
          title: "Scansione completata",
          description: `Hai aggiunto ${ingredientiAggiunti.length} alimenti alla tua dispensa.`,
        });
      }, 3000);

      return () => {
        clearTimeout(timer);
        setScanning(false);
      };
    }
  }, [isOpen, scanning, onOpenChange, onScan]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="relative w-full h-[500px] bg-black">
          {/* Camera preview (simulated) */}
          <div className="absolute inset-0 bg-[url('/lovable-uploads/0697579a-daf6-47e5-8fff-e30ab8f633fd.png')] bg-cover bg-center opacity-75" />

          {/* QR Code overlay guide */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white rounded-lg relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
            </div>
          </div>

          {/* Scanning animation */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <ScanLine className="text-pantry-DEFAULT mb-4 animate-pulse" size={48} />
            <p className="text-lg font-medium">Scansione in corso...</p>
            <p className="text-sm text-white/70 mt-1">Posiziona il codice QR all'interno del riquadro</p>
          </div>

          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white"
            onClick={() => onOpenChange(false)}
          >
            <X size={24} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeScanner;
