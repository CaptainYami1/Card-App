import { ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";

type SessionExpiredProps = {
  onBack?: () => void;
  onStartAgain?: () => void;
};

export const SessionExpired = ({
  onBack,
  onStartAgain,
}: SessionExpiredProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleStartAgain = () => {
    logout();
    if (onStartAgain) {
      onStartAgain();
    } else {
      navigate("/verification", { replace: true });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
      <button
        type="button"
        aria-label="Go back"
        onClick={handleBack}
        className="text-ink transition hover:opacity-70"
      >
        <ArrowLeft size={22} />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {/* Clock */}
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100">
          <Clock className="text-ink-500" strokeWidth={1} size={64} />
        </div>

        <h1 className="mt-10 text-xl font-semibold text-ink">
          This Session Has Expired
        </h1>
        <p className="mt-2 max-w-56 text-xs leading-5 text-[#484848]">
          Please scan the QR code or click the link again to continue.
        </p>

        <div className="mt-10 w-full">
          <Button variant="primary" onClick={handleStartAgain}>
            Start Again
          </Button>
        </div>
      </div>
    </div>
  );
};
