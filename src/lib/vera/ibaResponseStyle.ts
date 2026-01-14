import ibaStyleSpec from '../../../specs/iba_style_rubric.json';

export type IbaStyleAnalysis = {
  questions_count: number;
  max_sentences_per_paragraph: number;
  max_words_per_sentence: number;
  has_line_breaks: boolean;
  preferred_sentence_range: { min: number; max: number };
  sentences_outside_preferred_range: number;
  forbidden_phrase_hits: string[];
  forbidden_punctuation_hits: string[];
  has_emoji: boolean;
  has_required_exit_line: boolean;
  why_question_used: boolean;
  how_come_question_used: boolean;
};

export type IbaStyleViolation = { rule: string; message: string };

function normalize(s: string): string {
  return (s ?? '').trim();
}

function getRules(): {
  max_sentences_per_paragraph: number;
  max_questions_per_message: number;
  preferred_word_count_range: { min: number; max: number };
  max_words_per_sentence: number;
  require_line_breaks: boolean;
  forbidden_phrases: string[];
  forbidden_punctuation: string[];
  forbidden_question_starters: string[];
  required_exit_lines: string[];
} {
  const raw = (ibaStyleSpec as any) ?? {};
  const sentenceRules = raw.sentence_rules ?? {};
  const questionRules = raw.question_rules ?? {};
  const languageConstraints = raw.language_constraints ?? {};
  const punctuationRules = raw.punctuation_rules ?? {};
  const exitSafety = raw.exit_safety ?? {};

  const prefRangeRaw = Array.isArray(sentenceRules.preferred_word_count_range)
    ? sentenceRules.preferred_word_count_range
    : [8, 16];
  const prefMin = typeof prefRangeRaw[0] === 'number' ? prefRangeRaw[0] : 8;
  const prefMax = typeof prefRangeRaw[1] === 'number' ? prefRangeRaw[1] : 16;

  return {
    max_sentences_per_paragraph:
      typeof sentenceRules.max_sentences_per_paragraph === 'number' ? sentenceRules.max_sentences_per_paragraph : 3,
    max_questions_per_message:
      typeof questionRules.max_questions_per_response === 'number' ? questionRules.max_questions_per_response : 1,
    preferred_word_count_range: {
      min: Math.max(1, Math.floor(prefMin)),
      max: Math.max(1, Math.floor(prefMax)),
    },
    max_words_per_sentence:
      typeof sentenceRules.max_words_per_sentence === 'number' ? sentenceRules.max_words_per_sentence : 22,
    require_line_breaks: Boolean(sentenceRules.require_line_breaks),
    forbidden_phrases: Array.isArray(languageConstraints.forbidden_phrases)
      ? languageConstraints.forbidden_phrases.filter((x: unknown) => typeof x === 'string')
      : [],
    forbidden_punctuation: Array.isArray(punctuationRules.forbidden_characters)
      ? punctuationRules.forbidden_characters.filter((x: unknown) => typeof x === 'string')
      : ['!', '…'],
    forbidden_question_starters: Array.isArray(questionRules.forbidden_question_starters)
      ? questionRules.forbidden_question_starters.filter((x: unknown) => typeof x === 'string')
      : ['why', 'how come'],
    required_exit_lines: Array.isArray(exitSafety.required_exit_phrases)
      ? exitSafety.required_exit_phrases.filter((x: unknown) => typeof x === 'string')
      : [],
  };
}

function splitParagraphs(text: string): string[] {
  const normalized = normalize(text);
  if (!normalized) return [];

  // A paragraph is separated by one or more blank lines.
  return normalized.split(/\n\s*\n+/g).map((p) => p.trim()).filter(Boolean);
}

function countQuestions(text: string): number {
  return (text.match(/\?/g) ?? []).length;
}

function countSentencesInParagraph(paragraph: string): number {
  // Conservative approximation: sentence terminators are . ?
  // We count ! too (but that will be separately forbidden).
  // Avoid counting ellipsis as multiple.
  const cleaned = paragraph.replace(/\.\.\.+/g, '.');
  const matches = cleaned.match(/[.!?]+(?=\s|$)/g);
  return matches ? matches.length : 0;
}

