import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardCarousel } from "./components/CardCarousel";
import { SecureWindow } from "./components/SecureWindow";
import { Confirmation } from "./components/Confirmation";
import { Closed } from "./components/Closed";
import type { Card } from "./types";
import { getRemainingSeconds } from "./activeWindow";

type Screen = "cards" | "secureWindow" | "confirmation" | "closed" | "noCards";

const emptyCard: Card = { id: "", maskedPan: "", expiry: "" };

export const Home = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("cards");
  const [duration, setDuration] = useState(5);
  const [selectedCard, setSelectedCard] = useState<Card>(emptyCard);
  const [activeExpiresAt, setActiveExpiresAt] = useState<string | null>(null);

  // Route into the Confirmation screen for a card whose window is already open.
  const resumeActiveWindow = (card: Card, expiresAt: string) => {
    setSelectedCard(card);
    setActiveExpiresAt(expiresAt);
    setDuration(Math.max(1, Math.ceil(getRemainingSeconds(expiresAt) / 60)));
    setScreen("confirmation");
  };

  // End the session: wipe all stored state and return to verification.
  const handleDone = () => {
    sessionStorage.clear();
    navigate("/verification");
  };

  return (
    <>
      {screen === "cards" && (
        <CardCarousel
          onOpenSecureWindow={(card) => {
            setSelectedCard(card);
            setScreen("secureWindow");
          }}
          onResumeActiveWindow={resumeActiveWindow}
        />
      )}

      {screen === "secureWindow" && (
        <SecureWindow
          card={selectedCard}
          duration={duration}
          onDurationChange={setDuration}
          onBack={() => setScreen("cards")}
          onConfirm={(expiresAt) => {
            setActiveExpiresAt(expiresAt);
            setScreen("confirmation");
          }}
        />
      )}

      {screen === "confirmation" && (
        <Confirmation
          cardId={selectedCard.id}
          durationMinutes={duration}
          expiresAt={activeExpiresAt ?? undefined}
          cardLast4={selectedCard.maskedPan.replace(/\s/g, "").slice(-4)}
          expires={selectedCard.expiry}
          onBack={() => setScreen("secureWindow")}
          onClose={() => {
            setActiveExpiresAt(null);
            setScreen("closed");
          }}
        />
      )}

      {screen === "closed" && (
        <Closed
          onBack={() => setScreen("cards")}
          onDone={handleDone}
          onOpenAgain={() => setScreen("cards")}
        />
      )}
    </>
  );
};
