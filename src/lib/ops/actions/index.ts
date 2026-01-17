import { Category, ActionItem } from '../types';

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

export const CATEGORIES: { id: Category; title: string; icon: string; description: string }[] = [
  { id: 'communication', title: 'Communication', icon: 'message', description: 'Find the right words' },
  { id: 'work', title: 'Work & Career', icon: 'briefcase', description: 'Navigate pressure & direction' },
  { id: 'life', title: 'Life Admin', icon: 'complaint', description: 'Reduce friction & drag' },
  { id: 'content', title: 'Content', icon: 'social', description: 'Express & connect' },
  { id: 'thinking', title: 'Thinking Tools', icon: 'think', description: 'Untangle & clarify' },
  { id: 'health', title: 'Health & Wellness', icon: 'health', description: 'Sustain what matters' },
  { id: 'money', title: 'Money & Finance', icon: 'money', description: 'Stability & capacity' },
  { id: 'learning', title: 'Learning & Growth', icon: 'learn', description: 'Build understanding' },
  { id: 'relationships', title: 'Relationships', icon: 'heart', description: 'Deepen connection' },
  { id: 'creativity', title: 'Creativity', icon: 'creative', description: 'Unlock & explore' },
  { id: 'planning', title: 'Planning & Goals', icon: 'goal', description: 'Shape your path' },
];

// ============================================================================
// ALL ACTIONS BY CATEGORY
// ============================================================================

