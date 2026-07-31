import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { Alert} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import type { Session } from "../types";
import { useEndSessionMutation } from "../../../../service/appApi";
import { VERIFICATION_ID_KEY } from "../../../../auth/AuthContext";
import { awsRegion } from "../../../../aws-exports";
import { ScanFace } from "lucide-react";

type CapturingProps = {
  session?: Session;
  onSuccess?: () => void;
  onFailure?: () => void;
};

type EndSessionResponse = {
  verificationId: string;
  expiresAt: string;
};

const region = import.meta.env.VITE_AWS_REGION ?? awsRegion;

// Desktops (mouse/trackpad) have a fixed webcam and a centered face, so skipping
// the "Get Ready" screen is fine. On touch devices the user is holding the phone
// and needs the start screen to get into position — otherwise the oval-fit
// challenge starts before they're ready and the check fails repeatedly.
const isDesktop =
  typeof window !== "undefined" &&
  window.matchMedia?.("(pointer: fine)").matches;

export const Capturing = ({ session, onSuccess, onFailure }: CapturingProps) => {
  const [endSession] = useEndSessionMutation();

  // const sessionsessionId = "123"
  // Fired once the video stream has been fully sent to Rekognition. The liveness
  // result is finalized/retrieved from our backend via the endSession endpoint.
  const handleAnalysisComplete = async () => {
    try {
      const result = (await endSession({
        challengeId: session?.challengeId,
      }).unwrap()) as EndSessionResponse;

      // A successful completion returns a verificationId. Liveness failures come
      // back as an error response (handled in catch).
      if (result?.verificationId) {
        // Persist it so the protected getCards request can send it via the
        // X-Verification-Id header (the Home page is on a separate route).
        sessionStorage.setItem(VERIFICATION_ID_KEY, result.verificationId);
        onSuccess?.();
      } else {
        onFailure?.();
      }
    } catch {
      onFailure?.();
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
      <div className="mt-4 text-center">
        <h1 className="text-lg font-semibold text-ink">Verify Your Identity</h1>
        <p className="mt-2.5 text-[13px] leading-5 text-[#484848]">
          We need to confirm it&apos;s you.
          <br />
          Position your face in the frame
        </p>
      </div>

      <div className="mt-8 flex min-h-125 flex-1 flex-col overflow-hidden rounded-2xl">
        {session?.sessionId ? (
          <FaceLivenessDetector
            sessionId={session.sessionId}
            region={region}
            onAnalysisComplete={handleAnalysisComplete}
            disableStartScreen={isDesktop}
            components={{
              PhotosensitiveWarning: (): React.JSX.Element => {
                return (
                  <Alert
                    variation="warning"
                    isDismissible={false}
                    hasIcon={true}
                    heading="Caution"
                  >
                    This check displays colored lights. Use caution if you are
                    photosensitive.
                  </Alert>
                );
              },
            }}
            onError={(livenessError) => {
              console.error({
                state: livenessError.state,
                error: livenessError.error,
              });
              onFailure?.();
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-67.5 w-67.5 items-center justify-center overflow-hidden rounded-full border border-[#E9EAEB] bg-slate-100">
              <ScanFace className="text-slate-300" size={92} strokeWidth={1.25} />
            </div>
            <p className="mt-6 text-center text-xs text-red-500">
              Missing session. Please restart the verification.
            </p>
          </div>
        )}

{/* <div className="mt-10 flex items-center gap-3 rounded-2xl border border-[#30444F] p-5 shadow-sm bg-[#30444F0A] absolute">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <div className="text-center leading-tight">
          <p className="text-sm font-semibold text-ink mb-2">Capturing ...</p>
          <p className="text-xs text-[#484848]">Please hold still</p>
        </div>
      </div> */}
      </div>
    </div>
  );
};
