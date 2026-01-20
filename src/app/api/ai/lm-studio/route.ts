import { NextRequest, NextResponse } from 'next/server';

/**
 * LM Studio API Bridge
 * Forwards chat completion requests to local LM Studio endpoint
 * 
 * Config:
 * - Endpoint: http://192.168.1.200:1234/v1/chat/completions
 * - Model: qwen/qwen3-30b-a3b-2507
 * 
 * This enables VERA Neural (local Qwen) as a provider in Vera.
 */

const LM_STUDIO_ENDPOINT = process.env.LM_STUDIO_ENDPOINT || 'http://192.168.1.200:1234/v1/chat/completions';
const DEFAULT_MODEL = 'qwen/qwen3-30b-a3b-2507';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type LMStudioRequest = {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
};

type LMStudioResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LMStudioRequest;
    
    // Ensure model is set to Qwen
    const requestPayload: LMStudioRequest = {
      ...body,
      model: body.model || DEFAULT_MODEL,
      temperature: body.temperature ?? 0.7,
      max_tokens: body.max_tokens ?? 2000,
      top_p: body.top_p ?? 0.95,
      stream: false, // Disable streaming for simpler handling
    };

    const response = await fetch(LM_STUDIO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LM Studio API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return NextResponse.json(
        { 
          error: `LM Studio API error: ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as LMStudioResponse;

    // Transform to OpenAI-compatible format for consistency
    return NextResponse.json({
      id: data.id,
      object: 'chat.completion',
      created: data.created,
      model: 'vera-neural',
      provider: 'vera-neural',
      choices: data.choices.map(choice => ({
        index: choice.index,
        message: {
          role: choice.message.role,
          content: choice.message.content,
        },
        finish_reason: choice.finish_reason,
      })),
      usage: data.usage,
    });
  } catch (error) {
    console.error('LM Studio Bridge Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to communicate with LM Studio',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
