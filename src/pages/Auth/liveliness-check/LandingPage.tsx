import { useEffect, useState } from "react";
import logo from "../../../assets/navlogo.png";
import { InputText } from "../../../components/InputText";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { Button } from "../../../components/Button";
import { useGetAccountNameMutation } from "../../../service/appApi";

type LandingPageProps = {
  onContinue: (account: { accountNumber: string; accountName: string }) => void;
};

type ValidateAccountResponse = {
  accountName?: string;
  name?: string;
  data?: { accountName?: string; name?: string };
};

export const LandingPage = ({ onContinue }: LandingPageProps) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [getAccountName, { isLoading }] = useGetAccountNameMutation();

  const isComplete = accountNumber.length === 10;
  const canContinue = isComplete && !!accountName && !isLoading;

  function handleChange(value: string) {
    setAccountNumber(value.replace(/\D/g, "").slice(0, 10));
    setAccountName("");
    setErrorMsg("");
  }

  useEffect(() => {
    if (accountNumber.length !== 10) return;

    let active = true;

    (async () => {
      try {
        const res = (await getAccountName({
          accountNumber,
        }).unwrap()) as ValidateAccountResponse;

        if (!active) return;

        const name =
          res.accountName ??
          res.name ??
          res.data?.accountName ??
          res.data?.name ??
          "";

        if (name) {
          setAccountName(name);
          setErrorMsg("");
        } else {
          setErrorMsg("Invalid account number. Please check and try again.");
        }
      } catch  {
        if (!active) return;
        setErrorMsg("Invalid account number. Please check and try again.");
      }
    })();

    return () => {
      active = false;
    };
  }, [accountNumber, getAccountName]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canContinue) return;
    onContinue({ accountNumber, accountName });
  }
  return (
    <>
      <div className="flex flex-1 flex-col px-6 pb-6">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="mt-3 flex flex-col items-center leading-none">
              <img src={logo} alt="Providus Bank" width={180} />
            </div>

            {/* Heading */}
            <div className="mt-15 text-center">
              <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-ink">
                Let&apos;s Get Started
              </h1>
              <p className="mt-2.5 text-sm text-[#484848]">
                Enter your account number to continue
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-1 flex-col w-full"
              noValidate
            >
              <InputText
                label="Account Number"
                placeholder="Type account number here"
                value={accountNumber}
                type="number"
                onChange={(e) => handleChange(e.target.value)}
                
                className="w-full"
              />
              
                {isLoading && (
                  <span className="text-xs flex items-center gap-1.5 text-[#484848]">
                    <Loader2 size={15} className="animate-spin" /> Verifying
                    account...
                  </span>
                )}
                {!isLoading && accountName && (
                  <span className="text-xs flex items-center gap-1.5 text-[#010101]">
                    <CircleCheck color="#039855" size={15} />
                    {accountName}
                  </span>
                )}
                {!isLoading && errorMsg && (
                  <span className="text-red-500 text-xs flex items-center gap-1.5 mt-3">
                    <CircleAlert size={15} /> {errorMsg}
                  </span>
                )}
             
              <Button
                type="submit"
                disabled={!canContinue}
                variant="primary"
                className="mt-7"
              >
                Continue
              </Button>

              {/* Footer */}
            </form>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-center gap-2 py-4 text-center">
          <ShieldIcon className="h-4 w-4 shrink-0 text-ink-500" />
          <span className="text-xs text-ink-500">
            Your data is safe and secure with Providus Bank
          </span>
        </div>
      </div>
    </>
  );
};

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 15.5h.01" />
    </svg>
  );
}
