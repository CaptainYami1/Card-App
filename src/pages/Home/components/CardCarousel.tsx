import { useRef, useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "../../../components/Button";
import { BankCard } from "./BankCard";
import type { Card } from "../types";
import { useGetCardsQuery } from "../../../service/appApi";
import { VERIFICATION_ID_KEY } from "../../../auth/AuthContext";

type CardCarouselProps = {
  onOpenSecureWindow: (card: Card) => void;
};

export const CardCarousel = ({ onOpenSecureWindow }: CardCarouselProps) => {
  const [active, setActive] = useState(0);
  const [, setActiveCard] = useState<Card | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const verificationId = sessionStorage.getItem(VERIFICATION_ID_KEY) ?? undefined;
  const { data } = useGetCardsQuery(verificationId);
  const cards: Card[] = Array.isArray(data)
    ? data
    : (data?.cards ?? data?.data ?? []);

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
    <div className="flex flex-1 flex-col px-6 py-8">
      <div className="flex flex-col gap-10">
        {/* Heading */}
        <div>
          <h1 className="text-xl font-semibold text-ink">Your Cards</h1>
          <p className="mt-1 text-sm text-[#484848]">
            Swipe to view your cards
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="relative -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((card, i) => (
              <div key={i} className="w-[90%] shrink-0 snap-center">
                <BankCard
                  number={card.maskedPan}
                  validThrough={card.expiry}
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

        {/* Actions */}
        <div className="mt-auto flex flex-col items-center gap-5">
          <Button
            variant="primary"
            onClick={() => onOpenSecureWindow(cards[active])}
          >
            Open Secure Window
          </Button>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-ink-500 transition hover:opacity-70"
        >
          <HelpCircle size={14} />
          Need Help?
        </button>
      </div>
    </div>
  );
};
