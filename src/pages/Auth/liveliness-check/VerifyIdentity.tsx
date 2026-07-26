import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  CircleAlert,
  Loader2,
  ScanFace,
  ShieldCheck,
  Sun,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../../components/Button";
import { useCreateSessionMutation } from "../../../service/appApi";
import type { Session } from "./types";

type VerifyIdentityProps = {
  accountNumber?: string;
  onContinue?: (session: Session) => void;
  onBack?: () => void;
};

export const VerifyIdentity = ({
  accountNumber,
  onContinue,
  onBack,
}: VerifyIdentityProps) => {
  const [consented, setConsented] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [createSession, { isLoading }] = useCreateSessionMutation();

  async function handleAgree() {
    if (!consented || isLoading) return;
    setErrorMsg("");

    try {
      const session = (await createSession({
        accountNumber,
      }).unwrap()) as Session;
      onContinue?.(session);
    } catch {
      setErrorMsg(
        "We couldn't start your verification session. Please try again."
      );
    }
  }

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

      <div className="mt-6 flex flex-1 flex-col">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#30444F0F]">
            <ScanFace className="text-ink" size={48} strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 text-lg font-semibold text-ink md:text-xl">
            Verify Your Identity
          </h1>
          <p className="mt-2.5 max-w-xs text-sm leading-5 text-[#484848]">
            We&apos;ll perform a quick liveness check to confirm it&apos;s
            really you. This helps keep your account safe and secure.
          </p>
        </div>

        {/* What to expect */}
        <div className="mt-8 w-full rounded-2xl border border-[#E5E5E5] bg-[#F0F0F00A]">
          <Step
            icon={<Camera size={16} />}
            text="Position your face within the frame on the next screen"
          />
          <Step
            icon={<Sun size={16} />}
            text="Make sure you're in a well-lit area"
          />
          <Step
            icon={<ScanFace size={16} />}
            text="Follow the on-screen prompts to complete the scan"
          />
        </div>

        {/* Consent */}
        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#30444F]"
          />
          <span className="text-xs leading-5 text-[#484848]">
            I consent to Providus Bank capturing and processing my facial
            biometric data for the purpose of identity verification, in line
            with the{" "}
            <a href="#" className="font-medium text-ink underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        {/* Security note */}
        <div className="mt-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-ink-500" />
          <span className="text-xs text-ink-500">
            Your biometric data is encrypted and never shared.
          </span>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-red-500">
            <CircleAlert size={15} className="shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-8">
          <Button
            type="button"
            variant="primary"
            disabled={!consented || isLoading}
            onClick={handleAgree}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Starting session...
              </>
            ) : (
              "I Agree, Continue"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={isLoading}
            onClick={onBack}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

function Step({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#30444F0F] text-ink-500">
        {icon}
      </span>
      <span className="text-xs text-[#484848]">{text}</span>
    </div>
  );
}
