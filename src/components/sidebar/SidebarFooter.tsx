"use client";

type SidebarFooterProps = {
  isDark: boolean;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
};

export function SidebarFooter({ isDark, onOpenPrivacy, onOpenTerms }: SidebarFooterProps) {
  const borderColor = isDark ? 'border-white/[0.06]' : 'border-black/[0.06]';
  const textClass = isDark ? 'text-gray-500' : 'text-gray-400';
  const hoverClass = isDark ? 'hover:text-gray-300' : 'hover:text-gray-600';

  return (
    <div className={`pt-3 border-t ${borderColor} flex items-center justify-center gap-4`}>
      <button
        onClick={onOpenPrivacy}
        className={`text-[11px] ${textClass} ${hoverClass} transition-colors duration-150`}
      >
        Privacy
      </button>
      <span className={`text-[11px] ${textClass} opacity-40`}>·</span>
      <button
        onClick={onOpenTerms}
        className={`text-[11px] ${textClass} ${hoverClass} transition-colors duration-150`}
      >
        Terms
      </button>
    </div>
  );
}