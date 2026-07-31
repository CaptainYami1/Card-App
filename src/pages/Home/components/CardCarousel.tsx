import { useEffect, useRef, useState } from "react";
import { HelpCircle, LoaderCircle, Search, Wallet } from "lucide-react";
import { Button } from "../../../components/Button";
import { BankCard } from "./BankCard";
import type { Card } from "../types";
import { useGetCardsQuery } from "../../../service/appApi";
import { VERIFICATION_ID_KEY } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { ContactSupport } from "./ContactSupport";
import { resolveActiveWindow } from "../activeWindow";

type CardCarouselProps = {
  onOpenSecureWindow: (card: Card) => void;
  onResumeActiveWindow: (card: Card, expiresAt: string) => void;
};

export const CardCarousel = ({
  onOpenSecureWindow,
  onResumeActiveWindow,
}: CardCarouselProps) => {
  const [active, setActive] = useState(0);
  const [, setActiveCard] = useState<Card | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();

  const verificationId =
    sessionStorage.getItem(VERIFICATION_ID_KEY) ?? undefined;
  const { data, isLoading } = useGetCardsQuery(verificationId);
  const cards: Card[] = Array.isArray(data)
    ? data
    : (data?.cards ?? data?.data ?? []);

  // If any card already has an open, unexpired window, jump straight to its
  // Confirmation screen so a second card cannot be opened until it times out.
  const resumedRef = useRef(false);
  useEffect(() => {
    if (resumedRef.current || cards.length === 0) return;
    const activeWindow = resolveActiveWindow(cards);
    if (activeWindow) {
      resumedRef.current = true;
      onResumeActiveWindow(activeWindow.card, activeWindow.expiresAt);
    }
  }, [cards, onResumeActiveWindow]);

  // Guards the primary action: if a window is already open, resume that card
  // instead of opening a (possibly different) one.
  const handleOpen = (card: Card) => {
    const activeWindow = resolveActiveWindow(cards);
    if (activeWindow) {
      onResumeActiveWindow(activeWindow.card, activeWindow.expiresAt);
      return;
    }
    onOpenSecureWindow(card);
  };

  function handleScroll() {
    const el = trackRef.current;
    if (!el) return;
    const viewportCenter = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDistance = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(childCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = i;
      }
    }
    setActive(closest);
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-8 ">
      {isLoading && (
        <div className="flex flex-1 flex-col items-center justify-center ">
          <LoaderCircle color="#30444F" />
          <p className="">Loading cards</p>
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col gap-10">
          {/* Heading */}
          <div>
            <h1 className="text-xl font-semibold text-ink">Your Cards</h1>
            <p className="mt-1 text-sm text-[#484848]">
              Swipe to view your cards
            </p>
          </div>

          {cards.length > 0 && (
            <>
              <div className="flex flex-1 flex-col justify-center">
                <div
                  ref={trackRef}
                  onScroll={handleScroll}
                  className="relative -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {cards.map((card, i) => (
                    <div
                      key={i}
                      className={` shrink-0 snap-center ${cards.length > 1 ? "w-[90%]" : "w-full"}`}
                    >
                      <BankCard
                        number={card.maskedPan}
                        validThrough={card.expiry}
                        imageBytes={card.imageBytes}
                        imageContentType={card.imageContentType}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col items-center gap-7.5">
                  <p className="text-sm">
                    {active + 1} of {cards.length}
                  </p>
                  <div className="flex items-center justify-center gap-1.5">
                    {cards.map((card, i) => (
                      <span
                        key={i}
                        onScroll={() => setActiveCard(card)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === active ? "w-5 bg-ink" : "w-1.5 bg-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col items-center gap-5">
                <Button
                  variant="primary"
                  onClick={() => handleOpen(cards[active])}
                >
                  Open Secure Window
                </Button>
              </div>
              <div className=" flex justify-center -mt-4">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-ink-500 transition hover:opacity-70"
                >
                  <HelpCircle size={14} />
                  Need Help?
                </button>
              </div>
            </>
          )}

          {cards.length === 0 && (
            <div>
              <div className="pt-22 flex  flex-col items-center justify-center text-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-100">
                  <Wallet
                    className="text-ink-500"
                    strokeWidth={1.25}
                    size={52}
                  />
                  <span className="absolute bottom-6 right-7 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
                    <Search
                      className="text-ink-500"
                      strokeWidth={1.75}
                      size={16}
                    />
                  </span>
                </div>

                <h2 className="mt-8 text-lg font-semibold text-ink">
                  No Cards Found
                </h2>
                <p className="mt-2 max-w-42 text-xs leading-5 text-[#484848]">
                  There are no cards linked to this account.
                </p>

                <div className="flex flex-col gap-3 mt-10 w-full">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/verification")}
                  >
                    Go Back
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSupport(true)}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>

              {showSupport && (
                <ContactSupport onClose={() => setShowSupport(false)} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
