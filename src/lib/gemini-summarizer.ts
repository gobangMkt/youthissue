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
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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

  const prompt = `당신은 청년 정책 분석 전문가입니다. 다음 기사를 분석해주세요.

기사 제목: ${title}

기사 내용:
${content || '(내용을 가져올 수 없음)'}

다음을 JSON 형식으로 반환해주세요:

\`\`\`json
{
  "summary": [
    "첫 번째 줄 요약",
    "두 번째 줄 요약",
    "세 번째 줄 요약"
  ],
  "checkpoints": [
    {
      "label": "나이 기준",
      "value": "만 19세 ~ 39세"
    },
    {
      "label": "소득 기준",
      "value": "기준 중위소득 100%"
    },
    {
      "label": "자산 기준",
      "value": "총자산 3억 이하"
    }
  ],
  "personaImpacts": [
    {
      "persona": "1인 가구",
      "impact": "positive",
      "reason": "월세 부담이 줄어들 수 있음"
    },
    {
      "persona": "신혼부부",
      "impact": "very_positive",
      "reason": "신혼부부 지원이 주요 대상"
    },
    {
      "persona": "취업준비생",
      "impact": "neutral",
      "reason": "소득이 없어 대상이 아닐 수 있음"
    },
    {
      "persona": "대학생",
      "impact": "negative",
      "reason": "독립하지 않은 경우 대상 제외"
    },
    {
      "persona": "직장인",
      "impact": "positive",
      "reason": "중위소득 범위 내라면 지원 가능"
    }
  ]
}
\`\`\`

주의사항:
- summary는 반드시 정확히 3개 문자열 배열
- impact는 다음 중 하나: very_positive, positive, neutral, negative, very_negative
- persona는 정확히: 1인 가구, 신혼부부, 취업준비생, 대학생, 직장인`;

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
