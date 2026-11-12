import { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./ui/button";
import { Eraser } from "lucide-react";

export const SignaturePad = ({ label, value, onChange, className = "" }) => {
  const sigRef = useRef(null);

  useEffect(() => {
    if (value && sigRef.current) {
      sigRef.current.fromDataURL(value);
    }
  }, []);

  const handleClear = () => {
    if (sigRef.current) {
      sigRef.current.clear();
      onChange(null);
    }
  };

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.toDataURL("image/png");
      onChange(dataUrl);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            className: "w-full h-32 touch-none",
            style: { width: "100%", height: "128px" }
          }}
          onEnd={handleEnd}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex-1"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Limpiar
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
