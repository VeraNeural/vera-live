"use client";

import { useState } from 'react';
import { BrainIcon, TrashIcon } from './SidebarIcons';

type SidebarMemoryProps = {
  isDark: boolean;
  memoryEnabled: boolean | null;
  isLoading: boolean;
  onToggle: () => void;
  onDeleteAll: () => void;
};

export function SidebarMemory({
  isDark,
  memoryEnabled,
  isLoading,
  onToggle,
  onDeleteAll,
}: SidebarMemoryProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const borderColor = isDark ? 'border-white/[0.08]' : 'border-black/[0.06]';
  const iconColor = isDark ? 'rgba(200, 170, 120, 0.9)' : 'rgba(180, 140, 90, 0.9)';

  const cardClass = isDark
    ? 'rounded-xl bg-white/[0.03] border border-white/[0.06] p-4'
    : 'rounded-xl bg-black/[0.02] border border-black/[0.04] p-4';

  const labelClass = isDark ? 'text-gray-200' : 'text-gray-800';
  const subLabelClass = isDark ? 'text-gray-400' : 'text-gray-500';
  const textClass = isDark ? 'text-gray-400' : 'text-gray-500';

  const handleDelete = () => {
    onDeleteAll();
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`border-t ${borderColor} pt-4 mt-2`}>
      <div className={cardClass}>
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BrainIcon size={18} color={iconColor} />
            <div>
              <div className={`text-sm font-medium ${labelClass}`}>Memory</div>
              <div className={`text-[11px] ${subLabelClass}`}>
                {memoryEnabled ? 'Conversations saved' : 'Private mode'}
              </div>
            </div>
          </div>

          <button
            onClick={onToggle}
            disabled={isLoading}
            className={`
              relative w-11 h-6 rounded-full transition-colors duration-200
              ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
              ${memoryEnabled
                ? (isDark ? 'bg-amber-600/60' : 'bg-amber-500/70')
                : (isDark ? 'bg-white/15' : 'bg-black/10')
              }
            `}
          >
            <div
              className={`
                absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200
                ${memoryEnabled ? 'left-6' : 'left-1'}
              `}
            />
          </button>
        </div>

        {/* Description */}
        <p className={`text-[12px] leading-relaxed ${textClass}`}>
          {memoryEnabled
            ? "VERA remembers your conversations for continuity. You're always in control."
            : "Conversations are private and not saved. Enable for continuity."}
        </p>

        {/* Delete Button */}
        {memoryEnabled && !showDeleteConfirm && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`
              flex items-center justify-center gap-2 w-full mt-3 py-2 rounded-lg text-[12px] font-medium
              transition-all duration-150
              ${isDark
                ? 'border border-red-500/20 text-red-400/80 hover:bg-red-500/10'
                : 'border border-red-400/30 text-red-500/80 hover:bg-red-50'
              }
            `}
          >
            <TrashIcon size={14} />
            Clear all conversations
          </button>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div
            className={`
              mt-3 p-3 rounded-lg
              ${isDark
                ? 'bg-red-500/10 border border-red-500/20'
                : 'bg-red-50 border border-red-200'
              }
            `}
          >
            <p className={`text-[12px] mb-3 ${labelClass}`}>
              This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className={`
                  flex-1 py-2 rounded-lg text-[12px] font-semibold transition-colors
                  ${isLoading ? 'opacity-50 cursor-wait' : ''}
                  ${isDark
                    ? 'bg-red-500/30 text-red-200'
                    : 'bg-red-100 text-red-700'
                  }
                `}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`
                  flex-1 py-2 rounded-lg text-[12px] font-medium border transition-colors
                  ${isDark
                    ? 'border-white/10 text-gray-400 hover:bg-white/5'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}