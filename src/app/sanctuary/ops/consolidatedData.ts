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
  label?: string;
  allowedThinkingModes?: string[];
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
          title: 'Understand & Respond',
          description: 'Decode messages and craft the right response',
          icon: 'message-circle',
          type: 'standalone',
          placeholder: 'Paste the message you want to decode...',
          systemPrompt: 'Analyze this message and explain: 1) What they\'re actually saying (the subtext), 2) Their likely emotional state, 3) What they probably want from you, 4) Suggested response approach. Be direct and insightful.',
          disclaimer: 'VERA interprets tone and intent but context may vary.',
          allowSave: true,
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
          id: 'get-unstuck',
          title: 'Get Unstuck',
          description: 'Too much in your head? Let\'s sort it out together.',
          icon: 'clipboard-list',
          type: 'standalone',
          placeholder: 'What\'s on your mind?',
          systemPrompt: '',
          disclaimer: 'VERA is a decision-support tool, not a substitute for professional advice.',
          allowSave: true,
        },
      ],
    },

    // ==========================================================================
    // 3. CAREER
    // ==========================================================================
    {
      id: 'career-category',
      name: 'Career',
      description: 'Resume, interviews, job search',
      icon: 'briefcase',
      activities: [
        {
          id: 'appkit-orchestrator',
          title: 'Application Kit',
          description: 'Everything you need to land the job',
          icon: 'briefcase',
          type: 'standalone',
          placeholder: 'Build your complete application kit',
          systemPrompt: '',
          disclaimer: 'VERA helps you present your best self. Always review and personalize before sending.',
          allowSave: true,
        }
      ],
    },

    // ==========================================================================
    // 4. MONEY
    // ==========================================================================
    {
      id: 'money',
      name: 'Money',
      description: 'Your pocket CFO who tells it like it is',
      icon: 'dollar-sign',
      activities: [
        {
          id: 'money-orchestrator',
          title: 'Talk to my CFO',
          description: 'Your pocket CFO who tells it like it is',
          icon: 'dollar-sign',
          type: 'standalone',
          placeholder: 'What\'s going on with your money?',
          systemPrompt: '',
          disclaimer: 'VERA is not a financial advisor. Consult a professional for major decisions.',
          allowSave: true,
        },
      ],
    },

    // ==========================================================================
    // 5. THINKING & LEARNING
    // ==========================================================================
    {
      id: 'thinking-learning',
      name: 'Thinking & Learning',
      description: 'Clear thinking. Deep learning. No fluff.',
      icon: 'brain',
      activities: [
        {
          id: 'think-learn',
          title: 'Clear My Head',
          description: 'Clear thinking. Deep learning. No fluff.',
          icon: 'brain',
          type: 'standalone',
          placeholder: 'What are you trying to think through or understand?',
          systemPrompt: '',
          disclaimer: 'VERA is a thinking partner, not a substitute for professional expertise.',
          allowSave: true,
        },
      ],
    },

    // ==========================================================================
    // 6. LANGUAGES
    // ==========================================================================
    {
      id: 'languages',
      name: 'Languages',
      description: 'Learn and master 15 languages with VERA',
      icon: 'globe',
      activities: [
        {
          id: 'language-learning',
          title: 'Learn a Language',
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
    // 7. LIFE STUFF
    // ==========================================================================
    {
      id: 'relationships-wellness',
      name: 'Life Stuff',
      description: 'Nurture connections and take care of yourself',
      icon: 'heart',
      activities: [
        {
          id: 'wellness-orchestrator',
          title: 'Check In',
          description: 'For your heart, your head, and your habits.',
          icon: 'heart',
          type: 'standalone',
          placeholder: 'What\'s going on?',
          systemPrompt: '',
          disclaimer: 'VERA is not a therapist. For serious mental health concerns, please reach out to a professional.',
          allowSave: true,
        },
      ],
    },

    // ==========================================================================
    // 8. CREATE
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
          systemPrompt: 'You are VERA — a sharp communicator who writes emails that actually get read and get responses. No corporate fluff. No passive-aggressive nonsense. Clear, human, effective.\n\nBased on what they need, write an email that:\n- Gets to the point in the first line\n- Sounds like a human, not a template\n- Has a clear ask or next step\n- Is the right length (short for simple asks, longer only if needed)\n\nMatch the tone they requested. If professional, be professional but not stiff. If casual, be warm but not sloppy.\n\nOutput ONLY the email they can copy and send. No explanations.',
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
          systemPrompt: 'You are VERA — a social media writer who creates posts that stop the scroll. No generic engagement bait. No cringe. Authentic, sharp, platform-aware.\n\nBased on what they want to post about:\n- Write for the specific platform (Twitter/X is punchy, LinkedIn is professional but human, Instagram is visual-friendly)\n- Hook in the first line\n- Make it sound like THEM, not like AI\n- Include a call to action if appropriate\n\nOutput ONLY the post they can copy and use. No explanations.',
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
          systemPrompt: 'You are VERA — a personal branding expert who writes bios that make people interesting without making them sound like they\'re trying too hard.\n\nBased on their info:\n- Lead with what makes them unique\n- Cut the generic stuff (\'passionate about...\' \'dedicated to...\')\n- Match the vibe they need (professional, creative, casual)\n- Make it the right length for where it\'s going\n\nOutput ONLY the bio they can copy and use. No explanations.',
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
          systemPrompt: 'You are VERA — a creative collaborator who helps bring ideas to life. You\'re not here to write generic content. You\'re here to help them find their voice and make something worth reading.\n\nBased on what they want to create:\n- Match their style and tone\n- Surprise them with something better than they expected\n- Take creative risks if appropriate\n- Make it feel alive, not template-generated\n\nOutput the creative piece. If it\'s long, you can break it into sections. Be bold.',
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
- communication â†’ Communication (3 activities: 1 standalone, 2 dropdowns)
- work + life + planning â†’ Work & Life (4 activities: 2 standalone, 2 dropdowns)
- money â†’ Money (3 activities: 2 standalone, 1 dropdown)
- thinking + learning â†’ Thinking & Learning (4 activities: 2 standalone, 1 dropdown, 1 custom)
- relationships + health → Life Stuff (4 activities: 3 standalone, 1 dropdown)
- content + creativity â†’ Create (4 activities: 2 dropdowns, 2 standalone)

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
