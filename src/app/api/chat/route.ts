import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type IncomingMessage = { role: 'user' | 'assistant'; content: string };

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages?: IncomingMessage[] };

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { content: 'Server is missing ANTHROPIC_API_KEY.' },
        { status: 500 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { content: 'Please send at least one message.' },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const result = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 600,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content = result.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return NextResponse.json({ content: content || "I'm here. What would you like to explore?" });
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json(
      { content: "I'm having trouble connecting right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
