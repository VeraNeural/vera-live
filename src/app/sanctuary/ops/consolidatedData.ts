// ============================================================================
// CONSOLIDATED OPS ROOM DATA - SINGLE SOURCE OF TRUTH
// Consolidated from 11 categories (~69 activities) into 6 categories
// ============================================================================

// TYPE DEFINITIONS
// ============================================================================

export type ActivityType = 'standalone' | 'dropdown' | 'custom-component';

export interface DropdownOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  placeholder: string;
  systemPrompt: string;
  fields?: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: ActivityType;
  placeholder: string;
  systemPrompt: string;
  fields?: FormField[];
  dropdownOptions?: DropdownOption[];
  componentRef?: string;
  disclaimer: string;
  allowSave: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  activities: Activity[];
}

export interface OpsRoomData {
  id: 'ops';
  name: 'Focus';
  tagline: 'Get things moving';
  description: 'AI-powered tools to help you communicate, work, manage money, think, grow, and create.';
  categories: Category[];
}

// CONSOLIDATED DATA
// ============================================================================

export const opsRoom: OpsRoomData = {
  id: 'ops',
  name: 'Focus',
  tagline: 'Get things moving',
  description: 'AI-powered tools to help you communicate, work, manage money, think, grow, and create.',
  categories: [
    // ==========================================================================
    // 1. COMMUNICATION
    // ==========================================================================
    {
      id: 'communication',
      name: 'Communication',
      description: 'Find the right words for any conversation',
      icon: 'message-circle',
      activities: [
        {
          id: 'decode-message',
          title: 'Decode Message',
          description: 'Understand the real meaning behind a message',
          icon: 'search',
          type: 'standalone',
          placeholder: 'Paste the message you want to decode...',
          systemPrompt: 'Analyze this message and explain: 1) What they\'re actually saying (the subtext), 2) Their likely emotional state, 3) What they probably want from you, 4) Suggested response approach. Be direct and insightful.',
          disclaimer: 'VERA interprets tone and intent but context may vary.',
          allowSave: true,
        },
        {
          id: 'respond',
          title: 'Respond',
          description: 'Draft the perfect response',
          icon: 'mail',
          type: 'dropdown',
          placeholder: 'What do you need to respond to?',
          systemPrompt: 'You are VERA. Help the user craft a response based on their selected style.',
          disclaimer: 'VERA drafts suggestions. Always personalize before sending.',
          allowSave: true,
          dropdownOptions: [
            {
              id: 'quick-reply',
              label: 'Quick Reply',
              description: 'Fast, friendly response',
              icon: 'zap',
              placeholder: 'Paste the email/message you need to reply to...',
              systemPrompt: 'Write a concise, appropriate reply to the message provided. Match the tone of the original. Be direct and helpful. No filler phrases or over-formality.',
            },
            {
              id: 'follow-up',
              label: 'Follow Up',
              description: 'Nudge without nagging',
              icon: 'refresh-cw',
              placeholder: 'What are you following up on? Context about the original message...',
              systemPrompt: 'Write a follow-up message that\'s friendly but effective. Not passive-aggressive. Provide 2-3 versions with different tones.',
            },
            {
              id: 'apology',
              label: 'Apology',
              description: 'Apologize without over-explaining',
              icon: 'hand-heart',
              placeholder: 'What happened? Who do you need to apologize to?',
              systemPrompt: 'Help craft a genuine apology that: 1) Acknowledges what happened, 2) Takes responsibility without excessive self-blame, 3) Doesn\'t over-explain, 4) Offers a path forward.',
            },
            {
              id: 'say-no',
              label: 'Say No Nicely',
              description: 'Decline with grace',
              icon: 'x-circle',
              placeholder: 'What do you need to say no to? Who is asking?',
              systemPrompt: 'Help me decline this request politely but firmly. Provide 3 versions: 1) Brief and direct, 2) Warm but clear, 3) With an alternative offer. No over-explaining or excessive apologizing.',
            },
            {
              id: 'explain-simply',
              label: 'Explain Simply',
              description: 'Make complex things clear',
              icon: 'lightbulb',
              placeholder: 'What do you need to explain? Who is your audience?',
              systemPrompt: 'Explain this concept in simple terms that anyone can understand. Use analogies if helpful. Provide both a one-sentence version and a paragraph version.',
            },
          ],
        },
        {
          id: 'boundaries',
          title: 'Boundaries',
          description: 'Set limits with confidence',
          icon: 'shield',
          type: 'dropdown',
          placeholder: 'What boundary do you need to set?',
          systemPrompt: 'You are VERA. Help the user establish healthy boundaries.',
          disclaimer: 'For serious relationship issues, consider professional support.',
          allowSave: true,
          dropdownOptions: [
            {
              id: 'boundary-script',
              label: 'Boundary Script',
              description: 'Words to set a limit',
              icon: 'edit',
              placeholder: 'What boundary do you need to set? With whom?',
              systemPrompt: 'Help me set this boundary clearly and kindly. Provide: 1) The key statement, 2) How to handle pushback, 3) A softer alternative if needed.',
            },
            {
              id: 'tough-conversation',
              label: 'Tough Conversation',
              description: 'Navigate difficult dialogue',
              icon: 'message-circle',
              placeholder: 'What\'s the conversation about? Your relationship? Your goal?',
              systemPrompt: 'Help me prepare for this difficult conversation. Provide: 1) Opening statement options, 2) Key points to make, 3) How to respond to likely reactions, 4) How to end constructively.',
            },
          ],
        },
      ],
    },

    // ==========================================================================
    // 2. WORK & LIFE
    // ==========================================================================
    {
      id: 'work-life',
      name: 'Work & Life',
      description: 'Navigate pressure, make decisions, get organized',
      icon: 'clipboard-list',
      activities: [
        {
          id: 'task-breakdown',
          title: 'Task Breakdown',
          description: 'Break overwhelming tasks into steps',
          icon: 'edit',
          type: 'standalone',
          placeholder: 'Describe the task or project you need to break down...',
          systemPrompt: 'Help me break this down into manageable steps. Provide: 1) Clear sequence of actions, 2) Estimated time for each, 3) What to do first, 4) Potential blockers, 5) How to know when each step is done.',
          disclaimer: 'VERA suggests steps. Adjust based on your situation.',
          allowSave: true,
        },
        {
          id: 'decision-helper',
          title: 'Decision Helper',
          description: 'Think through choices clearly',
          icon: 'help-circle',
          type: 'standalone',
          placeholder: 'What decision? Factors?',
          systemPrompt: 'Help me think through this decision. Provide: 1) Key factors, 2) Questions to ask myself, 3) What info I might be missing, 4) A framework for deciding, 5) How to test before committing.',
          disclaimer: 'VERA provides frameworks, not definitive answers.',
          allowSave: true,
        },
        {
          id: 'planning',
          title: 'Planning',
          description: 'Set goals and plan your time',
          icon: 'calendar',
          type: 'dropdown',
          placeholder: 'What do you want to plan?',
          systemPrompt: 'You are VERA. Help the user create a realistic plan.',
          disclaimer: 'Plans work best when adapted to your real constraints.',
          allowSave: true,
          dropdownOptions: [
            {
              id: 'daily-plan',
              label: 'Daily Plan',
              description: 'Structure your day',
              icon: 'sun',
              placeholder: 'What do you need to accomplish today? Any constraints?',
              systemPrompt: 'Create a realistic daily plan. Include: 1) Priority tasks, 2) Time blocks, 3) Buffer time, 4) What to defer, 5) Evening wind-down.',
            },
            {
              id: 'weekly-review',
              label: 'Weekly Plan',
              description: 'Reflect and reset',
              icon: 'bar-chart',
              placeholder: 'Paste your wins, challenges, and upcoming priorities...',
              systemPrompt: 'Guide me through a weekly review. Help me: 1) Celebrate wins (even small ones), 2) Learn from challenges, 3) Identify patterns, 4) Set priorities for next week, 5) Adjust systems if needed.',
            },
            {
              id: 'goal-setting',
              label: 'Goal Setting',
              description: 'Set goals that work',
              icon: 'target',
              placeholder: 'What do you want to achieve? By when?',
              systemPrompt: 'Help me set this goal effectively. Provide: 1) SMART goal formulation, 2) Why this goal matters (dig deeper), 3) Potential obstacles, 4) Milestones to track, 5) First 3 actions to take.',
              fields: [
                { name: 'goal', label: 'What\'s your goal?', type: 'textarea', placeholder: 'What do you want to achieve?', required: true },
                { name: 'timeline', label: 'Timeline', type: 'text', placeholder: '3 months, 1 year...' },
                { name: 'why', label: 'Why does this matter?', type: 'textarea', placeholder: 'What will achieving this give you?' },
              ],
            },
          ],
        },
        {
          id: 'career',
          title: 'Career',
          description: 'Resume, interviews, job search',
          icon: 'briefcase',
          type: 'dropdown',
          placeholder: 'What career help do you need?',
          systemPrompt: 'You are VERA. Help the user with their career goals.',
          disclaimer: 'Tailor VERA\'s suggestions to each specific opportunity.',
          allowSave: true,
          dropdownOptions: [
            {
              id: 'resume-bullets',
              label: 'Resume Bullets',
              description: 'Achievement-focused points',
              icon: 'file-text',
              placeholder: 'Role, responsibilities, and any metrics...',
              systemPrompt: 'Transform this into powerful resume bullet points. Use strong action verbs. Quantify results. Generate 4-6 bullets.',
              fields: [
                { name: 'role', label: 'Job title', type: 'text', placeholder: 'e.g., Product Manager', required: true },
                { name: 'company', label: 'Company/Industry', type: 'text', placeholder: 'e.g., Tech startup' },
                { name: 'responsibilities', label: 'What did you do?', type: 'textarea', placeholder: 'Describe responsibilities and achievements...', required: true },
              ],
            },
            {
              id: 'cover-letter',
              label: 'Cover Letter',
              description: 'Stand out from the pile',
              icon: 'pen-tool',
              placeholder: 'Role, company, and why you\'re excited...',
              systemPrompt: 'Write a compelling cover letter that: 1) Opens with a hook, 2) Connects my experience to their needs, 3) Shows genuine interest, 4) Ends with confidence. Under 300 words.',
              fields: [
                { name: 'role', label: 'What role?', type: 'text', placeholder: 'e.g., Product Designer at Figma', required: true },
                { name: 'background', label: 'Relevant experience', type: 'textarea', placeholder: 'Your key qualifications...', required: true },
                { name: 'why', label: 'Why this company?', type: 'textarea', placeholder: 'What excites you about them?' },
              ],
            },
            {
              id: 'interview-prep',
              label: 'Interview Prep',
              description: 'Nail your next interview',
              icon: 'mic',
              placeholder: 'What\'s the role? Company? Concerns?',
              systemPrompt: 'Help me prepare for this job interview. Provide: 1) Likely questions and how to answer them for THIS specific role, 2) Questions I should ask, 3) Key points to emphasize, 4) Common pitfalls to avoid.',
              fields: [
                { name: 'role', label: 'What role?', type: 'text', placeholder: 'e.g., Product Manager at Stripe', required: true },
                { name: 'background', label: 'Your relevant experience', type: 'textarea', placeholder: 'Brief summary of your background...' },
                { name: 'concerns', label: 'Any specific concerns?', type: 'textarea', placeholder: 'Gaps, weaknesses, tricky questions...' },
              ],
            },
          ],
        },
      ],
    },

    // ==========================================================================
    // 3. MONEY
    // ==========================================================================
    {
      id: 'money',
      name: 'Money',
      description: 'Budget, save, and have money conversations',
      icon: 'dollar-sign',
      activities: [
        {
          id: 'budget-check',
          title: 'Budget Check',
          description: 'Review and plan your spending',
          icon: 'bar-chart',
          type: 'standalone',
          placeholder: 'Income? Major expenses? Goals?',
          systemPrompt: 'Help me create or improve my budget. Include: 1) Suggested category percentages, 2) Where to cut if needed, 3) How to track spending, 4) Tips for sticking to it.',
          disclaimer: 'VERA is not a financial advisor. Consult a professional for major decisions.',
          allowSave: true,
          fields: [
            { name: 'income', label: 'Monthly income (after tax)', type: 'text', placeholder: 'e.g., $5,000' },
            { name: 'expenses', label: 'Major fixed expenses', type: 'textarea', placeholder: 'Rent, car payment, subscriptions...' },
            { name: 'goal', label: 'Financial goal', type: 'text', placeholder: 'Save for house, pay off debt, emergency fund...' },
          ],
        },
        {
          id: 'savings-goal',
          title: 'Savings Goal',
          description: 'Plan and track savings',
          icon: 'piggy-bank',
          type: 'standalone',
          placeholder: 'What are you saving for? Timeline? Current savings?',
          systemPrompt: 'Create a savings plan for this goal. Include: 1) Monthly target to hit goal, 2) Where to keep the money, 3) How to automate, 4) What to do if you fall behind, 5) How to stay motivated.',
          disclaimer: 'VERA is not a financial advisor. Consult a professional for major decisions.',
          allowSave: true,
        },
        {
          id: 'money-conversations',
          title: 'Money Conversations',
          description: 'Navigate tricky financial talks',
          icon: 'message-circle',
          type: 'dropdown',
          placeholder: 'What money conversation do you need to have?',
          systemPrompt: 'You are VERA. Help the user prepare for financial conversations.',
          disclaimer: 'Every situation is unique. Use VERA\'s scripts as starting points.',
          allowSave: true,
          dropdownOptions: [
            {
              id: 'salary-negotiation',
              label: 'Negotiate Salary',
              description: 'Ask for what you\'re worth',
              icon: 'dollar-sign',
              placeholder: 'Current salary? Target? Context?',
              systemPrompt: 'Help me negotiate this salary/raise. Provide: 1) Key talking points, 2) Specific scripts for different scenarios, 3) How to handle pushback, 4) What to do if they say no.',
              fields: [
                { name: 'current', label: 'Current situation', type: 'text', placeholder: 'Current salary or offer amount' },
                { name: 'target', label: 'Your target', type: 'text', placeholder: 'What you want to get' },
                { name: 'context', label: 'Context', type: 'textarea', placeholder: 'Is this a new job, raise, promotion?' },
              ],
            },
            {
              id: 'negotiate-bill',
              label: 'Negotiate Bill',
              description: 'Lower your monthly costs',
              icon: 'phone',
              placeholder: 'What bill? Current amount? History?',
              systemPrompt: 'Help me negotiate this bill lower. Provide: 1) Script for the call, 2) Key leverage points, 3) What to ask for specifically, 4) When to escalate, 5) Alternative if they say no.',
            },
            {
              id: 'money-mindset',
              label: 'Money Mindset',
              description: 'Heal your relationship with money',
              icon: 'brain',
              placeholder: 'What\'s your biggest money challenge or belief?',
              systemPrompt: 'Help me shift my money mindset. Provide: 1) Reframe of my current belief, 2) Where this belief might come from, 3) New perspective to try, 4) Small action to reinforce change, 5) Affirmation that doesn\'t feel fake.',
            },
          ],
        },
      ],
    },

    // ==========================================================================
    // 4. THINKING & LEARNING
    // ==========================================================================
    {
      id: 'thinking-learning',
      name: 'Thinking & Learning',
      description: 'Brainstorm, research, learn, grow',
      icon: 'brain',
      activities: [
        {
          id: 'brainstorm',
          title: 'Brainstorm',
          description: 'Generate ideas without judgment',
          icon: 'lightbulb',
          type: 'standalone',
          placeholder: 'What do you need ideas for?',
          systemPrompt: 'Generate at least 10 creative ideas. Include: 1) Safe/obvious options, 2) Creative/unexpected options, 3) At least one wild card. Add why each could work.',
          disclaimer: 'VERA generates possibilities. You decide what fits.',
          allowSave: true,
        },
        {
          id: 'summarize',
          title: 'Summarize',
          description: 'Get the key points from anything',
          icon: 'edit',
          type: 'standalone',
          placeholder: 'Paste text, article, or notes to summarize...',
          systemPrompt: 'Summarize this clearly and concisely. Include: 1) Main point, 2) Key supporting details, 3) Important takeaways, 4) What\'s missing or unclear.',
          disclaimer: 'Verify important details from original sources.',
          allowSave: true,
        },
        {
          id: 'explain-like',
          title: 'Explain Like...',
          description: 'Understand complex topics your way',
          icon: 'graduation-cap',
          type: 'dropdown',
          placeholder: 'What concept do you want explained?',
          systemPrompt: 'You are VERA. Explain concepts at the requested complexity level.',
          disclaimer: 'VERA simplifies for understanding. Verify technical details.',
          allowSave: true,
          dropdownOptions: [
            {
              id: 'eli5',
              label: 'ELI5',
              description: 'Explain like I\'m 5',
              icon: 'baby',
              placeholder: 'What concept? What confuses you?',
              systemPrompt: 'Explain this concept as if I\'m 5 years old. Use simple words, analogies, and examples. Make it fun and clear.',
            },
            {
              id: 'eli-busy',
              label: 'Quick Version',
              description: 'Just the essentials',
              icon: 'zap',
              placeholder: 'What do you need to understand quickly?',
              systemPrompt: 'Give me the essential understanding in 3-4 sentences. What do I absolutely need to know? Skip the details.',
            },
            {
              id: 'in-depth',
              label: 'In Depth',
              description: 'Full detailed explanation',
              icon: 'book-open',
              placeholder: 'What concept? What do you already know?',
              systemPrompt: 'Explain this concept at multiple levels: 1) ELI5 (super simple), 2) Basic understanding, 3) Deeper dive, 4) Common misconceptions, 5) How it connects to other things.',
            },
          ],
        },
        {
          id: 'language-learning',
          title: 'Language Learning',
          description: 'Learn 15 languages with VERA',
          icon: 'globe',
          type: 'custom-component',
          componentRef: 'LanguageLearning',
          placeholder: '',
          systemPrompt: '',
          disclaimer: '',
          allowSave: false,
        },
      ],
    },

    // ==========================================================================
    // 5. RELATIONSHIPS & WELLNESS
    // ==========================================================================
    {
      id: 'relationships-wellness',
      name: 'Relationships & Wellness',
      description: 'Nurture connections and take care of yourself',
      icon: 'heart',
      activities: [
        {
          id: 'perspective-shift',
          title: 'Perspective Shift',
          description: 'See a situation from another angle',
          icon: 'refresh-cw',
          type: 'standalone',
          placeholder: 'What situation to reframe?',
          systemPrompt: 'Help me see this from different perspectives. Provide: 1) Optimistic reframe, 2) Growth opportunity, 3) How a mentor might view this, 4) Long-term perspective, 5) What this might be teaching me.',
          disclaimer: 'VERA offers perspectives. Your judgment matters most.',
          allowSave: true,
        },
        {
          id: 'vent-session',
          title: 'Vent Session',
          description: 'Let it out without judgment',
          icon: 'message-square',
          type: 'standalone',
          placeholder: 'What\'s on your mind? Let it all out...',
          systemPrompt: 'Listen without judgment. Validate their feelings. Reflect back what they\'re experiencing. Ask if they want advice or just to be heard. Hold space.',
          disclaimer: 'VERA is an AI Governance system, not a therapist. For mental health support, please consult a professional.',
          allowSave: false,
        },
        {
          id: 'self-check-in',
          title: 'Self Check-In',
          description: 'How are you really doing?',
          icon: 'scan',
          type: 'standalone',
          placeholder: 'How are you feeling? What\'s going on?',
          systemPrompt: 'Guide a gentle self-check-in. Ask: 1) How\'s your body feeling? 2) What emotions are present? 3) What do you need right now? 4) What\'s one small thing that would help? Be warm and non-judgmental.',
          disclaimer: 'VERA is an AI Governance system, not a therapist. For mental health support, please consult a professional.',
          allowSave: true,
        },
        {
          id: 'relationship-help',
          title: 'Relationship Help',
          description: 'Navigate relationship challenges',
          icon: 'heart',
          type: 'dropdown',
          placeholder: 'What relationship situation do you need help with?',
          systemPrompt: 'You are VERA. Help the user navigate relationships with care.',
          disclaimer: 'VERA is an AI Governance system, not a therapist. For serious concerns, please consult a professional.',
          allowSave: true,
          dropdownOptions: [
            {
              id: 'dating',
              label: 'Dating',
              description: 'Dating advice and support',
              icon: 'heart',
              placeholder: 'Tell me about yourself, interests, what you\'re looking for...',
              systemPrompt: 'Give me dating advice for this situation. Be realistic, kind, and empowering. Help me understand patterns, communicate needs, and maintain boundaries.',
            },
            {
              id: 'family',
              label: 'Family',
              description: 'Navigate family dynamics',
              icon: 'users',
              placeholder: 'What\'s the family situation? Who\'s involved?',
              systemPrompt: 'Help me navigate this family situation. Provide: 1) Understanding the dynamics at play, 2) What boundaries might help, 3) Scripts for difficult conversations, 4) How to protect my peace, 5) When professional help might help.',
            },
            {
              id: 'friendship',
              label: 'Friendship',
              description: 'Be a better friend',
              icon: 'handshake',
              placeholder: 'What\'s going on with your friendship?',
              systemPrompt: 'Give me friendship advice for this situation. Provide: 1) Perspective on what might be happening, 2) How to communicate my needs, 3) Whether/how to address issues, 4) How to strengthen the friendship, 5) When to let go if needed.',
            },
          ],
        },
      ],
    },

    // ==========================================================================
    // 6. CREATE
    // ==========================================================================
    {
      id: 'create',
      name: 'Create',
      description: 'Write, post, and express yourself',
      icon: 'sparkles',
      activities: [
        {
          id: 'write-email',
          title: 'Write Email',
          description: 'Draft emails for any situation',
          icon: 'mail',
          type: 'dropdown',
          placeholder: 'What email do you need to write?',
          systemPrompt: 'You are VERA. Help the user write clear, effective emails.',
          disclaimer: 'Review and personalize before sending.',
          allowSave: true,
          dropdownOptions: [
            {
              id: 'professional',
              label: 'Professional',
              description: 'Work emails and formal communication',
              icon: 'briefcase',
              placeholder: 'Who are you emailing? What about? Any context?',
              systemPrompt: 'Write a professional email that: 1) Opens clearly, 2) States purpose directly, 3) Provides necessary context, 4) Ends with clear next steps. Keep it concise.',
            },
            {
              id: 'personal',
              label: 'Personal',
              description: 'Friendly emails to people you know',
              icon: 'heart',
              placeholder: 'Who are you writing to? What\'s the occasion?',
              systemPrompt: 'Write a warm, personal email. Match the tone to your relationship. Be genuine and conversational.',
            },
            {
              id: 'cold-outreach',
              label: 'Cold Outreach',
              description: 'First contact emails',
              icon: 'target',
              placeholder: 'Who are you reaching out to? Why?',
              systemPrompt: 'Write a cold outreach email that: 1) Hooks in first sentence, 2) Shows you did research, 3) Makes a clear ask, 4) Makes it easy to respond. Keep under 150 words.',
            },
          ],
        },
        {
          id: 'social-post',
          title: 'Social Post',
          description: 'Create engaging social content',
          icon: 'smartphone',
          type: 'dropdown',
          placeholder: 'What do you want to post about?',
          systemPrompt: 'You are VERA. Help the user create authentic social content.',
          disclaimer: 'VERA drafts content. Make it authentically yours.',
          allowSave: true,
          dropdownOptions: [
            {
              id: 'linkedin',
              label: 'LinkedIn',
              description: 'Professional posts that engage',
              icon: 'briefcase',
              placeholder: 'What topic? What\'s your angle?',
              systemPrompt: 'Create a LinkedIn post that feels authentic and human. Use short paragraphs. Include a hook. End with engagement. No excessive hashtags.',
              fields: [
                { name: 'topic', label: 'What\'s the topic?', type: 'textarea', placeholder: 'A lesson, insight, update...', required: true },
                { 
                  name: 'goal', 
                  label: 'Goal', 
                  type: 'select', 
                  options: [
                    { value: 'thought-leadership', label: 'Thought Leadership' },
                    { value: 'engagement', label: 'Drive Engagement' },
                    { value: 'announcement', label: 'Announcement' },
                    { value: 'storytelling', label: 'Tell a Story' },
                  ]
                },
              ],
            },
            {
              id: 'twitter',
              label: 'Twitter/X',
              description: 'Threads and tweets',
              icon: 'twitter',
              placeholder: 'What\'s the main idea? Key points?',
              systemPrompt: 'Turn this into an engaging Twitter/X thread. Rules: 1) First tweet must hook, 2) Each tweet stands alone but flows, 3) Use line breaks, 4) End with takeaway. Aim for 5-10 tweets.',
            },
            {
              id: 'instagram',
              label: 'Instagram',
              description: 'Captions that connect',
              icon: 'camera',
              placeholder: 'What\'s the photo/video about? Vibe?',
              systemPrompt: 'Write engaging social media captions. Provide 3 options: 1) Short and punchy, 2) Story-based, 3) Engagement-focused. Include emoji and hashtag suggestions.',
            },
          ],
        },
        {
          id: 'bio-about',
          title: 'Bio / About Me',
          description: 'Write about yourself with confidence',
          icon: 'user',
          type: 'standalone',
          placeholder: 'Who are you? Key accomplishments?',
          systemPrompt: 'Write professional bios in multiple lengths: 1) One-liner, 2) Short (2-3 sentences), 3) Full paragraph. Make them human, not robotic.',
          disclaimer: 'Your bio should reflect your authentic voice.',
          allowSave: true,
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'role', label: 'Role/Title', type: 'text', placeholder: 'Designer, Founder...' },
            { name: 'accomplishments', label: 'Key accomplishments', type: 'textarea', placeholder: 'What should people know?' },
          ],
        },
        {
          id: 'creative-writing',
          title: 'Creative Writing',
          description: 'Stories, poems, and creative expression',
          icon: 'pen-tool',
          type: 'standalone',
          placeholder: 'Genre? Themes? Any starting point?',
          systemPrompt: 'Generate creative story ideas. Provide: 1) 5 unique premises, 2) Main character concepts, 3) Potential conflicts, 4) Twist possibilities, 5) Opening line for each.',
          disclaimer: 'Let VERA spark ideas. The creativity is yours.',
          allowSave: true,
        },
      ],
    },
  ],
};

