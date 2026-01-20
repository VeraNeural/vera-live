// Activity prompt fragments (SP-02) — declarative only
// Do not wire or execute.

export const ACTIVITY_PROMPT_FRAGMENTS: Record<string, string> = {
  // Communication
  'decode-message': 'Produce a single, coherent interpretive brief. State the definitive read first, then compress rationale into authoritative prose. Surface power dynamics and leverage explicitly. Explain why the message is framed this way. Name consequences explicitly. Provide one grounded next move in a single sentence. Do not hedge, do not speculate beyond the text. Do not use bullet lists, disclaimers, or questions. Tone intensity levels: measured / surgical / brutal. Default to surgical; only switch to measured or brutal if the user explicitly asks. Tone changes delivery sharpness only—never interpretation and never advice. Include confidence scoring exactly in this format: "Decode Confidence: 0.00–1.00" and "Rationale: ..." based only on linguistic compression, power asymmetry indicators, indirect request structures, responsibility shifting, and timing/context markers (if provided). If confidence < 0.60, explicitly name what is missing in a "Missing: ..." line; do not fill gaps. Badge rule: Only include the badge line "VERA Signature Decode™" if the output includes a single dominant interpretation, explicit power/leverage, named consequences, a grounded next move, and confidence scoring. Otherwise omit the badge line.',
  respond: 'Provide a ready-to-send response. Match the requested output shape. Do not add commitments.',
  boundaries: 'Provide a clear boundary statement. Keep it direct and respectful. Do not add new demands.',
  'worklife-analysis': 'Provide warm, human analysis. Use custom systemPrompt directly.',
  'worklife-action': 'Provide one clear next step. Use custom systemPrompt directly.',
  'worklife-clarify': 'Provide JSON with clarifying question and options. Use custom systemPrompt directly.',
  'worklife-sorted': 'Sort user task list into categories. Use custom systemPrompt directly.',
  'money-analysis': 'Provide sharp CFO-style money analysis. Use custom systemPrompt directly.',
  'money-action': 'Provide 7-day money reset action plan. Use custom systemPrompt directly.',
  'thinking-detect': 'Detect whether user needs THINKING or LEARNING mode and provide clarifying question. Use custom systemPrompt directly.',
  'thinking-analysis': 'Provide deep analysis based on detected mode (thinking or learning). Use custom systemPrompt directly.',
  'thinking-action': 'Provide actionable next step based on detected mode (thinking or learning). Use custom systemPrompt directly.',

  // Work & Life
  'task-breakdown': 'Provide ordered steps. Keep steps actionable. Do not add new goals.',
  'decision-helper': 'Provide structured decision factors and tradeoffs. Stay within user criteria. Do not add new options.',
  planning: 'Provide a structured plan with ordered steps. Respect constraints. Do not add new goals.',
  career: 'Provide a professional output aligned to the request. Do not add claims.',
  'meeting-prep': 'Provide prep notes with key points and questions. Keep it concise. Do not add new agenda topics.',
  'one-on-one': 'Provide a 1:1 agenda outline. Include topics and questions. Do not add commitments.',
  'performance-review': 'Provide impact-focused bullets and summary. Use only user-provided facts. Do not add achievements.',
  'project-plan': 'Provide phases, tasks, and dependencies. Keep sequence clear. Do not add scope.',
  'habit-tracker': 'Provide a tracking setup checklist. Include review cadence. Do not add unrelated habits.',
  accountability: 'Provide an accountability plan with check-ins. Keep roles clear. Do not add goals.',

  // Money
  'budget-check': 'Provide budget guidance with categories and adjustments. Keep it organized. Do not add new goals.',
  'savings-goal': 'Provide a savings plan with targets and steps. Keep it clear. Do not change constraints.',
  'money-conversations': 'Provide conversation-ready language and talking points. Do not change intent.',
  'investment-basics': 'Provide a plain-language explanation with pros and cons. Keep it educational. Do not give personal advice.',
  'expense-review': 'Provide savings review notes with rationale. Keep it scoped to input. Do not add expenses.',

  // Thinking & Learning
  brainstorm: 'Provide multiple distinct ideas. Include brief rationale. Do not force a single answer.',
  summarize: 'Provide a concise summary with key points. Do not add facts.',
  'pros-cons': 'Provide pros and cons per option with tradeoffs. Keep it balanced. Do not add options.',
  'devil-advocate': 'Provide counterarguments and risks tied to the idea. Do not add topics.',
  reframe: 'Provide alternative perspectives on the same situation. Keep it constructive. Do not change intent.',
  'explain-like': 'Provide a level-appropriate explanation. Use clear structure. Do not change topic.',
  'language-learning': 'Provide a clear learning flow with prompts. Keep it scoped to input.',
  'study-plan': 'Provide a learning roadmap with stages and resources. Keep it ordered. Do not add goals.',
  'skill-roadmap': 'Provide progression stages with focus areas. Keep it ordered. Do not add goals.',
  'book-summary': 'Provide thesis, key ideas, and takeaways. Keep it concise. Do not add claims.',
  'learning-hack': 'Provide techniques with rationale and usage tips. Keep it concise.',
  'knowledge-test': 'Provide mixed-format questions with answers. Keep topic alignment.',

  // Relationships & Wellness
  'perspective-shift': 'Provide alternative views with constructive framing. Keep it scoped to input.',
  'vent-session': 'Provide supportive reflection aligned to user text. Do not add advice.',
  'self-check-in': 'Provide gentle prompts and reflections. Keep it minimal and clear.',
  'relationship-help': 'Provide supportive guidance with clear steps. Keep it scoped to input.',
  'conflict-resolution': 'Provide a conversation structure and compromise options. Keep it scoped to input.',
  'relationship-boundary': 'Provide boundary language with supportive framing. Do not add threats.',
  'meal-plan': 'Provide a meal plan with meals and prep notes. Keep it practical.',
  'habit-builder': 'Provide a habit plan with cues and tracking. Keep it simple.',
  workout: 'Provide a workout outline with exercises and pacing. Keep it practical.',
  'sleep-routine': 'Provide a routine with wind-down and morning steps. Keep it practical.',
  'stress-relief': 'Provide calming options with short explanations. Keep it practical.',
  'motivation-boost': 'Provide a reframe and a small next step. Keep it concise.',

  // Create
  'write-email': 'Provide a complete email draft. Keep it clear and scoped to input.',
  'social-post': 'Provide a complete social post draft. Keep it scoped to input.',
  headline: 'Provide multiple headline options with short rationale. Keep it on topic.',
  naming: 'Provide multiple name options with brief reasoning. Respect constraints.',
  'creative-prompt': 'Provide multiple creative prompts with short guidance. Keep it on topic.',
  'metaphor-maker': 'Provide multiple metaphors with usage notes. Keep it on concept.',
  'bio-about': 'Provide bio variants at multiple lengths. Use only provided facts.',
  'creative-writing': 'Provide multiple story ideas with key elements. Keep it on genre.',

  // Relationships & Wellness Orchestrator
  'wellness-clarify': 'Detect whether user needs RELATIONSHIP or SELF-CARE mode and provide clarifying question. Use custom systemPrompt directly.',
  'wellness-analysis': 'Provide warm analysis based on detected mode (relationship or self-care). Use custom systemPrompt directly.',
  'wellness-action': 'Provide one clear, doable next step. Use custom systemPrompt directly.',
  'wellness-deeper': 'Provide deep pattern recognition and real blocks. Use custom systemPrompt directly.',
};
