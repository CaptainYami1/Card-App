import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "../../../../auth/AuthContext";

const REDIRECT_MS = 5000;

export const Success = () => {
  const [progress, setProgress] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Kick off the left-to-right fill on the next frame so the transition runs.
    const raf = requestAnimationFrame(() => setProgress(100));

    const timer = setTimeout(() => {
      login();
      navigate("/", { replace: true });
    }, REDIRECT_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [login, navigate]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center pb-16">
      <div className="flex h-50 w-50 items-center justify-center rounded-full bg-green-100">
        <Check className="text-green-500" size={64} strokeWidth={3} />
      </div>
      <h1 className="mt-10 text-lg font-semibold text-ink">
        Verification Successful!
      </h1>
      <p className="mt-2 text-xs leading-5 text-[#484848]">
        Your identity has been verified.
        <br />
        You will be redirected shortly.
      </p>

      {/* Redirect progress */}
      <div className="mt-10 h-1.5 w-56 overflow-hidden rounded-full bg-slate-100 mb-20">
        <div
          className="h-full rounded-full bg-green-500 transition-[width] ease-linear"
          style={{ width: `${progress}%`, transitionDuration: `${REDIRECT_MS}ms` }}
        />
      </div>
    </div>
  );
};
