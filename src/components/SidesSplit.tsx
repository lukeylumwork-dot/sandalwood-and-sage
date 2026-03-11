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
    <div className="grid grid-cols-2 gap-px rounded-lg overflow-hidden border">
      {/* Side A */}
      <div className="bg-secondary p-4 flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          Pro
        </span>
        <p className="text-xs font-semibold text-card-foreground leading-snug">
          {sideALabel}
        </p>
        {sideASummary && (
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            {sideASummary}
          </p>
        )}
      </div>

      {/* Side B */}
      <div className="bg-secondary p-4 flex flex-col gap-1.5 border-l">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          Con
        </span>
        <p className="text-xs font-semibold text-card-foreground leading-snug">
          {sideBLabel}
        </p>
        {sideBSummary && (
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            {sideBSummary}
          </p>
        )}
      </div>
    </div>
  );
};

export default SidesSplit;
