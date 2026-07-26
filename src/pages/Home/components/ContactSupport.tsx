import { useState } from "react";
import { Landmark, X, Check } from "lucide-react";
import { Button } from "../../../components/Button";
import { InputText } from "../../../components/InputText";

type ContactSupportProps = {
  email?: string;
  onClose: () => void;
};

export const ContactSupport = ({
  email = "businessconcierge@providusbank.com",
  onClose,
}: ContactSupportProps) => {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-support-title"
        className="relative w-full rounded-3xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 text-ink-500 transition hover:opacity-70"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <Landmark className="text-ink" strokeWidth={1.5} size={44} />

          <h2
            id="contact-support-title"
            className="mt-4 text-lg font-semibold text-ink"
          >
            Contact Support
          </h2>
          <p className="mt-2 max-w-50 text-xs leading-5 text-[#484848]">
            Copy the email address below to reach out to Providus Support.
          </p>

         <InputText
         value={email}
         readOnly
         className="mt-4 w-full text-[#30444F] focus:ring-0 text-sm text-center"
         />

          <div className="mt-4 w-full">
            <Button variant="primary" onClick={handleCopy}>
              {copied ? (
                <span className="inline-flex items-center gap-1.5">
                  <Check size={16} />
                  Copied
                </span>
              ) : (
                "Copy"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
