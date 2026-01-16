import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { type, topic, description, count } = await req.json();

    if (!type || !topic) {
      return NextResponse.json({ error: 'Missing type or topic' }, { status: 400 });
    }

    let prompt = '';

    if (type === 'assessment') {
      prompt = `Create a mental wellness assessment about "${topic}".
      
Description: ${description || 'A self-discovery assessment'}
Number of questions: ${count || 12}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "title": "Assessment Title",
  "subtitle": "Short subtitle",
  "description": "2-3 sentence description",
  "duration": "X min",
  "icon": "icon-identifier",
  "questions": [
    {
      "id": "unique_id",
      "text": "Question text",
      "subtext": "Optional clarifying text or null",
      "options": [
        { "value": 1, "label": "Option label", "description": "Short description" },
        { "value": 2, "label": "Option label", "description": "Short description" },
        { "value": 3, "label": "Option label", "description": "Short description" },
        { "value": 4, "label": "Option label", "description": "Short description" }
      ],
      "category": "category_name"
    }
  ],
  "result_types": [
    {
      "id": "type_id",
      "name": "Result Type Name",
      "description": "2-3 sentence description of this result type",
      "signs": ["sign 1", "sign 2", "sign 3", "sign 4"],
      "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
      "shadow": "The challenging aspect of this type",
      "tools": ["tool 1", "tool 2", "tool 3", "tool 4"],
      "color": "#hexcolor"
    }
  ]
}

IMPORTANT: For the "icon" field, do NOT use emojis. Instead, use one of these elegant SVG icon identifiers that match the assessment theme:
- "inner-landscape" (for emotional/inner world topics)
- "rest-restoration" (for sleep/rest/recharge topics)
- "stress-response" (for stress/anxiety/pressure topics)
- "connection-style" (for relationships/boundaries topics)
- "life-rhythm" (for energy/cycles/routine topics)
- "heart-wave" (for emotions/feelings topics)
- "mind-body" (for physical-mental connection topics)
- "growth-tree" (for personal growth/resilience topics)
- "calm-lotus" (for meditation/mindfulness topics)
- "compass" (for direction/purpose/values topics)

For result_types, do NOT include an "emoji" field. The app will handle icons separately.

Make questions thoughtful, psychologically-informed, and varied. Include 4-6 result types that cover the spectrum of responses. Use warm, compassionate language.`;
    } 
    
    else if (type === 'lesson') {
      prompt = `Create an educational wellness lesson about "${topic}".

Description: ${description || 'An educational lesson for personal growth'}
Number of slides: ${count || 12}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "title": "Lesson Title",
  "category": "category-slug",
  "description": "Brief description",
  "icon": "icon-identifier",
  "content": [
    {
      "type": "title",
      "title": "Main Title",
      "subtitle": "Lesson X: Subtitle"
    },
    {
      "type": "text",
      "title": "Section Title",
      "content": "Paragraph of educational content...",
      "highlight": "Optional key quote or null"
    },
    {
      "type": "visual",
      "visual": "concept_name",
      "title": "Visual Section Title",
      "content": "Explanation of the visual concept"
    },
    {
      "type": "insight",
      "title": "Insight Title",
      "content": "A key insight or aha moment..."
    },
    {
      "type": "practice",
      "title": "Practice Exercise",
      "content": "Instructions for a practical exercise..."
    },
    {
      "type": "summary",
      "title": "Key Takeaways",
      "points": ["Takeaway 1", "Takeaway 2", "Takeaway 3", "Takeaway 4"]
    }
  ]
}

IMPORTANT: For the "icon" field, do NOT use emojis. Instead, use one of these elegant SVG icon identifiers that match the lesson theme:
- "nervous-system" (for body/nervous system topics)
- "emotions" (for understanding emotions topics)
- "rest-science" (for rest/sleep science topics)
- "resilience" (for building resilience topics)
- "heart-wave" (for emotional regulation topics)
- "mind-body" (for mind-body connection topics)
- "growth-tree" (for personal growth topics)
- "calm-lotus" (for meditation/calm topics)
- "compass" (for values/direction topics)
- "light-bulb" (for insights/learning topics)

For the "category" field, use one of: "nervous-system", "emotions", "rest-science", "resilience"

Create a flowing educational journey. Start with a title slide, include several text sections, at least one insight, one practice, and end with a summary. Use warm, accessible language. Do NOT use any emojis anywhere in the content.`;
    } 
    
    else if (type === 'story') {
      prompt = `Create a calming sleep/meditation story about "${topic}".

Description: ${description || 'A gentle story for relaxation and rest'}
Number of chapters: ${count || 5}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "title": "Story Title",
  "description": "2-3 sentence evocative description",
  "category": "rest-sleep|guided-journeys|meditative-tales|rise-ready",
  "icon": "icon-identifier",
  "chapters": [
    {
      "id": "ch1",
      "title": "Chapter 1: Chapter Title",
      "duration": "X:XX",
      "text": "Full chapter text. This should be 3-5 paragraphs of calming, descriptive prose. Use sensory details - what the listener sees, hears, feels, smells. Write in second person (you). Pace it slowly with short sentences. Include natural pauses..."
    }
  ]
}

IMPORTANT: For the "icon" field, do NOT use emojis. Instead, use one of these elegant SVG icon identifiers that match the story theme:
- "rest-sleep" (for bedtime/sleep stories)
- "guided-journeys" (for imaginative travel stories)
- "meditative-tales" (for slow, meditative stories)
- "rise-ready" (for morning/confidence stories)
- "moon-stars" (for nighttime stories)
- "forest" (for nature/woods stories)
- "ocean" (for water/sea stories)
- "mountain" (for mountain/peak stories)
- "garden" (for garden/growth stories)
- "fireplace" (for cozy/warm stories)

Write in a slow, hypnotic style perfect for sleep or deep relaxation. Use sensory language, gentle imagery, and a gradually descending energy. Each chapter should be 200-400 words. Do NOT use any emojis anywhere in the content.`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse the JSON response
    let generatedContent;
    try {
      // Remove any markdown code blocks if present
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedContent = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      return NextResponse.json({ error: 'Failed to parse generated content', raw: responseText }, { status: 500 });
    }

    return NextResponse.json({ success: true, content: generatedContent });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}