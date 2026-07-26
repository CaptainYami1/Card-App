import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "../../../components/Button";
import { BankCard } from "./BankCard";
import type { Card } from "../types";
import { useOpenCardWindowMutation } from "../../../service/appApi";

const popularOptions = [5, 10, 30, 60];

type SecureWindowProps = {
  card: Card;
  duration: number;
  onDurationChange: (minutes: number) => void;
  onBack: () => void;
  onConfirm: () => void;
};

export const SecureWindow = ({
  card,
  duration,
  onDurationChange,
  onBack,
  onConfirm,
}: SecureWindowProps) => {
  const [openCardWindow, { isLoading: isOpening }] = useOpenCardWindowMutation();

  const handleConfirm = async () => {
    try {
      await openCardWindow({
        cardId: card.id,
        durationSeconds: duration * 60,
      }).unwrap();
      onConfirm();
    } catch (error) {
      console.error("Failed to open card window", error);
    }
  };

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

      {/* Heading */}
      <div className="mt-4">
        <h1 className="text-xl font-semibold text-ink">Select Duration</h1>
        <p className="mt-1 text-sm leading-5 text-[#484848]">
          Choose how long you want to keep your card open for online
          transactions.
        </p>
      </div>

      {/* Card */}
      <div className="mt-6">
        <BankCard number={card?.maskedPan} validThrough={card?.expiry} />
      </div>

      {/* Popular options */}
      <div className="mt-7">
        <p className=" font-semibold text-ink">Popular Options</p>
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {popularOptions.map((mins) => {
            const selected = duration === mins;
            return (
              <button
                key={mins}
                type="button"
                onClick={() => onDurationChange(mins)}
                className={`flex flex-col items-center rounded-xl border py-3 transition ${
                  selected
                    ? "border-[#30444F] bg-[#30444F0A] text-[#30444F]"
                    : "border-[#EDEDED] text-ink hover:border-ink/40"
                }`}
              >
                <span className="text-xl font-semibold leading-none">{mins}</span>
                <span
                  className={`mt-1 text-[12px] ${
                    selected ? "text-[#30444F]" : "text-[#484848]"
                  }`}
                >
                  min
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom duration */}
      <div className="mt-7">
        <p className=" font-semibold text-ink">Or choose custom duration</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex flex-1 flex-col">
            <input
              type="range"
              min={1}
              max={60}
              value={duration}
              onChange={(e) => onDurationChange(Number(e.target.value))}
              className="w-full accent-[#30444F]"
            />
            <div className="mt-1 flex justify-between text-[14px] text-[#484848]">
              <span>1 min</span>
              <span>60 min</span>
            </div>
          </div>
          <div className="flex min-w-16 flex-col items-center rounded-xl border border-[#EDEDED] px-3 py-2">
            <span className="text-lg font-semibold leading-none text-ink">
              {duration}
            </span>
            <span className="mt-1 text-[12px] text-[#484848]">min</span>
          </div>
        </div>
      </div>

      {/* Confirm */}
      <div className="mt-auto flex flex-col items-center gap-4 pt-8">
        <Button variant="primary" onClick={handleConfirm} disabled={isOpening}>
          {isOpening ? "Opening..." : "Confirm"}
        </Button>
        <span className="flex items-center gap-1.5 text-xs text-ink-500">
          <Lock size={13} />
          You can close the window anytime
        </span>
      </div>
    </div>
  );
};
