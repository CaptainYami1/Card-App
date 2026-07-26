import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, Search } from "lucide-react";
import { Button } from "../../../components/Button";
import { ContactSupport } from "./ContactSupport";

export const NoCards = () => {
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-1 flex-col px-6 pb-6 pt-6">
      {/* Heading */}
      <div>
        <h1 className="text-xl font-semibold text-ink">Your Cards</h1>
        <p className="mt-1 text-sm text-[#484848]">Swipe to view your cards</p>
      </div>

      {/* Empty state */}
      <div className="pt-22 flex  flex-col items-center justify-center text-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-100">
          <Wallet className="text-ink-500" strokeWidth={1.25} size={52} />
          <span className="absolute bottom-6 right-7 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
            <Search className="text-ink-500" strokeWidth={1.75} size={16} />
          </span>
        </div>

        <h2 className="mt-8 text-lg font-semibold text-ink">No Cards Found</h2>
        <p className="mt-2 max-w-42 text-xs leading-5 text-[#484848]">
          There are no cards linked to this account.
        </p>

        <div className="flex flex-col gap-3 mt-10 w-full">
        <Button variant="primary" onClick={() => navigate("/verification")}>
          Go Back
        </Button>
        <Button variant="outline" onClick={() => setShowSupport(true)}>
          Contact Support
        </Button>
      </div>
      </div>

      
      

      {showSupport && <ContactSupport onClose={() => setShowSupport(false)} />}
    </div>
  );
};
