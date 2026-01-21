import React, { useState, useEffect, useRef } from 'react';
import { FlexibleAction } from './shared/types';

interface WorkLifeActivity {
  id: string;
  label?: string;
  title: string;
}

interface WorkLifeFormProps {
  action: FlexibleAction;
  workLifeMode?: string;
  onWorkLifeModeChange: (mode: string) => void;
  workLifeActivities?: WorkLifeActivity[];
  workLifeTone?: string;
  onWorkLifeToneChange?: (tone: string) => void;
  workLifeSecondaryMode?: string;
  onWorkLifeSecondaryModeChange?: (mode: string) => void;
  onWorkLifeContextChange?: (context: string) => void;
  colors: {
    accent: string;
    text: string;
    textMuted: string;
  };
  isDark: boolean;
  inputBorder: string;
  layerCardStyle: React.CSSProperties;
  sectionLabelStyle: React.CSSProperties;
}

export const WorkLifeForm: React.FC<WorkLifeFormProps> = ({
  action,
  workLifeMode,
  onWorkLifeModeChange,
  workLifeActivities,
  workLifeTone,
  onWorkLifeToneChange,
  workLifeSecondaryMode,
  onWorkLifeSecondaryModeChange,
  onWorkLifeContextChange,
  colors,
  isDark,
  inputBorder,
  layerCardStyle,
  sectionLabelStyle,
}) => {
  const [activeMode, setActiveMode] = useState<string>('task-breakdown');
  const [showMoreModes, setShowMoreModes] = useState(false);
  const workLifeToneRef = useRef<HTMLDivElement>(null);

  const workLifePrimaryModes = workLifeActivities?.length
    ? workLifeActivities.map((activity) => ({
        id: activity.id,
        label: activity.label || activity.title,
      }))
    : [
        { id: 'task-breakdown', label: 'Task Breakdown' },
        { id: 'decision-helper', label: 'Decision Helper' },
        { id: 'planning', label: 'Planning' },
      ];

  const workLifeToneModes = [
    { id: 'clear', label: 'Clear' },
    { id: 'strategic', label: 'Strategic' },
    { id: 'practical', label: 'Practical' },
    { id: 'calm', label: 'Calm' },
  ];

  const workLifeSecondaryModes = [
    { id: 'prioritization', label: 'Prioritization' },
    { id: 'time', label: 'Time Blocking' },
    { id: 'overwhelm', label: 'Overwhelm Reset' },
    { id: 'project', label: 'Project Mapping' },
  ];

  const showWorkLifeTone = activeMode === 'decision-helper' || activeMode === 'planning';

  const useOverflowWatcher = (refs: React.RefObject<HTMLElement | null>[], deps: React.DependencyList) => {
    const [isOverflow, setIsOverflow] = useState(false);

    useEffect(() => {
      const checkOverflow = () => {
        setIsOverflow(
          refs.some((ref) => {
            const el = ref.current;
            return el ? el.scrollWidth > el.clientWidth + 1 : false;
          })
        );
      };

      checkOverflow();
      const observer = new ResizeObserver(checkOverflow);
      refs.forEach((ref) => {
        if (ref.current) observer.observe(ref.current);
      });
      window.addEventListener('resize', checkOverflow);

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', checkOverflow);
      };
    }, deps);

    return isOverflow;
  };

  const showWorkLifeMore = useOverflowWatcher([workLifeToneRef], [action.id]);

  // Sync workLifeMode prop to local activeMode state
  useEffect(() => {
    if (workLifeMode && workLifeMode !== activeMode) {
      setActiveMode(workLifeMode);
    }
  }, [workLifeMode, activeMode]);

  // Initialize on mount
  useEffect(() => {
    setShowMoreModes(false);
    const defaultWorkLifeId = workLifeMode || workLifeActivities?.[0]?.id || 'task-breakdown';
    setActiveMode(defaultWorkLifeId);
    if (!workLifeMode) {
      onWorkLifeModeChange(defaultWorkLifeId);
    }
    onWorkLifeToneChange?.('clear');
    onWorkLifeContextChange?.('');
    onWorkLifeSecondaryModeChange?.('');
  }, [action.id]);

  const handleModeChange = (modeId: string) => {
    setActiveMode(modeId);
    onWorkLifeModeChange(modeId);
    setShowMoreModes(false);
  };

  return (
    <>
      <div style={sectionLabelStyle}>Activity</div>
      <div style={layerCardStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {workLifePrimaryModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                border: `1px solid ${mode.id === activeMode ? colors.accent : inputBorder}`,
                background: 'transparent',
                color: mode.id === activeMode ? colors.text : colors.textMuted,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      {showWorkLifeTone && (
        <>
          <div style={sectionLabelStyle}>Tone</div>
          <div style={layerCardStyle}>
            <div ref={workLifeToneRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {onWorkLifeToneChange && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {workLifeToneModes.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => onWorkLifeToneChange(tone.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        border: `1px solid ${tone.id === workLifeTone ? colors.accent : inputBorder}`,
                        background: 'transparent',
                        color: tone.id === workLifeTone ? colors.text : colors.textMuted,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              )}
              {showWorkLifeMore && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowMoreModes((prev) => !prev)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 999,
                      border: `1px solid ${showMoreModes ? colors.accent : inputBorder}`,
                      background: 'transparent',
                      color: showMoreModes ? colors.text : colors.textMuted,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    More
                  </button>
                </div>
              )}
              {showMoreModes && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {workLifeSecondaryModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => onWorkLifeSecondaryModeChange?.(mode.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        border: `1px solid ${mode.id === workLifeSecondaryMode ? colors.accent : inputBorder}`,
                        background: 'transparent',
                        color: mode.id === workLifeSecondaryMode ? colors.text : colors.textMuted,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
