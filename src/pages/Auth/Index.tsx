import { useState } from "react";
import { LandingPage } from "./liveliness-check/LandingPage";
import { VerifyIdentity } from "./liveliness-check/VerifyIdentity";
import { LivelinessCheck } from "./liveliness-check/LivelinessCheck";
import type { Session } from "./liveliness-check/types";

export const Index = () => {
  const [page, setPage] = useState("LandingPage");
  const [accountNumber, setAccountNumber] = useState("");
  const [session, setSession] = useState<Session | undefined>(undefined);
  return (
    <>
      {page === "LandingPage" && (
        <LandingPage
          onContinue={(account) => {
            setAccountNumber(account.accountNumber);
            setPage("VerifyIdentity");
          }}
        />
      )}
      {page === "VerifyIdentity" && (
        <VerifyIdentity
          accountNumber={accountNumber}
          onContinue={(createdSession) => {
            setSession(createdSession);
            setPage("LivelinessCheck");
          }}
          onBack={() => setPage("LandingPage")}
        />
      )}
      {page === "LivelinessCheck" && (
        <LivelinessCheck
          session={session}
          onBack={() => setPage("VerifyIdentity")}
          onCancel={() => setPage("LandingPage")}
        />
      )}
    </>
  );
};
