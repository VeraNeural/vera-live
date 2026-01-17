/**
 * StoryTab Component
 * 
 * Stories tab view with category selection, story list, and audio player integration.
 */

'use client';

import type { Story, CategoryItem, DBStory } from '../types';
import { STORY_CATEGORIES, STORIES } from '../data/stories';
import { StoryCategoryIcon } from '../icons';
import { AudioPlayer } from './AudioPlayer';
import { generateStoryAudio } from '../generation/audioGenerator';

interface StoryTabProps {
  colors: {
    bg: string;
    text: string;
    textMuted: string;
    textDim: string;
    cardBg: string;
    cardBorder: string;
    accent: string;
    accentDim: string;
  };
  dbStories?: DBStory[];
}

export function StoryTab({ colors, dbStories = [] }: StoryTabProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedStory, setSelectedStory] = React.useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationError, setGenerationError] = React.useState<string | null>(null);

  // Combine hardcoded and database stories
  const allStories: Story[] = [
    ...STORIES,
    ...dbStories.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      category: s.category,
      chapters: s.chapters.map(ch => ({
        id: ch.id,
        title: ch.title,
        duration: ch.duration,
        audioUrl: typeof (ch as any).audioUrl === 'string' ? (ch as any).audioUrl : '',
        text: ch.text,
      }))
    }))
  ];

  const storiesInCategory = selectedCategory
    ? allStories.filter(s => s.category === selectedCategory)
    : [];

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedStory(null);
    setCurrentChapterIndex(0);
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setCurrentChapterIndex(0);
    setGenerationError(null);
  };

  const handleChapterChange = (index: number) => {
    setCurrentChapterIndex(index);
    setGenerationError(null);
  };

  const handleGenerateVoice = async () => {
    if (!selectedStory) return;
    const chapter = selectedStory.chapters[currentChapterIndex];
    if (!chapter || chapter.audioUrl) return;
    if (!chapter.text) {
      setGenerationError('This story has no text available for narration.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    try {
      const { audioUrl } = await generateStoryAudio({
        text: chapter.text,
        storyId: selectedStory.id,
        chapterId: chapter.id,
      });

      setSelectedStory((prev) => {
        if (!prev) return prev;
        const nextChapters = prev.chapters.map((ch, idx) =>
          idx === currentChapterIndex ? { ...ch, audioUrl } : ch
        );
        return { ...prev, chapters: nextChapters };
      });
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Narration failed');
    } finally {
      setIsGenerating(false);
    }
  };

  // Category Grid View
  if (!selectedCategory && !selectedStory) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
        maxWidth: 360,
        width: '100%',
        animation: 'fadeIn 0.4s ease-out',
      }}>
        {STORY_CATEGORIES.map((category) => (
          <button
            key={category.id}
            className="card-btn"
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: '18px 16px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {/* Icon */}
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 180, 100, 0.10)',
              border: '1px solid rgba(255, 180, 100, 0.18)',
              marginBottom: 12,
            }}>
              <StoryCategoryIcon type={category.icon} color={colors.accent} />
            </div>

            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 16,
              fontWeight: 400,
              color: colors.text,
              marginBottom: 6,
            }}>
              {category.title}
            </div>
            <div style={{
              fontSize: 12,
              color: colors.textDim,
              marginBottom: 8,
              lineHeight: 1.4,
            }}>
              {category.description}
            </div>
            <div style={{
              fontSize: 11,
              color: colors.accentDim,
            }}>
              {allStories.filter(s => s.category === category.id).length} stories
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Story List View
  if (selectedCategory && !selectedStory) {
    return (
      <div style={{
        width: '100%',
        maxWidth: 400,
        animation: 'fadeIn 0.4s ease-out',
      }}>
        <button
          onClick={handleBackToCategories}
          style={{
            background: 'none',
            border: 'none',
            color: colors.accentDim,
            fontSize: 13,
            cursor: 'pointer',
            marginBottom: 16,
          }}
        >
          ← Back to categories
        </button>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22,
          fontWeight: 300,
          color: colors.text,
          marginBottom: 20,
          textAlign: 'center',
        }}>
          {STORY_CATEGORIES.find(c => c.id === selectedCategory)?.title}
        </h2>

        {storiesInCategory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {storiesInCategory.map((story) => (
              <button
                key={story.id}
                className="card-btn"
                onClick={() => handleStoryClick(story)}
                style={{
                  padding: '18px',
                  background: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 14,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 17,
                    fontWeight: 400,
                    color: colors.text,
                    flex: 1,
                  }}>
                    {story.title}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: colors.accentDim,
                    marginLeft: 12,
                  }}>
                    {story.chapters.length} chapters
                  </div>
                </div>
                <div style={{
                  fontSize: 13,
                  color: colors.textDim,
                  lineHeight: 1.5,
                }}>
                  {story.description}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 40,
            color: colors.textDim,
          }}>
            Stories coming soon
          </div>
        )}
      </div>
    );
  }

  // Story Player View
  if (selectedStory) {
    const current = selectedStory.chapters[currentChapterIndex];
    const needsVoice = Boolean(current && !current.audioUrl);

    return (
      <div style={{
        width: '100%',
        maxWidth: 400,
        animation: 'fadeIn 0.4s ease-out',
      }}>
        <button
          onClick={handleBackToCategories}
          style={{
            background: 'none',
            border: 'none',
            color: colors.accentDim,
            fontSize: 13,
            cursor: 'pointer',
            marginBottom: 20,
          }}
        >
          ← Back to stories
        </button>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 24,
          fontWeight: 300,
          color: colors.text,
          textAlign: 'center',
          marginBottom: 24,
        }}>
          {selectedStory.title}
        </h1>

        {needsVoice && (
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={handleGenerateVoice}
              disabled={isGenerating}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                border: `1px solid ${colors.cardBorder}`,
                background: colors.cardBg,
                color: colors.text,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              {isGenerating ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <g fill="none" fillRule="evenodd">
                      <g transform="translate(1 1)" stroke={colors.accent} strokeWidth="2">
                        <circle strokeOpacity=".25" cx="18" cy="18" r="18" />
                        <path d="M36 18c0-9.94-8.06-18-18-18">
                          <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
                        </path>
                      </g>
                    </g>
                  </svg>
                  <span>VERA is narrating...</span>
                </>
              ) : (
                <span>🎙️ Generate Voice</span>
              )}
            </button>

            {generationError && (
              <div style={{ marginTop: 10, fontSize: 12, color: colors.textDim, textAlign: 'center' }}>
                {generationError}
              </div>
            )}
          </div>
        )}

        <AudioPlayer
          story={selectedStory}
          currentChapterIndex={currentChapterIndex}
          onChapterChange={handleChapterChange}
          accentColor={colors.accent}
          accentDimColor={colors.accentDim}
          textDimColor={colors.textDim}
        />
      </div>
    );
  }

  return null;
}

// Re-export React for use in component
import React from 'react';
