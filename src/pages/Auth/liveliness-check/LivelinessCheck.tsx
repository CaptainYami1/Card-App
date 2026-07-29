import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Success } from "./components/Success";
import { Failed } from "./components/Failed";
import { Capturing } from "./components/Capturing";
import { useCreateSessionMutation } from "../../../service/appApi";
import type { Session } from "./types";

type Status = "capturing" | "success" | "failed";

type LivelinessCheckProps = {
  session?: Session;
  accountNumber?: string;
  onBack?: () => void;
  onCancel?: () => void;
};
export const LivelinessCheck = ({
  session,
  accountNumber,
  onBack,
  onCancel,
}: LivelinessCheckProps) => {
  const [status, setStatus] = useState<Status>("capturing");
  const [activeSession, setActiveSession] = useState<Session | undefined>(
    session
  );
  const [createSession, { isLoading: isRetrying }] = useCreateSessionMutation();

  // A Rekognition liveness session is single-use, so retrying requires a brand
  // new session before we re-mount the detector.
  const handleRetry = async () => {
    try {
      const newSession = (await createSession({
        accountNumber,
      }).unwrap()) as Session;
      setActiveSession(newSession);
      setStatus("capturing");
    } catch {
      // Stay on the failed screen so the user can try again.
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

      {status === "capturing" && (
        <Capturing
          key={activeSession?.sessionId}
          session={activeSession}
          onSuccess={() => setStatus("success")}
          onFailure={() => setStatus("failed")}
        />
      )}
      {status === "success" && <Success />}
      {status === "failed" && (
        <Failed
          onRetry={handleRetry}
          onCancel={() => onCancel?.()}
          loading={isRetrying}
        />
      )}
    </div>
  );
};







