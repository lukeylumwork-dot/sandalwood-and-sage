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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-lg overflow-hidden border bg-border">
      {/* Side A */}
      <div className="bg-secondary p-4 sm:p-5 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          Pro
        </span>
        <p className="text-sm font-semibold text-card-foreground leading-snug">
          {sideALabel}
        </p>
        {sideASummary && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {sideASummary}
          </p>
        )}
      </div>

      {/* Side B */}
      <div className="bg-secondary p-4 sm:p-5 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          Con
        </span>
        <p className="text-sm font-semibold text-card-foreground leading-snug">
          {sideBLabel}
        </p>
        {sideBSummary && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {sideBSummary}
          </p>
        )}
      </div>
    </div>
  );
};

export default SidesSplit;
