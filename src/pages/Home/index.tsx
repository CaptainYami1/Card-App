import { useState } from "react";
import { CardCarousel } from "./components/CardCarousel";
import { SecureWindow } from "./components/SecureWindow";
import { Confirmation } from "./components/Confirmation";
import { Closed } from "./components/Closed";
import { NoCards } from "./components/NoCards";
import type { Card } from "./types";
import { useGetCardsQuery } from "../../service/appApi";
import { VERIFICATION_ID_KEY } from "../../auth/AuthContext";

type Screen = "cards" | "secureWindow" | "confirmation" | "closed" | "noCards";

const emptyCard: Card = { id: "", maskedPan: "", expiry: "" };

export const Home = () => {
  const [screen, setScreen] = useState<Screen>("cards");
  const [duration, setDuration] = useState(5);
  const [selectedCard, setSelectedCard] = useState<Card>(emptyCard);
  const verificationId =
    sessionStorage.getItem(VERIFICATION_ID_KEY) ?? undefined;
  const { data } = useGetCardsQuery(verificationId);

  const cards = Array.isArray(data)
    ? data
    : (data?.cards ?? data?.data ?? []);

  // Derive the screen instead of syncing it via an effect: once the cards have
  // loaded and the account has none, always show NoCards. Otherwise fall back
  // to the user-navigable screen state.
  const activeScreen: Screen = data && cards.length === 0 ? "noCards" : screen;

  return (
    <>
      {activeScreen === "cards" && (
        <CardCarousel
          onOpenSecureWindow={(card) => {
            setSelectedCard(card);
            setScreen("secureWindow");
          }}
        />
      )}

      {activeScreen === "secureWindow" && (
        <SecureWindow
          card={selectedCard}
          duration={duration}
          onDurationChange={setDuration}
          onBack={() => setScreen("cards")}
          onConfirm={() => setScreen("confirmation")}
        />
      )}

      {activeScreen === "confirmation" && (
        <Confirmation
          cardId={selectedCard.id}
          durationMinutes={duration}
          cardLast4={selectedCard.maskedPan.replace(/\s/g, "").slice(-4)}
          expires={selectedCard.expiry}
          onBack={() => setScreen("secureWindow")}
          onClose={() => setScreen("closed")}
        />
      )}

      {activeScreen === "closed" && (
        <Closed
          onBack={() => setScreen("cards")}
          onDone={() => setScreen("cards")}
          onOpenAgain={() => setScreen("secureWindow")}
        />
      )}

      {activeScreen === "noCards" && <NoCards />}
    </>
  );
};
