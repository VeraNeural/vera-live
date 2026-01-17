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
        audioUrl: '', // DB stories use text-to-speech
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
  };

  const handleChapterChange = (index: number) => {
    setCurrentChapterIndex(index);
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
