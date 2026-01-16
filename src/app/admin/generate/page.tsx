'use client';

import { useState } from 'react';

type ContentType = 'assessment' | 'lesson' | 'story';

interface GeneratedContent {
  title: string;
  [key: string]: any;
}

export default function AdminGeneratorPage() {
  const [contentType, setContentType] = useState<ContentType>('assessment');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [count, setCount] = useState(12);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType,
          topic,
          description,
          count,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;

    setIsSaving(true);
    setError(null);

    try {
      let table = '';
      let data: Record<string, any> = {};

      if (contentType === 'assessment') {
        table = 'assessments';
        data = {
          title: generatedContent.title,
          subtitle: generatedContent.subtitle,
          description: generatedContent.description,
          duration: generatedContent.duration,
          icon: generatedContent.icon,
          questions: generatedContent.questions,
          result_types: generatedContent.result_types,
        };
      } else if (contentType === 'lesson') {
        table = 'lessons';
        data = {
          title: generatedContent.title,
          category: generatedContent.category,
          description: generatedContent.description,
          content: generatedContent.content,
        };
      } else if (contentType === 'story') {
        table = 'stories';
        data = {
          title: generatedContent.title,
          description: generatedContent.description,
          category: generatedContent.category,
          chapters: generatedContent.chapters,
        };
      }

      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, data }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      setSuccessMessage(`${generatedContent.title} saved successfully!`);
      setGeneratedContent(null);
      setTopic('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const getPlaceholder = () => {
    switch (contentType) {
      case 'assessment':
        return 'e.g., Anxiety Patterns, Self-Compassion, Work-Life Balance';
      case 'lesson':
        return 'e.g., Mindfulness Basics, Understanding Anger, Building Habits';
      case 'story':
        return 'e.g., A Quiet Forest, The Lighthouse, Mountain Cabin';
    }
  };

  const getCountLabel = () => {
    switch (contentType) {
      case 'assessment':
        return 'Number of questions';
      case 'lesson':
        return 'Number of slides';
      case 'story':
        return 'Number of chapters';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1520 0%, #0d0a12 100%)',
      color: 'white',
      padding: '24px',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 36,
            fontWeight: 300,
            marginBottom: 8,
          }}>
            ✨ Content Generator
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            Generate assessments, lessons, and stories for VERA
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
        }}>
          {/* Content Type */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 8,
              color: 'rgba(255,255,255,0.8)',
            }}>
              Content Type
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              {(['assessment', 'lesson', 'story'] as ContentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 50,
                    border: contentType === type 
                      ? '1px solid #C4956A' 
                      : '1px solid rgba(255,255,255,0.2)',
                    background: contentType === type 
                      ? 'rgba(196, 149, 106, 0.2)' 
                      : 'transparent',
                    color: contentType === type ? '#C4956A' : 'rgba(255,255,255,0.7)',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 8,
              color: 'rgba(255,255,255,0.8)',
            }}>
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={getPlaceholder()}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: 16,
                outline: 'none',
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 8,
              color: 'rgba(255,255,255,0.8)',
            }}>
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context or specific requirements..."
              rows={3}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: 16,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Count */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 8,
              color: 'rgba(255,255,255,0.8)',
            }}>
              {getCountLabel()}: {count}
            </label>
            <input
              type="range"
              min={contentType === 'story' ? 3 : 8}
              max={contentType === 'story' ? 10 : 20}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 50,
              border: 'none',
              background: isGenerating 
                ? 'rgba(196, 149, 106, 0.5)' 
                : 'linear-gradient(135deg, #C4956A 0%, #A67C52 100%)',
              color: 'white',
              fontSize: 16,
              fontWeight: 600,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {isGenerating ? (
              <>
                <span style={{ 
                  display: 'inline-block',
                  animation: 'spin 1s linear infinite',
                }}>
                  ⏳
                </span>
                Generating...
              </>
            ) : (
              <>✨ Generate {contentType}</>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: 16,
            background: 'rgba(200, 80, 80, 0.2)',
            border: '1px solid rgba(200, 80, 80, 0.4)',
            borderRadius: 12,
            marginBottom: 24,
            color: '#ff9999',
          }}>
            {error}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div style={{
            padding: 16,
            background: 'rgba(80, 200, 120, 0.2)',
            border: '1px solid rgba(80, 200, 120, 0.4)',
            borderRadius: 12,
            marginBottom: 24,
            color: '#99ffaa',
          }}>
            ✓ {successMessage}
          </div>
        )}

        {/* Preview */}
        {generatedContent && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: 24,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 500 }}>Preview</h2>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setGeneratedContent(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 50,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Discard
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 50,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  🔄 Regenerate
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 50,
                    border: 'none',
                    background: 'linear-gradient(135deg, #7BA05B 0%, #5A8040 100%)',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSaving ? 'Saving...' : '💾 Save to App'}
                </button>
              </div>
            </div>

            {/* Content Preview */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 12,
              padding: 20,
              maxHeight: 500,
              overflowY: 'auto',
            }}>
              <h3 style={{ 
                fontSize: 24, 
                marginBottom: 8,
                color: '#C4956A',
              }}>
                {generatedContent.icon} {generatedContent.title}
              </h3>
              
              {generatedContent.subtitle && (
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
                  {generatedContent.subtitle}
                </p>
              )}
              
              {generatedContent.description && (
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
                  {generatedContent.description}
                </p>
              )}

              {/* Assessment Preview */}
              {contentType === 'assessment' && generatedContent.questions && (
                <div>
                  <h4 style={{ fontSize: 14, color: '#C4956A', marginBottom: 12 }}>
                    {generatedContent.questions.length} Questions:
                  </h4>
                  {generatedContent.questions.slice(0, 3).map((q: any, i: number) => (
                    <div key={i} style={{
                      padding: 12,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 8,
                      marginBottom: 8,
                    }}>
                      <p style={{ fontWeight: 500, marginBottom: 8 }}>{q.text}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {q.options.map((opt: any, j: number) => (
                          <span key={j} style={{
                            padding: '4px 10px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: 20,
                            fontSize: 12,
                          }}>
                            {opt.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {generatedContent.questions.length > 3 && (
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                      + {generatedContent.questions.length - 3} more questions...
                    </p>
                  )}

                  <h4 style={{ fontSize: 14, color: '#C4956A', margin: '20px 0 12px' }}>
                    {generatedContent.result_types?.length} Result Types:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {generatedContent.result_types?.map((r: any, i: number) => (
                      <span key={i} style={{
                        padding: '6px 14px',
                        background: r.color + '33',
                        border: `1px solid ${r.color}66`,
                        borderRadius: 20,
                        fontSize: 13,
                      }}>
                        {r.emoji} {r.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lesson Preview */}
              {contentType === 'lesson' && generatedContent.content && (
                <div>
                  <h4 style={{ fontSize: 14, color: '#C4956A', marginBottom: 12 }}>
                    {generatedContent.content.length} Slides:
                  </h4>
                  {generatedContent.content.map((slide: any, i: number) => (
                    <div key={i} style={{
                      padding: 12,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 8,
                      marginBottom: 8,
                    }}>
                      <span style={{
                        fontSize: 11,
                        color: '#C4956A',
                        textTransform: 'uppercase',
                      }}>
                        {slide.type}
                      </span>
                      <p style={{ fontWeight: 500 }}>{slide.title}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Story Preview */}
              {contentType === 'story' && generatedContent.chapters && (
                <div>
                  <h4 style={{ fontSize: 14, color: '#C4956A', marginBottom: 12 }}>
                    {generatedContent.chapters.length} Chapters:
                  </h4>
                  {generatedContent.chapters.map((ch: any, i: number) => (
                    <div key={i} style={{
                      padding: 12,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 8,
                      marginBottom: 8,
                    }}>
                      <p style={{ fontWeight: 500, marginBottom: 4 }}>{ch.title}</p>
                      <p style={{ 
                        fontSize: 13, 
                        color: 'rgba(255,255,255,0.6)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {ch.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}