function tokenizeWords(sentence: string): string[] {
  // Split on whitespace, then strip common punctuation.
  return sentence
    .trim()
    .split(/\s+/g)
    .map((w) => w.replace(/^[\s"'“”‘’()\[\]{}<>.,;:]+|[\s"'“”‘’()\[\]{}<>.,;:]+$/g, ''))
    .filter(Boolean);
}

function splitIntoSentences(text: string): string[] {
  const t = normalize(text);
  if (!t) return [];
  // Keep it simple: split on sentence terminators.
  return t
    .replace(/\.\.\.+/g, '.')
    .split(/[.!?]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function detectEmoji(text: string): boolean {
  // Heuristic: any Extended Pictographic block (covers most emoji).
  // Node/JS supports Unicode property escapes in modern runtimes.
  return /[\u{1F300}-\u{1FAFF}]/u.test(text) || /\p{Extended_Pictographic}/u.test(text);
}

function detectForbiddenPhraseHits(text: string, phrases: string[]): string[] {
  const hay = text.toLowerCase();
  const hits: string[] = [];
  for (const p of phrases) {
    const needle = p.toLowerCase();
    if (!needle) continue;
    if (hay.includes(needle)) hits.push(p);
  }
  return hits;
}

function detectForbiddenPunctuationHits(text: string, chars: string[]): string[] {
  const hits: string[] = [];
  for (const ch of chars) {
    if (!ch) continue;
    if (text.includes(ch)) hits.push(ch);
  }
  return hits;
}

function detectWhyQuestionUsed(text: string): boolean {
  // Any question that starts with "why" after optional whitespace/newline.
  return /(^|\n)\s*why\b/i.test(text);
}

function detectHowComeQuestionUsed(text: string): boolean {
  return /(^|\n)\s*how\s+come\b/i.test(text);
}

function hasRequiredExitLine(text: string, requiredLines: string[]): boolean {
  const lines = normalize(text).split(/\n+/g).map((l) => l.trim()).filter(Boolean);
  const last = lines.length ? lines[lines.length - 1] : '';
  if (!last) return false;
  return requiredLines.some((req) => normalize(req) === last);
}

export function analyzeIbaResponseStyle(text: string): IbaStyleAnalysis {
  const rules = getRules();
  const t = text ?? '';

  const paragraphs = splitParagraphs(t);
  let maxSentences = 0;
  for (const p of paragraphs) {
    maxSentences = Math.max(maxSentences, countSentencesInParagraph(p));
  }

  const sentences = splitIntoSentences(t);
  let maxWords = 0;
  let outsidePreferred = 0;
  for (const s of sentences) {
    const wc = tokenizeWords(s).length;
    maxWords = Math.max(maxWords, wc);
    if (wc > 0 && (wc < rules.preferred_word_count_range.min || wc > rules.preferred_word_count_range.max)) {
      outsidePreferred += 1;
    }
  }

  const hasLineBreaks = /\n/.test(t);

  return {
    questions_count: countQuestions(t),
    max_sentences_per_paragraph: maxSentences,
    max_words_per_sentence: maxWords,
    has_line_breaks: hasLineBreaks,
    preferred_sentence_range: rules.preferred_word_count_range,
    sentences_outside_preferred_range: outsidePreferred,
    forbidden_phrase_hits: detectForbiddenPhraseHits(t, rules.forbidden_phrases),
    forbidden_punctuation_hits: detectForbiddenPunctuationHits(t, rules.forbidden_punctuation),
    has_emoji: detectEmoji(t),
    has_required_exit_line: hasRequiredExitLine(t, rules.required_exit_lines),
    why_question_used: detectWhyQuestionUsed(t),
    how_come_question_used: detectHowComeQuestionUsed(t),
  };
}

export function validateIbaResponseStyle(text: string): {
  ok: boolean;
  analysis: IbaStyleAnalysis;
  violations: IbaStyleViolation[];
} {
  const rules = getRules();
  const analysis = analyzeIbaResponseStyle(text);
  const violations: IbaStyleViolation[] = [];

  if (analysis.max_sentences_per_paragraph > rules.max_sentences_per_paragraph) {
    violations.push({
      rule: 'max_sentences_per_paragraph',
      message: `max_sentences_per_paragraph=${analysis.max_sentences_per_paragraph} > ${rules.max_sentences_per_paragraph}`,
    });
  }

  if (analysis.questions_count > rules.max_questions_per_message) {
    violations.push({
      rule: 'max_questions_per_message',
      message: `questions_count=${analysis.questions_count} > ${rules.max_questions_per_message}`,
    });
  }

  if (analysis.why_question_used) {
    violations.push({
      rule: 'forbidden_question_starter',
      message: 'why question starter used',
    });
  }

  if (analysis.how_come_question_used) {
    violations.push({
      rule: 'forbidden_question_starter',
      message: 'how come question starter used',
    });
  }

  if (analysis.max_words_per_sentence > rules.max_words_per_sentence) {
    violations.push({
      rule: 'max_words_per_sentence',
      message: `max_words_per_sentence=${analysis.max_words_per_sentence} > ${rules.max_words_per_sentence}`,
    });
  }

  if (rules.require_line_breaks && !analysis.has_line_breaks) {
    violations.push({
      rule: 'require_line_breaks',
      message: 'response must contain line breaks',
    });
  }

  if (analysis.forbidden_phrase_hits.length) {
    violations.push({
      rule: 'forbidden_phrases',
      message: `forbidden phrases present: ${analysis.forbidden_phrase_hits.join(', ')}`,
    });
  }

  if (analysis.forbidden_punctuation_hits.length) {
    violations.push({
      rule: 'forbidden_punctuation',
      message: `forbidden punctuation present: ${analysis.forbidden_punctuation_hits.join(', ')}`,
    });
  }

  if (analysis.has_emoji) {
    violations.push({
      rule: 'no_emojis',
      message: 'emoji detected',
    });
  }

  if (!analysis.has_required_exit_line) {
    violations.push({
      rule: 'required_exit_line',
      message: 'missing required soft-exit closing line',
    });
  }

  return { ok: violations.length === 0, analysis, violations };
}
