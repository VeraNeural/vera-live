"use client";

import { useState } from 'react';
import { ShieldIcon, ChevronRightIcon, ChevronDownIcon } from './SidebarIcons';

type SidebarSectionsProps = {
  isDark: boolean;
  accessTier: 'anonymous' | 'free' | 'forge' | 'sanctuary';
};

type Section = {
  id: string;
  title: string;
  content: string[];
};

export function SidebarSections({ isDark, accessTier }: SidebarSectionsProps) {
  const [expanded, setExpanded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const borderColor = isDark ? 'border-white/[0.08]' : 'border-black/[0.06]';
  const iconColor = isDark ? 'rgba(255, 250, 245, 0.4)' : 'rgba(60, 50, 40, 0.4)';

  const headerClass = isDark
    ? 'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/[0.06] transition-all duration-150'
    : 'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-black/[0.04] transition-all duration-150';

  const sectionBtnClass = isDark
    ? 'flex items-center justify-between w-full px-3 py-2.5 text-left text-gray-300 hover:bg-white/[0.04] transition-all duration-150'
    : 'flex items-center justify-between w-full px-3 py-2.5 text-left text-gray-700 hover:bg-black/[0.03] transition-all duration-150';

  const contentClass = isDark
    ? 'text-[12px] leading-relaxed text-gray-400'
    : 'text-[12px] leading-relaxed text-gray-500';

  const cardClass = isDark
    ? 'rounded-lg bg-white/[0.03] overflow-hidden'
    : 'rounded-lg bg-black/[0.02] overflow-hidden';

  const sections: Section[] = [
    {
      id: 'what',
      title: 'What VERA is',
      content: [
        "VERA works through conversation. It listens for what is actually needed, then helps you move one step at a time.",
        "You do not need to write perfect prompts. You can start wherever you are — with a feeling, a question, or a half formed thought.",
      ],
    },
    {
      id: 'why',
      title: 'Why VERA feels different',
      content: [
        "VERA adapts to the moment, the context, and your pacing. It can be direct when you want clarity, and quiet when you need space.",
        "The goal is containment and steadiness. The conversation should feel grounded, not performative.",
      ],
    },
    {
      id: 'access',
      title: accessTier === 'anonymous' 
        ? 'Anonymous conversations' 
        : accessTier === 'free' 
          ? 'Free account' 
          : accessTier === 'forge'
            ? 'Forge'
            : 'Sanctuary',
      content: accessTier === 'anonymous'
        ? ["Anonymous conversations are temporary: they are not saved and not tied to you as a person."]
        : accessTier === 'free'
          ? ["With a free account, basic usage is tracked. Conversations are not saved as long term history."]
          : accessTier === 'forge'
            ? ["You are in Forge. Structured build workflows are available with deterministic outputs."]
            : ["You are in Sanctuary. Conversations can go deeper, memory is available with consent, and usage limits are lifted."],
    },
    {
      id: 'build',
      title: 'Build (coming soon)',
      content: [
        "Build is coming later. It is meant for moments when creation needs more structure than a chat thread.",
      ],
    },
    {
      id: 'privacy',
      title: 'Conversation privacy',
      content: [
        "Conversations are handled with care. You control what is saved and what is forgotten.",
      ],
    },
    {
      id: 'trust',
      title: 'Trust, safety, and responsibility',
      content: [
        "VERA is designed with restraint. It should prioritize safety, clarity, and consent over intensity.",
        "If something feels off, pause and ask for a simpler explanation or a slower pace.",
      ],
    },
  ];

  return (
    <div className={`border-t ${borderColor} pt-3 mt-2`}>
      {/* Main Toggle */}
      <button onClick={() => setExpanded(!expanded)} className={headerClass}>
        <div className="flex items-center gap-3">
          <ShieldIcon size={18} color={iconColor} />
          <span className="text-sm font-medium">Trust & Transparency</span>
        </div>
        {expanded
          ? <ChevronDownIcon size={14} color={iconColor} />
          : <ChevronRightIcon size={14} color={iconColor} />
        }
      </button>

      {/* Expanded Sections */}
      {expanded && (
        <div className="mt-2 flex flex-col gap-1 px-1">
          {sections.map((section) => (
            <div key={section.id} className={cardClass}>
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className={sectionBtnClass}
              >
                <span className="text-[13px] font-medium">{section.title}</span>
                {openSection === section.id
                  ? <ChevronDownIcon size={12} color={iconColor} />
                  : <ChevronRightIcon size={12} color={iconColor} />
                }
              </button>

              {openSection === section.id && (
                <div className="px-3 pb-3">
                  {section.content.map((p, i) => (
                    <p key={i} className={`${contentClass} ${i > 0 ? 'mt-2' : ''}`}>
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}