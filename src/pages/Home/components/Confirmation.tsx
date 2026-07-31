import { useEffect, useState } from "react";
import { ArrowLeft, LockOpen } from "lucide-react";
import { Button } from "../../../components/Button";
import { useCloseCardWindowMutation } from "../../../service/appApi";
import { VERIFICATION_ID_KEY } from "../../../auth/AuthContext";
import { clearActiveWindow, getRemainingSeconds } from "../activeWindow";

type ConfirmationProps = {
  cardId: string;
  durationMinutes: number;
  expiresAt?: string;
  cardLast4?: string;
  expires?: string;
  onBack: () => void;
  onClose: () => void;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export const Confirmation = ({
  cardId,
  durationMinutes,
  expiresAt,
  cardLast4 = "4431",
  expires = "12/28",
  onBack,
  onClose,
}: ConfirmationProps) => {
  const [remaining, setRemaining] = useState(() =>
    expiresAt ? getRemainingSeconds(expiresAt) : durationMinutes * 60
  );
  const [closeCardWindow, { isLoading: isClosing }] =
    useCloseCardWindowMutation();

  const handleClose = async () => {
    try {
      const verificationId =
        sessionStorage.getItem(VERIFICATION_ID_KEY) ?? undefined;
      await closeCardWindow({ cardId, verificationId }).unwrap();
    } catch (error) {
      console.error("Failed to close card window", error);
    } finally {
      clearActiveWindow();
      onClose();
    }
  };

  useEffect(() => {
    if (remaining <= 0) {
      // Window expired — auto-close.
      clearActiveWindow();
      onClose();
      return;
    }
    // When we have an absolute expiry, recompute from it each tick so the
    // countdown stays accurate even if the tab was backgrounded.
    const timer = setInterval(() => {
      setRemaining((s) => (expiresAt ? getRemainingSeconds(expiresAt) : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining, expiresAt, onClose]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

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

      <div className="flex flex-1 flex-col items-center text-center">
        {/* Open lock */}
        <div className="mt-6 flex h-30 w-30 items-center justify-center rounded-full bg-green-100/70 ring-8 ring-green-50">
          <LockOpen className="text-green-500" strokeWidth={1} size={80} />
        </div>

        <h1 className="mt-10 text-xl font-semibold text-ink">Your Card Is Open</h1>
        <p className="mt-2 max-w-[17rem] text-[13px] leading-5 text-[#484848]">
          Your card is open for online transactions for the next{" "}
          {pad(durationMinutes)}:00 minutes. It will automatically close when the
          time runs out.
        </p>

        {/* Countdown */}
        <div className="mt-10 flex items-center gap-4 rounded-[20px] border border-[#EDEDED] px-13.5 py-5">
          <TimeUnit value={pad(minutes)} label="MINUTES" />
          <span className="-mt-3 text-2xl font-semibold text-ink">:</span>
          <TimeUnit value={pad(seconds)} label="SECONDS" />
        </div>

        {/* Close */}
        <Button
          type="button"
          variant="danger"
          onClick={handleClose}
          disabled={isClosing}
          className="mt-10 "
        >
          {isClosing ? "Closing..." : "Close Window"}
        </Button>
      </div>

      {/* Card info */}
      <div className="my-6 flex items-center justify-between rounded-xl border border-[#E7E7E7CC] bg-[#F0F0F099] px-4 py-3">
        <div className="leading-tight">
          <p className="text-xs mb-4 uppercase tracking-wider text-[#484848]">Card</p>
          <p className="text-sm text-ink font-semibold">**** **** **** {cardLast4}</p>
        </div>
        <div className="text-right leading-tight">
          <p className="text-xs mb-4 uppercase tracking-wider text-[#484848]">Expires</p>
          <p className="text-sm text-ink font-semibold">{expires}</p>
        </div>
      </div>
    </div>
  );
};

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[40px] font-semibold tabular-nums text-ink">{value}</span>
      <span className="mt-1 text-[12px] uppercase tracking-wider text-[#484848]">
        {label}
      </span>
    </div>
  );
}
