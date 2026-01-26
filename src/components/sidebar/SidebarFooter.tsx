"use client";

import Link from 'next/link';

type SidebarFooterProps = {
  isDark: boolean;
  /** @deprecated Use links directly - callbacks kept for backward compatibility */
  onOpenPrivacy?: () => void;
  /** @deprecated Use links directly - callbacks kept for backward compatibility */
  onOpenTerms?: () => void;
};

export function SidebarFooter({ isDark }: SidebarFooterProps) {
  const borderColor = isDark ? 'border-white/[0.06]' : 'border-black/[0.06]';
  const textClass = isDark ? 'text-gray-500' : 'text-gray-400';
  const hoverClass = isDark ? 'hover:text-gray-300' : 'hover:text-gray-600';

  return (
    <div className={`pt-3 border-t ${borderColor} flex items-center justify-center gap-4`}>
      <Link
        href="/legal/privacy"
        className={`text-[11px] ${textClass} ${hoverClass} transition-colors duration-150`}
      >
        Privacy
      </Link>
      <span className={`text-[11px] ${textClass} opacity-40`}>·</span>
      <Link
        href="/legal/terms"
        className={`text-[11px] ${textClass} ${hoverClass} transition-colors duration-150`}
      >
        Terms
      </Link>
    </div>
  );
}