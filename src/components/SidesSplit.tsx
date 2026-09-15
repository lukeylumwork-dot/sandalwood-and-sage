interface SidesSplitProps {
  sideALabel: string;
  sideBLabel: string;
  sideASummary?: string;
  sideBSummary?: string;
}

const SidesSplit = ({
  sideALabel,
  sideBLabel,
  sideASummary,
  sideBSummary,
}: SidesSplitProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7">
      {/* Side A */}
      <div className="flex flex-col gap-2 border-t-2 border-primary pt-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          Pro
        </span>
        <p className="text-[0.95rem] font-semibold text-card-foreground leading-snug">
          {sideALabel}
        </p>
        {sideASummary && (
          <p className="font-serif text-[0.9rem] text-muted-foreground leading-[1.6]">
            {sideASummary}
          </p>
        )}
      </div>

      {/* Side B */}
      <div className="flex flex-col gap-2 border-t-2 border-accent-warm pt-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-warm">
          Con
        </span>
        <p className="text-[0.95rem] font-semibold text-card-foreground leading-snug">
          {sideBLabel}
        </p>
        {sideBSummary && (
          <p className="font-serif text-[0.9rem] text-muted-foreground leading-[1.6]">
            {sideBSummary}
          </p>
        )}
      </div>
    </div>
  );
};

export default SidesSplit;
