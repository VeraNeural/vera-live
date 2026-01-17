/**
 * AudioPlayer Component
 * 
 * Audio playback controls for Library stories with chapter navigation.
 * Handles play/pause, rewind/forward, progress tracking, and chapter selection.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { Story, Chapter } from '../types';

interface AudioPlayerProps {
  story: Story;
  currentChapterIndex: number;
  onChapterChange: (index: number) => void;
  accentColor: string;
  accentDimColor: string;
  textDimColor: string;
}

export function AudioPlayer({
  story,
  currentChapterIndex,
  onChapterChange,
  accentColor,
  accentDimColor,
  textDimColor,
}: AudioPlayerProps) {
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentChapter = story.chapters[currentChapterIndex];

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setAudioProgress(audio.currentTime);
    const handleLoadedMetadata = () => setAudioDuration(audio.duration);
    const handleEnded = () => {
      if (currentChapterIndex < story.chapters.length - 1) {
        onChapterChange(currentChapterIndex + 1);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
          }
        }, 300);
      } else {
        setIsPlaying(false);
        setAudioProgress(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [story, currentChapterIndex, onChapterChange]);

  // Reset playback when chapter changes
  useEffect(() => {
    setAudioProgress(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentChapterIndex]);

  // Playback controls
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 15
      );
    }
  };

  const handleChapterSelect = (index: number) => {
    onChapterChange(index);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Chapter List */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {story.chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            onClick={() => handleChapterSelect(index)}
            style={{
              padding: '8px 14px',
              background: index === currentChapterIndex
                ? 'rgba(255, 180, 100, 0.15)'
                : 'rgba(255, 180, 100, 0.06)',
              border: `1px solid ${
                index === currentChapterIndex
                  ? 'rgba(255, 180, 100, 0.3)'
                  : 'rgba(255, 180, 100, 0.15)'
              }`,
              borderRadius: 8,
              color: index === currentChapterIndex ? accentColor : accentDimColor,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: index === currentChapterIndex ? 500 : 400,
            }}
          >
            Ch {index + 1}
          </button>
        ))}
      </div>

      {/* Current Chapter Info */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20,
          fontWeight: 300,
          color: accentColor,
          marginBottom: 4,
        }}>
          {currentChapter.title}
        </h2>
        <span style={{ fontSize: 13, color: textDimColor }}>
          {currentChapter.duration}
        </span>
      </div>

      {/* Play/Pause Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <button
          onClick={togglePlayPause}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: isPlaying
              ? 'rgba(255, 180, 100, 0.2)'
              : 'rgba(255, 180, 100, 0.12)',
            border: `1px solid ${
              isPlaying
                ? 'rgba(255, 180, 100, 0.4)'
                : 'rgba(255, 180, 100, 0.25)'
            }`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isPlaying ? (
            <div style={{ display: 'flex', gap: 5 }}>
              <div style={{ width: 5, height: 22, background: accentColor, borderRadius: 2 }} />
              <div style={{ width: 5, height: 22, background: accentColor, borderRadius: 2 }} />
            </div>
          ) : (
            <div style={{
              width: 0,
              height: 0,
              borderTop: '12px solid transparent',
              borderBottom: '12px solid transparent',
              borderLeft: `20px solid ${accentColor}`,
              marginLeft: 4,
            }} />
          )}
        </button>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentChapter.audioUrl}
        preload="metadata"
      />

      {/* Progress Bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          width: '100%',
          height: 4,
          background: 'rgba(255, 180, 100, 0.15)',
          borderRadius: 2,
          marginBottom: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${audioDuration ? (audioProgress / audioDuration) * 100 : 0}%`,
            background: accentColor,
            borderRadius: 2,
            transition: 'width 0.1s linear',
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          color: textDimColor,
        }}>
          <span>{formatTime(audioProgress)}</span>
          <span>{formatTime(audioDuration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
      }}>
        <button
          onClick={handleRewind}
          style={{
            padding: '10px 16px',
            background: 'rgba(255, 180, 100, 0.08)',
            border: '1px solid rgba(255, 180, 100, 0.2)',
            borderRadius: 8,
            color: accentDimColor,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          -15s
        </button>
        <button
          onClick={handleStop}
          style={{
            padding: '10px 16px',
            background: 'rgba(200, 100, 80, 0.08)',
            border: '1px solid rgba(200, 100, 80, 0.2)',
            borderRadius: 8,
            color: 'rgba(220, 120, 100, 0.7)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Stop
        </button>
        <button
          onClick={handleForward}
          style={{
            padding: '10px 16px',
            background: 'rgba(255, 180, 100, 0.08)',
            border: '1px solid rgba(255, 180, 100, 0.2)',
            borderRadius: 8,
            color: accentDimColor,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          +15s
        </button>
      </div>

      {/* Chapter Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
      }}>
        <button
          onClick={() => handleChapterSelect(currentChapterIndex - 1)}
          disabled={currentChapterIndex === 0}
          style={{
            padding: '10px 16px',
            background: 'rgba(255, 180, 100, 0.1)',
            border: '1px solid rgba(255, 180, 100, 0.2)',
            borderRadius: 8,
            color: accentDimColor,
            fontSize: 13,
            cursor: currentChapterIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentChapterIndex === 0 ? 0.4 : 1,
          }}
        >
          ← Prev
        </button>
        <span style={{ fontSize: 12, color: textDimColor }}>
          {currentChapterIndex + 1} / {story.chapters.length}
        </span>
        <button
          onClick={() => handleChapterSelect(currentChapterIndex + 1)}
          disabled={currentChapterIndex === story.chapters.length - 1}
          style={{
            padding: '10px 16px',
            background: 'rgba(255, 180, 100, 0.1)',
            border: '1px solid rgba(255, 180, 100, 0.2)',
            borderRadius: 8,
            color: accentDimColor,
            fontSize: 13,
            cursor: currentChapterIndex === story.chapters.length - 1
              ? 'not-allowed'
              : 'pointer',
            opacity: currentChapterIndex === story.chapters.length - 1 ? 0.4 : 1,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
