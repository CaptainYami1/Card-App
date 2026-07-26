import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "../../../components/Button";

type ClosedProps = {
  onBack: () => void;
  onDone: () => void;
  onOpenAgain: () => void;
};

export const Closed = ({ onBack, onDone, onOpenAgain }: ClosedProps) => {
  return (
    <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
      <button
        type="button"
        aria-label="Go back"
        onClick={onBack}
        className="text-ink transition hover:opacity-70"
      >
        <ArrowLeft size={22} />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {/* Closed lock */}
        <div className="flex h-30 w-30 items-center justify-center rounded-full bg-slate-100">
          <Lock className="text-ink-500" strokeWidth={1} size={80} />
        </div>

        <h1 className="mt-10 text-xl font-semibold text-ink">Your Card Is Closed</h1>
        <p className="mt-2 max-w-[18rem] text-xs leading-5 text-[#484848]">
          The secure window has ended.
          <br />
          Your card is now closed for online transactions.
        </p>

        <div className="w-full mt-10 flex flex-col items-center gap-4">
        <Button variant="primary" onClick={onDone}>
          Done
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onOpenAgain}
          className="text-sm font-medium text-ink transition hover:opacity-70"
        >
          Open Again
        </Button>
      </div>
      </div>

      {/* Actions */}
      
    </div>
  );
};
