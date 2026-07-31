import card from "../../../assets/card.png";

type BankCardProps = {
  number?: string;
  validThrough?: string;
  imageBytes?: string;
  imageContentType?: string;
  className?: string;
};

export const BankCard = ({
  number,
  validThrough,
  imageBytes,
  imageContentType,
  className = "",
}: BankCardProps) => {
  const artwork =
    imageBytes && imageContentType
      ? `data:${imageContentType};base64,${imageBytes}`
      : card;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Full card artwork — sizes the container to the image so nothing is cropped */}
      <img
        src={artwork}
        alt="Providus card"
        className="block w-full rounded-2xl"
      />

      {/* Dynamic overlays */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
        <p className="font-mono text-[17px] tracking-[0.12em]">{number}</p>
        <div className="mt-5 leading-tight">
          <p className="text-[8px] uppercase tracking-wider text-white/60">
            Valid Through
          </p>
          <p className="text-[11px] tracking-wide mt-2.5">{validThrough}</p>
        </div>
      </div>
    </div>
  );
};
