// Activity Model Contracts (AM-01) — declarative only
// Do not wire or execute.

export type OutputType =
  | 'draft'
  | 'script'
  | 'plan'
  | 'analysis'
  | 'summary'
  | 'ideas'
  | 'explanation'
  | 'checklist'
  | 'guide'
  | 'quiz';

export type ActivityModelContract = {
  outputType: OutputType;
  outputStructure: string;
  allowedTransformations: string[];
  disallowedBehaviors: string[];
  completionCriteria: string[];
};

export const ACTIVITY_MODEL_CONTRACTS: Record<string, ActivityModelContract> = {
  // Communication
  'decode-message': {
    outputType: 'analysis',
    outputStructure: 'Plain-text interpretation with clear meaning and response orientation.',
    allowedTransformations: ['Condense', 'Clarify', 'Rephrase for directness'],
    disallowedBehaviors: ['Add new facts', 'Introduce new topics', 'Change user intent'],
    completionCriteria: ['Explains meaning', 'Addresses intent', 'Maintains plain text'],
  },
  respond: {
    outputType: 'draft',
    outputStructure: 'Ready-to-send response in the requested style.',
    allowedTransformations: ['Adjust brevity', 'Improve clarity', 'Polish wording'],
    disallowedBehaviors: ['Add commitments', 'Introduce new topics', 'Change user intent'],
    completionCriteria: ['Message is complete', 'Tone aligned to input', 'No extra content'],
  },
  'worklife-analysis': {
    outputType: 'analysis',
    outputStructure: 'Structured analysis with headers: What I\'m hearing, Why you might be stuck, What\'s actually true, What might help.',
    allowedTransformations: ['Clarify', 'Condense', 'Rephrase for warmth'],
    disallowedBehaviors: ['Add clinical language', 'Lecture', 'Add new topics'],
    completionCriteria: ['All four headers present', 'Warm tone', 'Human-centered'],
  },
  'worklife-action': {
    outputType: 'plan',
    outputStructure: 'Single actionable next step with headers: Your one next step, Why this helps, If you need more.',
    allowedTransformations: ['Clarify', 'Simplify', 'Make more concrete'],
    disallowedBehaviors: ['Add bullet-point overload', 'Add new goals', 'Overwhelm'],
    completionCriteria: ['All three headers present', 'One clear action', 'Supportive tone'],
  },
  'worklife-clarify': {
    outputType: 'analysis',
    outputStructure: 'JSON with question, options array, and insight.',
    allowedTransformations: ['Clarify', 'Simplify'],
    disallowedBehaviors: ['Add advice', 'Skip the question'],
    completionCriteria: ['Valid JSON', 'One question', '2-3 options'],
  },
  'worklife-sorted': {
    outputType: 'analysis',
    outputStructure: 'Sorted task list with headers: What I see, Not yours to do right now, Quick wins, The real one, Your move.',
    allowedTransformations: ['Categorize', 'Prioritize', 'Simplify'],
    disallowedBehaviors: ['Be generic', 'Ignore specific items', 'Add new tasks'],
    completionCriteria: ['All headers present', 'Specific to user list', 'Clear next action'],
  },
  'money-analysis': {
    outputType: 'analysis',
    outputStructure: 'CFO-style analysis with headers: Okay here is what I am hearing, The real talk, Where your money is probably sneaking out, The math you are avoiding, Your one move.',
    allowedTransformations: ['Clarify', 'Personalize', 'Add humor'],
    disallowedBehaviors: ['Be generic', 'Lecture', 'Be cruel'],
    completionCriteria: ['All headers present', 'Sharp but warm tone', 'Specific to user situation'],
  },
  'money-action': {
    outputType: 'plan',
    outputStructure: '7-day money reset plan with headers: Your 7-Day Money Reset, Day 1-2 The Audit, Day 3-4 The Cuts, Day 5-6 The Setup, Day 7 The Rule, The number to know.',
    allowedTransformations: ['Simplify', 'Make concrete', 'Personalize'],
    disallowedBehaviors: ['Overwhelm', 'Be generic', 'Add complex financial advice'],
    completionCriteria: ['All headers present', 'Actionable daily steps', 'One clear number'],
  },

  // Thinking & Learning
  'thinking-detect': {
    outputType: 'analysis',
    outputStructure: 'JSON with mode (thinking or learning), clarifyQuestion, options array, and insight.',
    allowedTransformations: ['Clarify'],
    disallowedBehaviors: ['Make assumptions', 'Skip detection', 'Add advice'],
    completionCriteria: ['Valid JSON', 'Mode detected', 'Clarifying question present', '2-4 options'],
  },
  'thinking-analysis': {
    outputType: 'analysis',
    outputStructure: 'Deep analysis based on detected mode. For THINKING: What you are actually trying to decide, The hidden assumptions, Different angles, The real question. For LEARNING: What you are actually trying to learn, Why this matters to you, The learning path, Where to start.',
    allowedTransformations: ['Clarify', 'Deepen', 'Connect ideas'],
    disallowedBehaviors: ['Be shallow', 'Add generic advice', 'Skip the real issue'],
    completionCriteria: ['All headers present', 'Specific to user input', 'Clear and insightful'],
  },
  'thinking-action': {
    outputType: 'plan',
    outputStructure: 'Actionable next step based on detected mode. For THINKING: Your next move, Why this helps, If you need to go deeper. For LEARNING: Your first step, The 30-day path, Resources to use, How to know it is working.',
    allowedTransformations: ['Simplify', 'Make concrete', 'Personalize'],
    disallowedBehaviors: ['Overwhelm', 'Be abstract', 'Skip the action'],
    completionCriteria: ['All headers present', 'One clear action', 'Tailored to mode'],
  },

  boundaries: {
    outputType: 'script',
    outputStructure: 'Clear boundary statement with supportive wording.',
    allowedTransformations: ['Clarify boundary', 'Tighten language', 'Improve structure'],
    disallowedBehaviors: ['Escalate tone', 'Add new demands', 'Add threats'],
    completionCriteria: ['Boundary is explicit', 'Tone is respectful', 'Scope matches input'],
  },

  // Work & Life
  'task-breakdown': {
    outputType: 'plan',
    outputStructure: 'Ordered steps with brief notes.',
    allowedTransformations: ['Sequence steps', 'Group tasks', 'Simplify language'],
    disallowedBehaviors: ['Add new goals', 'Change constraints', 'Introduce unrelated tasks'],
    completionCriteria: ['Steps are actionable', 'Order is clear', 'Scope matches input'],
  },
  'decision-helper': {
    outputType: 'analysis',
    outputStructure: 'Decision factors and tradeoffs in a structured view.',
    allowedTransformations: ['Organize factors', 'Surface tradeoffs', 'Clarify criteria'],
    disallowedBehaviors: ['Add new options', 'Override user priorities', 'Introduce unrelated advice'],
    completionCriteria: ['Options assessed', 'Tradeoffs stated', 'Grounded in input'],
  },
  planning: {
    outputType: 'plan',
    outputStructure: 'Structured plan with time-aware steps.',
    allowedTransformations: ['Sequence tasks', 'Prioritize items', 'Condense notes'],
    disallowedBehaviors: ['Add new goals', 'Change user constraints', 'Insert unrelated advice'],
    completionCriteria: ['Plan is clear', 'Steps are ordered', 'Constraints respected'],
  },
  career: {
    outputType: 'draft',
    outputStructure: 'Career-focused output tailored to the request.',
    allowedTransformations: ['Polish wording', 'Clarify structure', 'Emphasize relevance'],
    disallowedBehaviors: ['Add false claims', 'Change objective', 'Add unrelated advice'],
    completionCriteria: ['Output is professional', 'Aligned to input', 'Complete for task'],
  },
  'meeting-prep': {
    outputType: 'guide',
    outputStructure: 'Concise prep notes with key points and questions.',
    allowedTransformations: ['Condense', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Add new agenda topics', 'Change meeting goal', 'Introduce unrelated advice'],
    completionCriteria: ['Key points present', 'Questions listed', 'Scope matches input'],
  },
  'one-on-one': {
    outputType: 'guide',
    outputStructure: 'Agenda-style outline with topics and questions.',
    allowedTransformations: ['Organize', 'Condense', 'Clarify'],
    disallowedBehaviors: ['Add commitments', 'Change objectives', 'Introduce unrelated topics'],
    completionCriteria: ['Agenda is usable', 'Topics are relevant', 'Complete outline'],
  },
  'performance-review': {
    outputType: 'draft',
    outputStructure: 'Impact-focused bullets and summary.',
    allowedTransformations: ['Rewrite for clarity', 'Highlight impact', 'Condense'],
    disallowedBehaviors: ['Add achievements', 'Change facts', 'Overstate outcomes'],
    completionCriteria: ['Bullets are clear', 'Impact is evident', 'Matches input'],
  },
  'project-plan': {
    outputType: 'plan',
    outputStructure: 'Phases, tasks, and dependencies in sequence.',
    allowedTransformations: ['Sequence steps', 'Group tasks', 'Clarify dependencies'],
    disallowedBehaviors: ['Add new scope', 'Change constraints', 'Insert unrelated tasks'],
    completionCriteria: ['Plan is structured', 'Dependencies noted', 'Scope matches input'],
  },
  'habit-tracker': {
    outputType: 'checklist',
    outputStructure: 'Tracking setup with routines and review cadence.',
    allowedTransformations: ['Simplify', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Add unrelated habits', 'Overprescribe', 'Change user constraints'],
    completionCriteria: ['Tracking plan is clear', 'Review cadence stated', 'Fits input'],
  },
  accountability: {
    outputType: 'plan',
    outputStructure: 'Accountability structure with check-ins and supports.',
    allowedTransformations: ['Organize', 'Condense', 'Clarify'],
    disallowedBehaviors: ['Add new goals', 'Change constraints', 'Introduce unrelated advice'],
    completionCriteria: ['Plan includes check-ins', 'Support roles clear', 'Matches input'],
  },

  // Money
  'budget-check': {
    outputType: 'analysis',
    outputStructure: 'Budget guidance with categories and adjustments.',
    allowedTransformations: ['Summarize', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Add financial claims', 'Change user goals', 'Introduce unrelated advice'],
    completionCriteria: ['Categories addressed', 'Suggestions are clear', 'Scope matches input'],
  },
  'savings-goal': {
    outputType: 'plan',
    outputStructure: 'Savings plan with targets and steps.',
    allowedTransformations: ['Organize', 'Condense', 'Clarify'],
    disallowedBehaviors: ['Add new goals', 'Change constraints', 'Introduce unrelated advice'],
    completionCriteria: ['Targets present', 'Steps are clear', 'Aligned to input'],
  },
  'money-conversations': {
    outputType: 'script',
    outputStructure: 'Conversation-ready language and talking points.',
    allowedTransformations: ['Tighten wording', 'Clarify ask', 'Improve structure'],
    disallowedBehaviors: ['Add new claims', 'Escalate tone', 'Change intent'],
    completionCriteria: ['Script is usable', 'Tone is appropriate', 'Matches scenario'],
  },
  'investment-basics': {
    outputType: 'explanation',
    outputStructure: 'Plain-language explanation with pros/cons and pitfalls.',
    allowedTransformations: ['Simplify', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Give personal advice', 'Add new topics', 'Overstate outcomes'],
    completionCriteria: ['Concept explained', 'Pros/cons included', 'Educational framing'],
  },
  'expense-review': {
    outputType: 'analysis',
    outputStructure: 'Review notes with potential savings areas.',
    allowedTransformations: ['Organize', 'Condense', 'Clarify'],
    disallowedBehaviors: ['Add new expenses', 'Change user constraints', 'Introduce unrelated advice'],
    completionCriteria: ['Savings areas identified', 'Rationale is clear', 'Matches input'],
  },

  // Thinking & Learning
  brainstorm: {
    outputType: 'ideas',
    outputStructure: 'List of distinct ideas with short rationale.',
    allowedTransformations: ['Expand list', 'Group ideas', 'Clarify wording'],
    disallowedBehaviors: ['Add unrelated topics', 'Force a single answer', 'Overconstrain scope'],
    completionCriteria: ['Multiple ideas', 'Variety present', 'Aligned to prompt'],
  },
  summarize: {
    outputType: 'summary',
    outputStructure: 'Concise summary with key points.',
    allowedTransformations: ['Condense', 'Clarify', 'Rephrase'],
    disallowedBehaviors: ['Add new facts', 'Omit core points', 'Introduce opinions'],
    completionCriteria: ['Main point present', 'Key details covered', 'Concise output'],
  },
  'pros-cons': {
    outputType: 'analysis',
    outputStructure: 'Pros and cons per option with summary.',
    allowedTransformations: ['Organize', 'Balance points', 'Clarify tradeoffs'],
    disallowedBehaviors: ['Add new options', 'Bias evaluation', 'Add unrelated advice'],
    completionCriteria: ['Pros and cons listed', 'Tradeoffs clear', 'Based on input'],
  },
  'devil-advocate': {
    outputType: 'analysis',
    outputStructure: 'Counterarguments and risks tied to the idea.',
    allowedTransformations: ['Surface risks', 'Clarify assumptions', 'Condense'],
    disallowedBehaviors: ['Introduce new topics', 'Moralize', 'Escalate tone'],
    completionCriteria: ['Risks articulated', 'Assumptions challenged', 'Scoped to idea'],
  },
  reframe: {
    outputType: 'analysis',
    outputStructure: 'Alternative perspectives on the same situation.',
    allowedTransformations: ['Shift framing', 'Clarify perspective', 'Condense'],
    disallowedBehaviors: ['Invalidate experience', 'Add new topics', 'Change intent'],
    completionCriteria: ['Multiple perspectives', 'Constructive framing', 'Scoped to input'],
  },
  'explain-like': {
    outputType: 'explanation',
    outputStructure: 'Level-appropriate explanation with examples.',
    allowedTransformations: ['Simplify', 'Add analogies', 'Clarify structure'],
    disallowedBehaviors: ['Add inaccuracies', 'Change topic', 'Overcomplicate'],
    completionCriteria: ['Clarity achieved', 'Level matched', 'Concept understood'],
  },
  'language-learning': {
    outputType: 'guide',
    outputStructure: 'Interactive learning flow with prompts.',
    allowedTransformations: ['Simplify', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Change mode', 'Add unrelated topics', 'Overload details'],
    completionCriteria: ['Learning flow present', 'Prompts are clear', 'Scoped to input'],
  },
  'study-plan': {
    outputType: 'plan',
    outputStructure: 'Learning roadmap with stages and resources.',
    allowedTransformations: ['Sequence steps', 'Condense', 'Clarify'],
    disallowedBehaviors: ['Add unrelated topics', 'Change constraints', 'Overpromise outcomes'],
    completionCriteria: ['Stages defined', 'Resources suggested', 'Timeline coherent'],
  },
  'skill-roadmap': {
    outputType: 'plan',
    outputStructure: 'Skill progression stages with focus areas.',
    allowedTransformations: ['Sequence stages', 'Clarify focus', 'Condense'],
    disallowedBehaviors: ['Add unrelated goals', 'Change constraints', 'Overpromise outcomes'],
    completionCriteria: ['Stages defined', 'Focus areas clear', 'Aligned to input'],
  },
  'book-summary': {
    outputType: 'summary',
    outputStructure: 'Thesis, key ideas, and takeaways.',
    allowedTransformations: ['Condense', 'Clarify', 'Organize'],
    disallowedBehaviors: ['Add new claims', 'Misrepresent content', 'Introduce opinions'],
    completionCriteria: ['Thesis stated', 'Key ideas listed', 'Takeaways included'],
  },
  'learning-hack': {
    outputType: 'guide',
    outputStructure: 'Techniques with rationale and usage tips.',
    allowedTransformations: ['Condense', 'Clarify', 'Organize'],
    disallowedBehaviors: ['Add unrelated advice', 'Overprescribe', 'Change scope'],
    completionCriteria: ['Techniques listed', 'Rationale provided', 'Fits input'],
  },
  'knowledge-test': {
    outputType: 'quiz',
    outputStructure: 'Mixed-format questions with answers.',
    allowedTransformations: ['Vary difficulty', 'Clarify wording', 'Organize sections'],
    disallowedBehaviors: ['Add unrelated topics', 'Hide answers', 'Change topic'],
    completionCriteria: ['Question set complete', 'Answers included', 'Aligned to topic'],
  },

  // Relationships & Wellness
  'perspective-shift': {
    outputType: 'analysis',
    outputStructure: 'Alternative views with constructive framing.',
    allowedTransformations: ['Reframe', 'Clarify', 'Condense'],
    disallowedBehaviors: ['Invalidate experience', 'Moralize', 'Change intent'],
    completionCriteria: ['Multiple perspectives', 'Constructive tone', 'Scoped to input'],
  },
  'vent-session': {
    outputType: 'guide',
    outputStructure: 'Supportive reflection aligned to user text.',
    allowedTransformations: ['Reflect', 'Condense', 'Clarify'],
    disallowedBehaviors: ['Diagnose', 'Prescribe', 'Escalate tone'],
    completionCriteria: ['User is reflected', 'Supportive tone', 'No extra advice'],
  },
  'self-check-in': {
    outputType: 'guide',
    outputStructure: 'Gentle prompts and reflections.',
    allowedTransformations: ['Simplify', 'Clarify', 'Organize'],
    disallowedBehaviors: ['Diagnose', 'Prescribe', 'Change topic'],
    completionCriteria: ['Prompts present', 'Supportive tone', 'Scoped to input'],
  },
  'relationship-help': {
    outputType: 'guide',
    outputStructure: 'Supportive guidance with clear steps.',
    allowedTransformations: ['Clarify', 'Condense', 'Organize'],
    disallowedBehaviors: ['Moralize', 'Add new conflicts', 'Escalate tone'],
    completionCriteria: ['Guidance is clear', 'Supportive tone', 'Matches input'],
  },
  'conflict-resolution': {
    outputType: 'guide',
    outputStructure: 'Conversation structure and compromise options.',
    allowedTransformations: ['Clarify', 'Condense', 'Organize'],
    disallowedBehaviors: ['Escalate tone', 'Add accusations', 'Change intent'],
    completionCriteria: ['Steps are clear', 'Compromises offered', 'Scoped to input'],
  },
  'relationship-boundary': {
    outputType: 'script',
    outputStructure: 'Boundary language with supportive framing.',
    allowedTransformations: ['Tighten wording', 'Clarify boundary', 'Organize'],
    disallowedBehaviors: ['Escalate tone', 'Add threats', 'Change intent'],
    completionCriteria: ['Boundary is explicit', 'Tone is steady', 'Scoped to input'],
  },
  'meal-plan': {
    outputType: 'plan',
    outputStructure: 'Meal plan with meals and prep notes.',
    allowedTransformations: ['Simplify', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Prescribe medical advice', 'Add restrictions', 'Change goals'],
    completionCriteria: ['Meals listed', 'Prep guidance included', 'Aligned to input'],
  },
  'habit-builder': {
    outputType: 'plan',
    outputStructure: 'Habit plan with cues, tracking, and recovery.',
    allowedTransformations: ['Simplify', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Overprescribe', 'Add unrelated habits', 'Change goals'],
    completionCriteria: ['Steps defined', 'Tracking included', 'Fits input'],
  },
  workout: {
    outputType: 'plan',
    outputStructure: 'Workout outline with exercises and pacing.',
    allowedTransformations: ['Simplify', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Prescribe beyond input', 'Add medical advice', 'Change goals'],
    completionCriteria: ['Exercises listed', 'Intensity guidance', 'Aligned to input'],
  },
  'sleep-routine': {
    outputType: 'plan',
    outputStructure: 'Routine with wind-down and morning steps.',
    allowedTransformations: ['Simplify', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Prescribe medical advice', 'Add restrictions', 'Change goals'],
    completionCriteria: ['Routine steps present', 'Practical tips included', 'Aligned to input'],
  },
  'stress-relief': {
    outputType: 'guide',
    outputStructure: 'Calming options with short explanations.',
    allowedTransformations: ['Simplify', 'Organize', 'Clarify'],
    disallowedBehaviors: ['Diagnose', 'Prescribe', 'Escalate tone'],
    completionCriteria: ['Options listed', 'Supportive tone', 'Scoped to input'],
  },
  'motivation-boost': {
    outputType: 'guide',
    outputStructure: 'Reframe plus small next steps.',
    allowedTransformations: ['Simplify', 'Clarify', 'Condense'],
    disallowedBehaviors: ['Moralize', 'Overpromise', 'Change goals'],
    completionCriteria: ['Reframe included', 'Next step stated', 'Matches input'],
  },

  // Create
  'write-email': {
    outputType: 'draft',
    outputStructure: 'Email draft ready to send.',
    allowedTransformations: ['Polish wording', 'Clarify structure', 'Tighten length'],
    disallowedBehaviors: ['Add commitments', 'Change intent', 'Introduce new topics'],
    completionCriteria: ['Draft is complete', 'Tone aligned', 'No extra content'],
  },
  'social-post': {
    outputType: 'draft',
    outputStructure: 'Social post draft with clear structure.',
    allowedTransformations: ['Polish wording', 'Adjust length', 'Clarify structure'],
    disallowedBehaviors: ['Add new claims', 'Change intent', 'Introduce unrelated topics'],
    completionCriteria: ['Post is complete', 'Matches platform intent', 'Scoped to input'],
  },
  headline: {
    outputType: 'ideas',
    outputStructure: 'Headline options with short rationale.',
    allowedTransformations: ['Vary phrasing', 'Adjust length', 'Clarify wording'],
    disallowedBehaviors: ['Change topic', 'Add unrelated claims', 'Overstate outcomes'],
    completionCriteria: ['Multiple options', 'Topic aligned', 'Readable headlines'],
  },
  naming: {
    outputType: 'ideas',
    outputStructure: 'Name options with brief reasoning.',
    allowedTransformations: ['Vary style', 'Adjust length', 'Clarify spelling'],
    disallowedBehaviors: ['Add unrelated names', 'Change constraints', 'Claim availability'],
    completionCriteria: ['Multiple options', 'Constraints respected', 'Rationale provided'],
  },
  'creative-prompt': {
    outputType: 'ideas',
    outputStructure: 'Creative prompts with short guidance.',
    allowedTransformations: ['Vary prompts', 'Clarify wording', 'Organize list'],
    disallowedBehaviors: ['Change topic', 'Overconstrain', 'Introduce unrelated ideas'],
    completionCriteria: ['Prompt set complete', 'Variety present', 'Aligned to input'],
  },
  'metaphor-maker': {
    outputType: 'ideas',
    outputStructure: 'Metaphor options with usage notes.',
    allowedTransformations: ['Vary imagery', 'Clarify phrasing', 'Organize list'],
    disallowedBehaviors: ['Change concept', 'Overstate claims', 'Introduce unrelated topics'],
    completionCriteria: ['Multiple metaphors', 'Concept aligned', 'Usable phrasing'],
  },
  'bio-about': {
    outputType: 'draft',
    outputStructure: 'Bio variants at multiple lengths.',
    allowedTransformations: ['Polish wording', 'Clarify structure', 'Adjust length'],
    disallowedBehaviors: ['Add false claims', 'Change intent', 'Introduce unrelated topics'],
    completionCriteria: ['Lengths provided', 'Professional tone', 'Aligned to input'],
  },
  'creative-writing': {
    outputType: 'ideas',
    outputStructure: 'Story ideas with key elements.',
    allowedTransformations: ['Vary concepts', 'Clarify wording', 'Organize list'],
    disallowedBehaviors: ['Change genre', 'Add unrelated topics', 'Overconstrain'],
    completionCriteria: ['Multiple ideas', 'Genre aligned', 'Usable seeds'],
  },

  // Relationships & Wellness Orchestrator
  'wellness-clarify': {
    outputType: 'analysis',
    outputStructure: 'JSON with mode (relationship or self-care), clarifyQuestion, options array, and insight.',
    allowedTransformations: ['Clarify'],
    disallowedBehaviors: ['Skip detection', 'Add advice'],
    completionCriteria: ['Valid JSON', 'Mode detected', 'Clarifying question present', '2-3 options'],
  },
  'wellness-analysis': {
    outputType: 'analysis',
    outputStructure: 'Deep analysis based on mode. For RELATIONSHIP: pattern, dynamics, boundaries. For SELF-CARE: motivation, obstacles, self-compassion.',
    allowedTransformations: ['Clarify', 'Deepen', 'Personalize'],
    disallowedBehaviors: ['Be clinical', 'Be judgmental', 'Skip the core issue'],
    completionCriteria: ['All headers present', 'Specific to user input', 'Warm and insightful'],
  },
  'wellness-action': {
    outputType: 'plan',
    outputStructure: 'One clear, doable next step. Warm, supportive tone.',
    allowedTransformations: ['Simplify', 'Make concrete', 'Personalize'],
    disallowedBehaviors: ['Overwhelm', 'Be abstract', 'Skip the action'],
    completionCriteria: ['One clear step', 'Specific to situation', 'Supportive tone'],
  },
  'wellness-deeper': {
    outputType: 'analysis',
    outputStructure: 'Deep pattern recognition and real blocks. For RELATIONSHIP: pattern, avoided question, what changes it. For SELF-CARE: real block, smallest step, reassurance.',
    allowedTransformations: ['Clarify', 'Deepen', 'Personalize'],
    disallowedBehaviors: ['Be clinical', 'Lecture', 'Skip the real thing'],
    completionCriteria: ['Pattern identified', 'Real block surfaced', 'Warm and honest'],
  },
};
