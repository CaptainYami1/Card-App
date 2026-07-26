import { Glasses, ScanFace, Sun, X } from "lucide-react";
import { Button } from "../../../../components/Button";
import type { ReactNode } from "react";


export const Failed = ({ onRetry, onCancel }: { onRetry: () => void; onCancel: () => void }) => {
   

 return (
    <div className="flex flex-1 flex-col">
      <div className="flex  flex-col items-center justify-center text-center mt-5">
        <div className="flex h-50 w-50 items-center justify-center rounded-full bg-red-50">
          <X className="text-red-400" size={120} strokeWidth={3} />
        </div>
        <h1 className="mt-10 text-lg font-semibold text-ink">Verification Failed</h1>
        <p className="mt-2 text-[13px] leading-5 text-[#484848]">
          We couldn&apos;t verify your identity.
          <br />
          Please try again.
        </p>

        {/* Troubleshooting tips */}
        <div className="mt-8 w-full  rounded-2xl border border-[#E5E5E5] bg-[#F0F0F00A]">
          <Tip icon={<Sun size={16} />} text="Make sure you're in a well-lit area" />
          <Tip icon={<Glasses size={16} />} text="Remove glasses, masks or hats" />
          <Tip icon={<ScanFace size={16} />} text="Ensure your face is fully visible" />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

 function Tip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#30444F0F] text-ink-500">
        {icon}
      </span>
      <span className="text-xs text-[#484848]">{text}</span>
    </div>
  );
}