import { useState } from "react";
import { CardCarousel } from "./components/CardCarousel";
import { SecureWindow } from "./components/SecureWindow";
import { Confirmation } from "./components/Confirmation";
import { Closed } from "./components/Closed";
import { NoCards } from "./components/NoCards";
import type { Card } from "./types";

type Screen = "cards" | "secureWindow" | "confirmation" | "closed" | "noCards";

const emptyCard: Card = { id: "", maskedPan: "", expiry: "" };

export const Home = () => {
  const [screen, setScreen] = useState<Screen>("noCards");
  const [duration, setDuration] = useState(5);
  const [selectedCard, setSelectedCard] = useState<Card>(emptyCard);


  return (
    <>
      {screen === "cards" && (
        <CardCarousel
          onOpenSecureWindow={(card) => {
            setSelectedCard(card);
            setScreen("secureWindow");
          }}
        />
      )}

      {screen === "secureWindow" && (
        <SecureWindow
          card={selectedCard}
          duration={duration}
          onDurationChange={setDuration}
          onBack={() => setScreen("cards")}
          onConfirm={() => setScreen("confirmation")}
        />
      )}

      {screen === "confirmation" && (
        <Confirmation
          cardId={selectedCard.id}
          durationMinutes={duration}
          cardLast4={selectedCard.maskedPan.replace(/\s/g, "").slice(-4)}
          expires={selectedCard.expiry}
          onBack={() => setScreen("secureWindow")}
          onClose={() => setScreen("closed")}
        />
      )}

      {screen === "closed" && (
        <Closed
          onBack={() => setScreen("cards")}
          onDone={() => setScreen("cards")}
          onOpenAgain={() => setScreen("secureWindow")}
        />
      )}

      {screen === "noCards" && <NoCards />}
    </>
  );
};
