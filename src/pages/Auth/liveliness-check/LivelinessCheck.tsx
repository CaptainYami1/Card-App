import { useState} from "react";
import { ArrowLeft} from "lucide-react";
import { Success } from "./components/Success";
import { Failed } from "./components/Failed";
import { Capturing } from "./components/Capturing";
import type { Session } from "./types";

type Status = "capturing" | "success" | "failed";

type LivelinessCheckProps = {
  session?: Session;
  onBack?: () => void;
  onCancel?: () => void;
};
export const LivelinessCheck = ({ session, onBack, onCancel }: LivelinessCheckProps) => {
  const [status, setStatus] = useState<Status>("capturing");

  // useEffect(() => {
  //   if (status !== "capturing") return;
  //   const timer = setTimeout(() => setStatus("success"), 3000);
  //   return () => clearTimeout(timer);
  // }, [status]);

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
          session={session}
          onSuccess={() => setStatus("success")}
          onFailure={() => setStatus("failed")}
        />
      )}
      {status === "success" && <Success />}
      {status === "failed" && (
        <Failed onRetry={() => setStatus("capturing")} onCancel={() => onCancel} />
      )}
    </div>
  );
};