export const ACTIONS_BY_CATEGORY: Record<Category, ActionItem[]> = {
  communication: [
    { id: 'decode-message', title: 'Decode Message', description: 'Understand the real meaning', icon: 'decode', placeholder: 'Paste the message you want to decode...', systemPrompt: 'Analyze this message and explain: 1) What they\'re actually saying (the subtext), 2) Their likely emotional state, 3) What they probably want from you, 4) Suggested response approach. Be direct and insightful.' },
    { id: 'quick-reply', title: 'Quick Reply', description: 'Draft a response in seconds', icon: 'email', placeholder: 'Paste the email/message you need to reply to...', systemPrompt: 'Write a concise, appropriate reply to the message provided. Match the tone of the original. Be direct and helpful. No filler phrases or over-formality.' },
    { id: 'say-no', title: 'Say No Nicely', description: 'Decline without guilt', icon: 'no', placeholder: 'What do you need to say no to? Who is asking?', systemPrompt: 'Help me decline this request politely but firmly. Provide 3 versions: 1) Brief and direct, 2) Warm but clear, 3) With an alternative offer. No over-explaining or excessive apologizing.' },
    { id: 'follow-up', title: 'Follow Up', description: 'Nudge without nagging', icon: 'follow-up', placeholder: 'What are you following up on? Context about the original message...', systemPrompt: 'Write a follow-up message that\'s friendly but effective. Not passive-aggressive. Provide 2-3 versions with different tones.' },
    { id: 'apology', title: 'Apology Crafter', description: 'Apologize without over-explaining', icon: 'apology', placeholder: 'What happened? Who do you need to apologize to?', systemPrompt: 'Help craft a genuine apology that: 1) Acknowledges what happened, 2) Takes responsibility without excessive self-blame, 3) Doesn\'t over-explain, 4) Offers a path forward.' },
    { id: 'explain-simply', title: 'Explain Simply', description: 'Make complex things clear', icon: 'simplify', placeholder: 'What do you need to explain? Who is your audience?', systemPrompt: 'Explain this concept in simple terms that anyone can understand. Use analogies if helpful. Provide both a one-sentence version and a paragraph version.' },
    { id: 'boundary-script', title: 'Boundary Script', description: 'Set limits with grace', icon: 'boundary', placeholder: 'What boundary do you need to set? With whom?', systemPrompt: 'Help me set this boundary clearly and kindly. Provide: 1) The key statement, 2) How to handle pushback, 3) A softer alternative if needed.' },
    { id: 'tough-conversation', title: 'Tough Conversation', description: 'Navigate difficult dialogue', icon: 'message', placeholder: 'What\'s the conversation about? Your relationship? Your goal?', systemPrompt: 'Help me prepare for this difficult conversation. Provide: 1) Opening statement options, 2) Key points to make, 3) How to respond to likely reactions, 4) How to end constructively.' },
  ],

  work: [
    { id: 'meeting-prep', title: 'Meeting Prep', description: 'Get ready in 2 minutes', icon: 'meeting', placeholder: 'What\'s the meeting about? Paste any context...', systemPrompt: 'Help me prepare for this meeting quickly. Provide: 1) Key points to remember, 2) Questions I should ask, 3) Potential challenges to anticipate, 4) A brief mental framework.' },
    { id: 'interview-prep', title: 'Interview Prep', description: 'Nail your next interview', icon: 'interview', placeholder: 'What\'s the role? Company? Concerns?', systemPrompt: 'Help me prepare for this job interview. Provide: 1) Likely questions and how to answer them for THIS specific role, 2) Questions I should ask, 3) Key points to emphasize, 4) Common pitfalls to avoid.', fields: [
      { id: 'role', label: 'What role?', type: 'text', placeholder: 'e.g., Product Manager at Stripe', required: true },
      { id: 'background', label: 'Your relevant experience', type: 'textarea', placeholder: 'Brief summary of your background...' },
      { id: 'concerns', label: 'Any specific concerns?', type: 'textarea', placeholder: 'Gaps, weaknesses, tricky questions...' },
    ]},
    { id: 'salary-negotiation', title: 'Salary Negotiation', description: 'Ask for what you\'re worth', icon: 'money', placeholder: 'Current salary? Target? Context?', systemPrompt: 'Help me negotiate this salary/raise. Provide: 1) Key talking points, 2) Specific scripts for different scenarios, 3) How to handle pushback, 4) What to do if they say no.', fields: [
      { id: 'current', label: 'Current situation', type: 'text', placeholder: 'Current salary or offer amount' },
      { id: 'target', label: 'Your target', type: 'text', placeholder: 'What you want to get' },
      { id: 'context', label: 'Context', type: 'textarea', placeholder: 'Is this a new job, raise, promotion?' },
    ]},
    { id: 'one-on-one', title: '1:1 Agenda', description: 'Prep for manager meetings', icon: 'meeting', placeholder: 'Who is the 1:1 with? Any specific topics?', systemPrompt: 'Help me prepare a 1:1 agenda. Include: 1) Status updates worth sharing, 2) Questions to ask, 3) Feedback to give or request, 4) Career development topics.' },
    { id: 'performance-review', title: 'Performance Review', description: 'Self-assessment that shines', icon: 'review', placeholder: 'What did you accomplish? Role and context?', systemPrompt: 'Help me write my self-assessment for performance review. Transform my accomplishments into powerful bullets that demonstrate impact.', fields: [
      { id: 'role', label: 'Your role', type: 'text', placeholder: 'e.g., Senior Engineer', required: true },
      { id: 'accomplishments', label: 'What you accomplished', type: 'textarea', placeholder: 'Projects, wins, contributions...', required: true },
      { id: 'challenges', label: 'Any challenges faced?', type: 'textarea', placeholder: 'Obstacles overcome, lessons learned...' },
    ]},
    { id: 'resume-bullets', title: 'Resume Bullets', description: 'Achievement-focused points', icon: 'resume', placeholder: 'Role, responsibilities, and any metrics...', systemPrompt: 'Transform this into powerful resume bullet points. Use strong action verbs. Quantify results. Generate 4-6 bullets.', fields: [
      { id: 'role', label: 'Job title', type: 'text', placeholder: 'e.g., Product Manager', required: true },
      { id: 'company', label: 'Company/Industry', type: 'text', placeholder: 'e.g., Tech startup' },
      { id: 'responsibilities', label: 'What did you do?', type: 'textarea', placeholder: 'Describe responsibilities and achievements...', required: true },
    ]},
    { id: 'cover-letter', title: 'Cover Letter', description: 'Stand out from the pile', icon: 'resume', placeholder: 'Role, company, and why you\'re excited...', systemPrompt: 'Write a compelling cover letter that: 1) Opens with a hook, 2) Connects my experience to their needs, 3) Shows genuine interest, 4) Ends with confidence. Under 300 words.', fields: [
      { id: 'role', label: 'What role?', type: 'text', placeholder: 'e.g., Product Designer at Figma', required: true },
      { id: 'background', label: 'Relevant experience', type: 'textarea', placeholder: 'Your key qualifications...', required: true },
      { id: 'why', label: 'Why this company?', type: 'textarea', placeholder: 'What excites you about them?' },
    ]},
    { 
      id: 'job-application-kit', 
      title: 'Job Application Kit', 
      description: 'Full ATS resume + cover letter + emails', 
      icon: 'resume', 
      placeholder: 'Paste the full job description here...', 
      systemPrompt: `You are an elite career coach, ATS optimization expert, and executive resume writer who has helped thousands land jobs at top companies. Your task is to create a COMPLETE, DETAILED job application kit.

IMPORTANT: Be DETAILED and COMPREHENSIVE. Each section must be COMPLETE and SEPARATE.

Based on the job description and the candidate's current resume, generate ALL of the following sections. Use clear separators between each section.

================================================================================
SECTION 1: COMPLETE ATS-OPTIMIZED RESUME
================================================================================

Create a FULL, detailed resume ready to copy into a Word document:

PROFESSIONAL SUMMARY
(Write 4-5 powerful sentences - years of experience, core expertise, key achievements with numbers, skills matching job requirements, value proposition for THIS role)

PROFESSIONAL EXPERIENCE

[For EACH position from their resume, write:]

[Job Title]
[Company Name] | [Location] | [Start Date] - [End Date]

• [Bullet 1 - Start with power verb, include metric, match job keyword]
• [Bullet 2 - Challenge-Action-Result format]
• [Bullet 3 - Specific achievement with numbers]
• [Bullet 4 - Leadership or collaboration example]
• [Bullet 5 - Technical skill or process improvement]
• [Bullet 6 - If senior role, add more bullets]
• [Bullet 7 - If senior role, add more bullets]

[Repeat for ALL positions in their resume]

EDUCATION

[Degree] | [University] | [Year]
[Add relevant coursework, honors, GPA if strong]

SKILLS

Technical Skills: [List all matching job requirements]
Software & Tools: [List all matching job requirements]
Industry Knowledge: [List relevant areas]
Soft Skills: [List 4-5 relevant ones]

CERTIFICATIONS (if applicable)
[List any from their resume]

================================================================================
SECTION 2: COVER LETTER
================================================================================

[Today's Date]

[Hiring Manager/Recruiting Team]
[Company Name]
[Address if known]

Dear Hiring Manager,

[OPENING PARAGRAPH - 3-4 sentences]
Strong hook mentioning the specific role and company by name. Express genuine enthusiasm. Briefly mention your most relevant qualification that matches their top requirement.

[BODY PARAGRAPH 1 - 4-5 sentences]
Detail your TOP achievement that directly relates to this role. Use specific numbers and results. Connect it explicitly to what they're looking for in the job description.

[BODY PARAGRAPH 2 - 4-5 sentences]
Share another relevant accomplishment or skill set. Show you understand their company, industry, or challenges. Demonstrate cultural fit.

[CLOSING PARAGRAPH - 2-3 sentences]
Express enthusiasm for the opportunity to contribute. Clear call to action. Thank them for their consideration.

Sincerely,
[Candidate Name]
[Phone]
[Email]
[LinkedIn URL]

================================================================================
SECTION 3: EMAIL TO APPLY DIRECTLY (Corporate Portal/HR)
================================================================================

SUBJECT LINE OPTIONS:
1. Application for [Job Title] - [Your Name] | [Key Qualification]
2. [Job Title] Application - [X] Years of [Relevant] Experience
3. Experienced [Your Title] Eager to Join [Company Name] as [Job Title]

EMAIL BODY:

Dear [Company Name] Recruiting Team,

I am writing to express my strong interest in the [Job Title] position at [Company Name]. With [X years] of experience in [relevant field], I am excited about the opportunity to contribute to your team.

In my current role at [Company], I [one key achievement with metric]. I am particularly drawn to [Company Name] because [specific reason about company - mission, product, culture, recent news].

I have attached my resume for your review. I would welcome the opportunity to discuss how my background in [key skill] and [key skill] aligns with your needs.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Name]
[Phone]
[Email]

================================================================================
SECTION 4: FOLLOW-UP EMAIL (1 Week After Applying)
================================================================================

SUBJECT: Following Up - [Job Title] Application | [Your Name]

Dear [Hiring Manager/Recruiting Team],

I hope this message finds you well. I recently submitted my application for the [Job Title] position and wanted to follow up to reiterate my strong interest in joining [Company Name].

I am very enthusiastic about the opportunity to bring my experience in [key skill] to your team. I would be happy to provide any additional information that would be helpful.

Thank you for your time and consideration. I look forward to the possibility of speaking with you.

Best regards,
[Name]
[Phone] | [Email]

================================================================================
SECTION 5: LINKEDIN MESSAGE TO RECRUITER
================================================================================

MESSAGE 1 - Connection Request Note (300 characters max):

Hi [Name], I recently applied for the [Job Title] role at [Company] and would love to connect. With my background in [key area], I'm very excited about this opportunity. Would be great to be part of your network!

MESSAGE 2 - Follow-up After Connecting:

Hi [Name],

Thank you for connecting! I wanted to reach out because I recently applied for the [Job Title] position at [Company Name] and I'm very excited about the opportunity.

With [X years] in [field] and a track record of [key achievement], I believe I could make a strong contribution to your team.

I'd love the chance to learn more about the role and share how my experience aligns with what you're looking for. Would you be open to a brief conversation?

Thank you for your time!

Best,
[Name]

================================================================================
SECTION 6: LINKEDIN MESSAGE TO HIRING MANAGER
================================================================================

MESSAGE 1 - Connection Request Note (300 characters max):

Hi [Name], I'm a [Your Title] with [X years] in [field] and very interested in the [Job Title] role on your team. I'd love to connect and learn more about the opportunity. Thank you!

MESSAGE 2 - Follow-up After Connecting:

Hi [Name],

Thank you for accepting my connection request. I came across the [Job Title] position on your team and was immediately drawn to it because [specific reason about team/company/role].

A bit about me: I'm currently [Title] at [Company] where I [brief achievement]. Previously, I [another relevant experience]. I'm particularly passionate about [relevant area].

I've already applied through [LinkedIn/company portal], but I wanted to reach out directly to express my genuine interest. If you have a few minutes, I'd love to share more about how I could contribute to [team/company goal].

Either way, I appreciate you connecting and wish you continued success with the team.

Best regards,
[Name]

================================================================================
SECTION 7: LINKEDIN PROFILE OPTIMIZATION
================================================================================

HEADLINE OPTIONS (pick one):
1. [Current Title] | [Key Skill] | [Industry] | [Value Proposition]
2. [Title] at [Company] | Helping [who] achieve [what] through [how]
3. [X]+ Years in [Field] | [Specialty] | [Key Achievement]

KEYWORDS TO ADD THROUGHOUT PROFILE:
[List 12-15 exact keywords from the job posting]

ABOUT SECTION - OPENING LINES TO ADD:
[Write 3-4 sentences tailored to this role/industry that can be added to their LinkedIn About section]

================================================================================

FORMAT RULES:
- Keep each section clearly separated
- Use clean, professional formatting
- No tables or graphics (ATS-friendly)
- Be DETAILED - this is a complete application kit
- Match the candidate's actual experience level
- Use their real achievements and metrics from their resume`,
      fields: [
        { id: 'job_description', label: 'Job Description', type: 'textarea', placeholder: 'Paste the COMPLETE job posting here - include the company name, job title, requirements, responsibilities, qualifications, and any info about the company...', required: true },
        { id: 'current_resume', label: 'Your Current Resume', type: 'textarea', placeholder: 'Paste your ENTIRE current resume here including:\n\n• Contact info (optional)\n• All job titles, companies, dates\n• All bullet points and descriptions\n• Education\n• Skills\n• Certifications\n• Any other sections\n\nThe more detail you provide, the better the output!', required: true },
      ]
    },
  ],

  life: [
    { id: 'complaint-letter', title: 'Complaint Letter', description: 'Get results, not ignored', icon: 'complaint', placeholder: 'What happened? What company? What outcome?', systemPrompt: 'Write a professional complaint letter that: 1) States the issue clearly, 2) Includes relevant details, 3) Specifies what resolution I want, 4) Is firm but not aggressive.' },
    { id: 'dispute', title: 'Dispute Email', description: 'Challenge charges & decisions', icon: 'complaint', placeholder: 'What are you disputing? Details...', systemPrompt: 'Help me dispute this charge/decision professionally. Include: 1) Clear statement of issue, 2) Supporting facts, 3) Specific ask, 4) Escalation path.' },
    { id: 'reference-request', title: 'Reference Request', description: 'Ask someone to vouch for you', icon: 'thank', placeholder: 'Who are you asking? For what opportunity?', systemPrompt: 'Help me ask this person to be a reference. Include: 1) The ask, 2) Context about the opportunity, 3) Specific things I hope they can speak to, 4) An easy out if not comfortable.' },
    { id: 'thank-you', title: 'Thank You Note', description: 'Genuine, not generic', icon: 'thank', placeholder: 'Who are you thanking? What for?', systemPrompt: 'Write a genuine thank you note that: 1) Is specific, 2) Explains the impact, 3) Feels personal. Provide short and longer versions.' },
    { id: 'gift-ideas', title: 'Gift Ideas', description: 'Perfect presents, fast', icon: 'gift', placeholder: 'Who is it for? Occasion? Budget? Interests?', systemPrompt: 'Suggest thoughtful gift ideas. For each: 1) Why it fits them, 2) Where to get it, 3) Price range. Mix practical and creative.', fields: [
      { id: 'who', label: 'Who is it for?', type: 'text', placeholder: 'e.g., My mom, a coworker...', required: true },
      { id: 'occasion', label: 'Occasion', type: 'text', placeholder: 'Birthday, thank you...' },
      { id: 'interests', label: 'Their interests', type: 'textarea', placeholder: 'Hobbies, style, preferences...' },
      { id: 'budget', label: 'Budget', type: 'text', placeholder: 'e.g., $50, $100-200' },
    ]},
    { id: 'excuse', title: 'Polite Excuse', description: 'Get out of things gracefully', icon: 'excuse', placeholder: 'What do you need to get out of?', systemPrompt: 'Help me gracefully decline or get out of this commitment. Provide 3 options: 1) Brief and vague, 2) Specific but kind, 3) With a counter-offer.' },
  ],

  content: [
    { id: 'linkedin-post', title: 'LinkedIn Post', description: 'Professional, not cringe', icon: 'social', placeholder: 'What topic? What\'s your angle?', systemPrompt: 'Create a LinkedIn post that feels authentic and human. Use short paragraphs. Include a hook. End with engagement. No excessive hashtags.', fields: [
      { id: 'topic', label: 'What\'s the topic?', type: 'textarea', placeholder: 'A lesson, insight, update...', required: true },
      { id: 'goal', label: 'Goal', type: 'select', options: [
        { value: 'thought-leadership', label: 'Thought Leadership' },
        { value: 'engagement', label: 'Drive Engagement' },
        { value: 'announcement', label: 'Announcement' },
        { value: 'storytelling', label: 'Tell a Story' },
      ]},
    ]},
    { id: 'tweet-thread', title: 'Tweet Thread', description: 'Turn ideas into threads', icon: 'thread', placeholder: 'What\'s the main idea? Key points?', systemPrompt: 'Turn this into an engaging Twitter/X thread. Rules: 1) First tweet must hook, 2) Each tweet stands alone but flows, 3) Use line breaks, 4) End with takeaway. Aim for 5-10 tweets.' },
    { id: 'caption', title: 'Caption Generator', description: 'Instagram & social captions', icon: 'caption', placeholder: 'What\'s the photo/video about? Vibe?', systemPrompt: 'Write engaging social media captions. Provide 3 options: 1) Short and punchy, 2) Story-based, 3) Engagement-focused. Include emoji and hashtag suggestions.' },
    { id: 'headline', title: 'Headline Options', description: 'Multiple angles, one topic', icon: 'headline', placeholder: 'What\'s the content about? Audience?', systemPrompt: 'Generate 10 headline options. Mix: curiosity-driven, benefit-focused, number-based, and question formats. Rank top 3 and explain why.' },
    { id: 'bio', title: 'Bio Writer', description: 'Professional bios in any length', icon: 'bio', placeholder: 'Who are you? Key accomplishments?', systemPrompt: 'Write professional bios in multiple lengths: 1) One-liner, 2) Short (2-3 sentences), 3) Full paragraph. Make them human, not robotic.', fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'role', label: 'Role/Title', type: 'text', placeholder: 'Designer, Founder...' },
      { id: 'accomplishments', label: 'Key accomplishments', type: 'textarea', placeholder: 'What should people know?' },
    ]},
  ],

  thinking: [
    { id: 'pros-cons', title: 'Pros & Cons', description: 'Structured decision matrix', icon: 'pros-cons', placeholder: 'What decision? Options?', systemPrompt: 'Create a structured pros/cons analysis. For each option: 1) List 4-6 pros, 2) List 4-6 cons, 3) Rate importance, 4) Provide summary recommendation.' },
    { id: 'devil-advocate', title: 'Devil\'s Advocate', description: 'Argue against your idea', icon: 'devil', placeholder: 'What\'s your idea or plan?', systemPrompt: 'Play devil\'s advocate. Provide: 1) Strongest arguments against, 2) Potential blind spots, 3) What could go wrong, 4) Questions I haven\'t considered.' },
    { id: 'brainstorm', title: 'Brainstorm', description: 'Generate 10+ ideas fast', icon: 'brainstorm', placeholder: 'What do you need ideas for?', systemPrompt: 'Generate at least 10 creative ideas. Include: 1) Safe/obvious options, 2) Creative/unexpected options, 3) At least one wild card. Add why each could work.' },
    { id: 'reframe', title: 'Reframe This', description: 'See it from new angles', icon: 'reframe', placeholder: 'What situation to reframe?', systemPrompt: 'Help me see this from different perspectives. Provide: 1) Optimistic reframe, 2) Growth opportunity, 3) How a mentor might view this, 4) Long-term perspective, 5) What this might be teaching me.' },
    { id: 'persona', title: 'What Would X Do?', description: 'Think like someone else', icon: 'persona', placeholder: 'Situation? Who to think like?', systemPrompt: 'Analyze this as if I were the person specified. How would they think? What would they prioritize? What action would they take?', fields: [
      { id: 'situation', label: 'Situation', type: 'textarea', placeholder: 'What you\'re facing...', required: true },
      { id: 'persona', label: 'Who to think like?', type: 'text', placeholder: 'Elon Musk, your future self, a stoic philosopher...', required: true },
    ]},
    { id: 'decision-helper', title: 'Decision Helper', description: 'Clear thinking for tough choices', icon: 'think', placeholder: 'What decision? Factors?', systemPrompt: 'Help me think through this decision. Provide: 1) Key factors, 2) Questions to ask myself, 3) What info I might be missing, 4) A framework for deciding, 5) How to test before committing.' },
  ],

  health: [
    { id: 'meal-plan', title: 'Meal Plan', description: 'Healthy eating made easy', icon: 'meal', placeholder: 'Dietary preferences? Goals? Time constraints?', systemPrompt: 'Create a practical meal plan. Consider preferences, budget, and time. Include: 1) Specific meals, 2) Simple recipes or ideas, 3) Shopping list basics, 4) Prep tips.', fields: [
      { id: 'diet', label: 'Dietary preferences', type: 'text', placeholder: 'Vegetarian, low-carb, no restrictions...' },
      { id: 'goal', label: 'Health goal', type: 'text', placeholder: 'Lose weight, gain muscle, more energy...' },
      { id: 'time', label: 'Cooking time available', type: 'text', placeholder: '15 min, 30 min, I like to cook...' },
    ]},
    { id: 'workout', title: 'Workout Plan', description: 'Exercise that fits your life', icon: 'workout', placeholder: 'Fitness level? Equipment? Goals?', systemPrompt: 'Create a realistic workout plan. Include: 1) Specific exercises with reps/sets, 2) Warmup and cooldown, 3) Modifications for difficulty, 4) Recovery tips.', fields: [
      { id: 'level', label: 'Fitness level', type: 'select', options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ]},
      { id: 'equipment', label: 'Equipment available', type: 'text', placeholder: 'None, dumbbells, full gym...' },
      { id: 'goal', label: 'Goal', type: 'text', placeholder: 'Strength, cardio, flexibility...' },
      { id: 'time', label: 'Time per workout', type: 'text', placeholder: '20 min, 45 min, 1 hour...' },
    ]},
    { id: 'habit-builder', title: 'Habit Builder', description: 'Make good habits stick', icon: 'habit', placeholder: 'What habit? Current routine?', systemPrompt: 'Help me build this habit. Provide: 1) How to start small, 2) Trigger/cue suggestions, 3) How to track progress, 4) What to do when I slip, 5) How to scale up over time.' },
    { id: 'sleep-routine', title: 'Sleep Routine', description: 'Better rest, better life', icon: 'sleep', placeholder: 'Current sleep issues? Schedule constraints?', systemPrompt: 'Create a personalized sleep routine. Include: 1) Wind-down ritual, 2) Environment optimization, 3) What to avoid, 4) How to handle middle-of-night waking, 5) Morning routine that helps.' },
    { id: 'stress-relief', title: 'Stress Relief', description: 'Calm in the chaos', icon: 'health', placeholder: 'What\'s causing stress? How it shows up?', systemPrompt: 'Provide personalized stress relief strategies. Include: 1) Immediate calming techniques, 2) Daily practices, 3) Mindset shifts, 4) When to seek more support.' },
    { id: 'motivation-boost', title: 'Motivation Boost', description: 'Get unstuck fast', icon: 'brainstorm', placeholder: 'What are you struggling to do? Why does it matter?', systemPrompt: 'Give me a motivation boost. Include: 1) Reframe why this matters, 2) The smallest possible first step, 3) How to make it more enjoyable, 4) What success looks like, 5) A pep talk that doesn\'t feel cheesy.' },
  ],

  money: [
    { id: 'budget-help', title: 'Budget Help', description: 'Know where your money goes', icon: 'budget', placeholder: 'Income? Major expenses? Goals?', systemPrompt: 'Help me create or improve my budget. Include: 1) Suggested category percentages, 2) Where to cut if needed, 3) How to track spending, 4) Tips for sticking to it.', fields: [
      { id: 'income', label: 'Monthly income (after tax)', type: 'text', placeholder: 'e.g., $5,000' },
      { id: 'expenses', label: 'Major fixed expenses', type: 'textarea', placeholder: 'Rent, car payment, subscriptions...' },
      { id: 'goal', label: 'Financial goal', type: 'text', placeholder: 'Save for house, pay off debt, emergency fund...' },
    ]},
    { id: 'negotiate-bill', title: 'Negotiate Bill', description: 'Lower your monthly costs', icon: 'money', placeholder: 'What bill? Current amount? History?', systemPrompt: 'Help me negotiate this bill lower. Provide: 1) Script for the call, 2) Key leverage points, 3) What to ask for specifically, 4) When to escalate, 5) Alternative if they say no.' },
    { id: 'investment-basics', title: 'Investment Basics', description: 'Understand your options', icon: 'savings', placeholder: 'What do you want to understand? Current situation?', systemPrompt: 'Explain this investment concept in simple terms. Include: 1) How it works, 2) Pros and cons, 3) Who it\'s good for, 4) Common mistakes, 5) Next steps to learn more. Note: This is educational, not financial advice.' },
    { id: 'expense-review', title: 'Expense Review', description: 'Find hidden savings', icon: 'budget', placeholder: 'List your subscriptions and recurring costs...', systemPrompt: 'Review these expenses and identify savings. Provide: 1) What to cancel or downgrade, 2) What to negotiate, 3) Cheaper alternatives, 4) What\'s actually worth keeping.' },
    { id: 'savings-plan', title: 'Savings Plan', description: 'Reach your money goals', icon: 'savings', placeholder: 'What are you saving for? Timeline? Current savings?', systemPrompt: 'Create a savings plan for this goal. Include: 1) Monthly target to hit goal, 2) Where to keep the money, 3) How to automate, 4) What to do if you fall behind, 5) How to stay motivated.' },
    { id: 'money-mindset', title: 'Money Mindset', description: 'Heal your relationship with money', icon: 'money', placeholder: 'What\'s your biggest money challenge or belief?', systemPrompt: 'Help me shift my money mindset. Provide: 1) Reframe of my current belief, 2) Where this belief might come from, 3) New perspective to try, 4) Small action to reinforce change, 5) Affirmation that doesn\'t feel fake.' },
  ],

  learning: [
    { id: 'study-plan', title: 'Study Plan', description: 'Learn anything effectively', icon: 'study', placeholder: 'What do you want to learn? Timeline? Current level?', systemPrompt: 'Create a study plan for learning this. Include: 1) Learning roadmap, 2) Best resources, 3) Practice exercises, 4) Milestones to track progress, 5) How long each phase should take.', fields: [
      { id: 'topic', label: 'What to learn', type: 'text', placeholder: 'Spanish, Python, photography...', required: true },
      { id: 'timeline', label: 'Timeline', type: 'text', placeholder: '3 months, 1 year...' },
      { id: 'level', label: 'Current level', type: 'select', options: [
        { value: 'complete-beginner', label: 'Complete Beginner' },
        { value: 'some-basics', label: 'Know Some Basics' },
        { value: 'intermediate', label: 'Intermediate' },
      ]},
    ]},
    { id: 'explain-concept', title: 'Explain Concept', description: 'Understand anything deeply', icon: 'learn', placeholder: 'What concept? What do you already know?', systemPrompt: 'Explain this concept at multiple levels: 1) ELI5 (super simple), 2) Basic understanding, 3) Deeper dive, 4) Common misconceptions, 5) How it connects to other things.' },
    { id: 'skill-roadmap', title: 'Skill Roadmap', description: 'From beginner to expert', icon: 'goal', placeholder: 'What skill? Where are you now? Where do you want to be?', systemPrompt: 'Create a roadmap to develop this skill. Include: 1) Stages of progression, 2) What to focus on at each stage, 3) How to practice, 4) How to know when to move on, 5) Common plateaus and how to break through.' },
    { id: 'book-summary', title: 'Book Summary', description: 'Key ideas in minutes', icon: 'learn', placeholder: 'What book? What do you want to get from it?', systemPrompt: 'Provide a useful summary of this book. Include: 1) Core thesis, 2) Key ideas (5-7), 3) Most actionable takeaways, 4) Who should read the full book, 5) What critics say.' },
    { id: 'learning-hack', title: 'Learning Hack', description: 'Study smarter, not harder', icon: 'brainstorm', placeholder: 'What are you trying to learn? What\'s not working?', systemPrompt: 'Give me learning hacks for this situation. Include: 1) Why current approach might not work, 2) Better techniques to try, 3) How to make it stick, 4) How to test yourself, 5) How to stay consistent.' },
    { id: 'knowledge-test', title: 'Knowledge Test', description: 'Quiz yourself', icon: 'study', placeholder: 'What topic do you want to be tested on?', systemPrompt: 'Create a knowledge test on this topic. Include: 1) 10 questions of varying difficulty, 2) Mix of formats (multiple choice, short answer, application), 3) Answers at the end, 4) Explanation of why each answer is correct.' },
  ],

  relationships: [
    { id: 'dating-profile', title: 'Dating Profile', description: 'Stand out authentically', icon: 'dating', placeholder: 'Tell me about yourself, interests, what you\'re looking for...', systemPrompt: 'Write a dating profile that\'s authentic and attractive. Include: 1) Attention-grabbing opener, 2) What makes you interesting, 3) What you\'re looking for, 4) Conversation starters. Avoid clichés.', fields: [
      { id: 'about', label: 'About you', type: 'textarea', placeholder: 'Personality, interests, quirks...', required: true },
      { id: 'looking', label: 'What you\'re looking for', type: 'textarea', placeholder: 'Type of person, relationship...' },
      { id: 'tone', label: 'Desired tone', type: 'select', options: [
        { value: 'witty', label: 'Witty & Playful' },
        { value: 'sincere', label: 'Sincere & Warm' },
        { value: 'confident', label: 'Confident & Direct' },
        { value: 'quirky', label: 'Quirky & Unique' },
      ]},
    ]},
    { id: 'conflict-resolution', title: 'Conflict Resolution', description: 'Navigate disagreements', icon: 'message', placeholder: 'What\'s the conflict? Your relationship? What you want?', systemPrompt: 'Help me resolve this conflict constructively. Provide: 1) How to open the conversation, 2) How to express my perspective without attacking, 3) How to listen to theirs, 4) Finding common ground, 5) Specific compromises to propose.' },
    { id: 'family-dynamics', title: 'Family Dynamics', description: 'Navigate tricky family stuff', icon: 'family', placeholder: 'What\'s the family situation? Who\'s involved?', systemPrompt: 'Help me navigate this family situation. Provide: 1) Understanding the dynamics at play, 2) What boundaries might help, 3) Scripts for difficult conversations, 4) How to protect my peace, 5) When professional help might help.' },
    { id: 'friendship-advice', title: 'Friendship Advice', description: 'Be a better friend', icon: 'heart', placeholder: 'What\'s going on with your friendship?', systemPrompt: 'Give me friendship advice for this situation. Provide: 1) Perspective on what might be happening, 2) How to communicate my needs, 3) Whether/how to address issues, 4) How to strengthen the friendship, 5) When to let go if needed.' },
    { id: 'relationship-boundary', title: 'Relationship Boundary', description: 'Protect your peace', icon: 'boundary', placeholder: 'What boundary? With whom? Why is it hard?', systemPrompt: 'Help me set this relationship boundary. Provide: 1) Why this boundary matters, 2) How to communicate it clearly, 3) How to enforce it, 4) How to handle their reaction, 5) How to stay strong if they push back.' },
    { id: 'conversation-starter', title: 'Conversation Starters', description: 'Never run out of things to say', icon: 'message', placeholder: 'Who are you talking to? Context?', systemPrompt: 'Give me great conversation starters for this situation. Provide: 1) Opening lines, 2) Follow-up questions, 3) Topics to explore, 4) How to keep it going, 5) Graceful ways to exit if needed.' },
  ],

  creativity: [
    { id: 'story-idea', title: 'Story Ideas', description: 'Spark your imagination', icon: 'story', placeholder: 'Genre? Themes? Any starting point?', systemPrompt: 'Generate creative story ideas. Provide: 1) 5 unique premises, 2) Main character concepts, 3) Potential conflicts, 4) Twist possibilities, 5) Opening line for each.' },
    { id: 'naming', title: 'Name Generator', description: 'Find the perfect name', icon: 'creative', placeholder: 'What needs a name? Vibe? Constraints?', systemPrompt: 'Generate name options for this. Provide: 1) 10+ options across different styles, 2) Why each works, 3) Domain/handle availability considerations, 4) Top 3 recommendations with reasoning.', fields: [
      { id: 'what', label: 'What needs a name?', type: 'text', placeholder: 'Business, product, pet, baby...', required: true },
      { id: 'vibe', label: 'Desired vibe', type: 'text', placeholder: 'Professional, playful, unique, classic...' },
      { id: 'constraints', label: 'Constraints', type: 'text', placeholder: 'Must start with..., avoid..., industry...' },
    ]},
    { id: 'creative-prompt', title: 'Creative Prompts', description: 'Break through blocks', icon: 'brainstorm', placeholder: 'What type of creative work? Where are you stuck?', systemPrompt: 'Give me creative prompts to break through this block. Provide: 1) 10 unique prompts/exercises, 2) Why each might help, 3) Time estimate for each, 4) How to build on what you create.' },
    { id: 'metaphor-maker', title: 'Metaphor Maker', description: 'Explain things beautifully', icon: 'creative', placeholder: 'What concept needs a metaphor? Audience?', systemPrompt: 'Create powerful metaphors for this concept. Provide: 1) 5 different metaphors/analogies, 2) When each works best, 3) How to extend each one, 4) Potential pitfalls of each.' },
    { id: 'plot-twist', title: 'Plot Twist Generator', description: 'Surprise your audience', icon: 'story', placeholder: 'Current story/situation? What needs a twist?', systemPrompt: 'Generate unexpected plot twists. Provide: 1) 5 twist options from subtle to dramatic, 2) How to set each up, 3) Impact on story/characters, 4) How to execute believably.' },
    { id: 'character-builder', title: 'Character Builder', description: 'Create memorable characters', icon: 'persona', placeholder: 'What kind of character? Role in story?', systemPrompt: 'Help me build a compelling character. Provide: 1) Background and history, 2) Personality traits and flaws, 3) Motivations and fears, 4) Speech patterns and quirks, 5) Character arc potential, 6) Relationships with others.' },
  ],

  planning: [
    { id: 'goal-setting', title: 'Goal Setting', description: 'Set goals that actually work', icon: 'goal', placeholder: 'What do you want to achieve? By when?', systemPrompt: 'Help me set this goal effectively. Provide: 1) SMART goal formulation, 2) Why this goal matters (dig deeper), 3) Potential obstacles, 4) Milestones to track, 5) First 3 actions to take.', fields: [
      { id: 'goal', label: 'What\'s your goal?', type: 'textarea', placeholder: 'What do you want to achieve?', required: true },
      { id: 'timeline', label: 'Timeline', type: 'text', placeholder: '3 months, 1 year...' },
      { id: 'why', label: 'Why does this matter?', type: 'textarea', placeholder: 'What will achieving this give you?' },
    ]},
    { id: 'project-plan', title: 'Project Plan', description: 'Break down big projects', icon: 'plan', placeholder: 'What\'s the project? Deadline? Resources?', systemPrompt: 'Create a project plan. Include: 1) Phases and milestones, 2) Tasks for each phase, 3) Time estimates, 4) Dependencies, 5) Risks and mitigation, 6) Success criteria.', fields: [
      { id: 'project', label: 'Project description', type: 'textarea', placeholder: 'What are you trying to accomplish?', required: true },
      { id: 'deadline', label: 'Deadline', type: 'text', placeholder: 'When does it need to be done?' },
      { id: 'resources', label: 'Resources available', type: 'textarea', placeholder: 'Time, money, help, tools...' },
    ]},
    { id: 'habit-tracker', title: 'Habit Tracker Setup', description: 'Track what matters', icon: 'habit', placeholder: 'What habits? Current tracking method?', systemPrompt: 'Help me set up habit tracking. Provide: 1) What to track (and what not to), 2) Best tracking method for my style, 3) How often to review, 4) What to do with the data, 5) How to adjust when things aren\'t working.' },
    { id: 'weekly-review', title: 'Weekly Review', description: 'Reflect and reset', icon: 'plan', placeholder: 'Paste your wins, challenges, and upcoming priorities...', systemPrompt: 'Guide me through a weekly review. Help me: 1) Celebrate wins (even small ones), 2) Learn from challenges, 3) Identify patterns, 4) Set priorities for next week, 5) Adjust systems if needed.' },
    { id: 'vision-board', title: 'Vision Board Ideas', description: 'Visualize your future', icon: 'creative', placeholder: 'What areas of life? What feelings do you want?', systemPrompt: 'Help me create a meaningful vision board. Provide: 1) Key themes to include, 2) Specific images/words to find, 3) How to organize it, 4) How to use it daily, 5) When to update it.' },
    { id: 'accountability', title: 'Accountability Plan', description: 'Stay on track', icon: 'goal', placeholder: 'What goal? What\'s made you slip before?', systemPrompt: 'Create an accountability plan. Include: 1) Who to involve and how, 2) Check-in frequency and format, 3) Consequences and rewards, 4) What to do when you slip, 5) How to stay motivated long-term.' },
  ],
};
