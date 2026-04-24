import { GoogleGenerativeAI } from '@google/generative-ai';
import { PersonaType, ImpactLevel } from '@/types';

export interface SummaryResult {
  summary: string[];
  checkpoints: { label: string; value: string }[];
  personaImpacts: {
    persona: PersonaType;
    impact: ImpactLevel;
    reason: string;
  }[];
  tags: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const PERSONAS: PersonaType[] = [
  '1인 가구',
  '신혼부부',
  '취업준비생',
  '대학생',
  '직장인',
];

const IMPACT_LEVELS: ImpactLevel[] = [
  'very_positive',
  'positive',
  'neutral',
  'negative',
  'very_negative',
];

async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    // gemini-2.5-flash: 2026년 기준 무료 티어에서 가장 안정적인 최신 모델
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3, // 낮은 온도로 일관성 있는 요약
        responseMimeType: 'application/json',
      },
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

function parseGeminiResponse(response: string): {
  summary: string[];
  checkpoints: { label: string; value: string }[];
  personaImpacts: { persona: PersonaType; impact: ImpactLevel; reason: string }[];
} {
  try {
    // JSON 블록 추출 (```json ... ``` 형식)
    const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : response;
    const parsed = JSON.parse(jsonStr);

    return {
      summary: Array.isArray(parsed.summary)
        ? parsed.summary.slice(0, 3)
        : [parsed.summary || ''],
      checkpoints: Array.isArray(parsed.checkpoints)
        ? parsed.checkpoints.slice(0, 4)
        : [],
      personaImpacts: Array.isArray(parsed.personaImpacts)
        ? parsed.personaImpacts.map((p: any) => ({
            persona: p.persona as PersonaType,
            impact: (p.impact as ImpactLevel) || 'neutral',
            reason: p.reason || '',
          }))
        : [],
    };
  } catch (error) {
    console.error('Failed to parse Gemini response:', error, response);
    return {
      summary: ['요약 생성 실패', '기사를 직접 확인해주세요', ''],
      checkpoints: [],
      personaImpacts: PERSONAS.map((p) => ({
        persona: p,
        impact: 'neutral',
        reason: '분석 대기 중',
      })),
    };
  }
}

export async function summarizeArticle(
  title: string,
  content: string
): Promise<SummaryResult> {
  console.log(`[Summarizer] Summarizing: "${title}"`);

  const prompt = `당신은 청년 정책 분석 전문가입니다. 아래 기사를 읽고, 기사 내용만을 근거로 JSON을 생성하세요.
절대 기사에 없는 수치나 조건을 만들어내지 마세요. 모르면 "기사에 명시되지 않음"이라고 쓰세요.

[기사 제목]
${title}

[기사 내용]
${content || '(내용을 가져올 수 없음)'}

[출력 요구사항]
반드시 아래 JSON 스키마 구조로 출력하되, 모든 값은 기사 내용에서 근거를 찾아 작성하세요.

{
  "summary": [문자열 3개 — 기사 핵심을 3줄로],
  "checkpoints": [{"label": 항목명, "value": 기사에 명시된 구체적 수치/조건}, ...최대 5개],
  "personaImpacts": [
    {"persona": "1인 가구", "impact": 영향도, "reason": 기사 근거 기반 1문장},
    {"persona": "신혼부부", "impact": 영향도, "reason": 기사 근거 기반 1문장},
    {"persona": "취업준비생", "impact": 영향도, "reason": 기사 근거 기반 1문장},
    {"persona": "대학생", "impact": 영향도, "reason": 기사 근거 기반 1문장},
    {"persona": "직장인", "impact": 영향도, "reason": 기사 근거 기반 1문장}
  ]
}

[제약]
- impact 값은 반드시 이 중 하나: "very_positive" | "positive" | "neutral" | "negative" | "very_negative"
- persona는 정확히 위 5개, 오타 금지
- checkpoints는 기사에서 실제로 언급된 조건만 (지원금액, 신청기간, 대상나이, 소득기준, 자산기준, 신청방법 등)
- 기사가 단순 행사/간담회/인터뷰라 구체 조건이 없으면 checkpoints는 빈 배열 []
- 페르소나 영향도는 기사 내용상 연관성이 낮으면 neutral로 판정
- 추측·상상·일반론 금지. 오직 이 기사에 있는 내용만.`;

  try {
    const response = await callGeminiAPI(prompt);
    const parsed = parseGeminiResponse(response);

    // 태그 추출 (제목에서)
    const tags = extractTags(title);

    return {
      summary: parsed.summary,
      checkpoints: parsed.checkpoints,
      personaImpacts: parsed.personaImpacts,
      tags,
    };
  } catch (error) {
    console.error('Error summarizing article:', error);
    return {
      summary: ['요약 생성 실패', '기사를 직접 확인해주세요', ''],
      checkpoints: [
        { label: '대기', value: '정보 없음' },
      ],
      personaImpacts: PERSONAS.map((p) => ({
        persona: p,
        impact: 'neutral',
        reason: '분석 실패',
      })),
      tags: [],
    };
  }
}

function extractTags(title: string): string[] {
  const keywords = [
    '주택',
    '대출',
    '취업',
    '교육',
    '혜택',
    '신혼',
    '대학',
    '소득',
    '자산',
  ];

  return keywords
    .filter((kw) => title.includes(kw))
    .map((kw) => `#${kw}`)
    .slice(0, 3);
}