// MARKETING SUMMARY FOR VERA
// ============================================================================

export const opsMarketingSummary = {
  totalCategories: 6,
  totalActivities: 22,
  highlights: [
    'Decode messages and craft perfect responses',
    'Break down tasks and make decisions',
    'Budget, save, and navigate money talks',
    'Brainstorm, learn, and master 15 languages',
    'Get relationship advice and check in with yourself',
    'Write emails, social posts, and bios',
  ],
  disclaimer: 'VERA is an AI Governance system. She provides tools and frameworks, not professional advice.',
};

/*
================================================================================
CONSOLIDATION SUMMARY
================================================================================

Original: 11 categories, ~69 activities
Consolidated: 6 categories, 22 activities (8 with dropdown sub-options)

Categories merged:
- communication → Communication (3 activities: 1 standalone, 2 dropdowns)
- work + life + planning → Work & Life (4 activities: 2 standalone, 2 dropdowns)
- money → Money (3 activities: 2 standalone, 1 dropdown)
- thinking + learning → Thinking & Learning (4 activities: 2 standalone, 1 dropdown, 1 custom)
- relationships + health → Relationships & Wellness (4 activities: 3 standalone, 1 dropdown)
- content + creativity → Create (4 activities: 2 dropdowns, 2 standalone)

Activities with custom fields preserved:
- goal-setting (planning dropdown)
- resume-bullets (career dropdown)
- cover-letter (career dropdown)
- interview-prep (career dropdown)
- budget-check (standalone)
- salary-negotiation (money-conversations dropdown)
- linkedin (social-post dropdown)
- bio-about (standalone)

Custom components:
- language-learning (custom-component with componentRef: 'LanguageLearning')

Special notes:
- vent-session has allowSave: false (privacy protection)
- All health/relationship activities have mental health disclaimer
- All money activities have financial advice disclaimer
- Language learning uses custom component (allowSave: false)
*/
