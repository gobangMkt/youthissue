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

  const prompt = `당신은 청년에게 정책 뉴스를 친근하게 전달하는 에디터입니다.
토스(Toss) 서비스의 보이스앤톤을 따르세요: 친근한 존댓말("~해요", "~이에요"), 공감 유도, 격식 없이 쉬운 설명, 불필요한 이모지·전문용어 금지.

[기사 제목]
${title}

[기사 내용 — 여러 언론사 교차]
${content || '(내용 없음)'}

[JSON 출력 규칙]

{
  "summary": [문자열 3개],
  // 토스 톤의 존댓말 대화체로 핵심 3줄.
  // 좋은 예: "경기도가 청년 월세 지원금을 두 배로 올려달라고 정부에 건의했어요."
  //        "지금 월 20만 원인데, 40만 원까지 올리자는 거예요."
  //        "소득 기준과 대상 연령도 넓히자고 함께 제안했어요."
  // 나쁜 예: "경기도는 ~ 건의하였다.", "~해야 한다.", "~임."

  "checkpoints": [{"label": "...", "value": "..."}],
  // 기사에 명시적으로 나온 구체적 수치/조건만. 예: 지원금액, 신청기간, 대상 나이, 소득기준, 대출한도 등.
  // 구체 정보가 없으면 checkpoints는 빈 배열 [] 로 둘 것. 절대 "기사에 명시되지 않음" 같은 문구 쓰지 말 것.
  // 좋은 예: {"label": "월세 지원액", "value": "월 20만 원 → 40만 원 상향 건의"}
  // 나쁜 예: {"label": "소득 기준", "value": "기사에 명시되지 않음"}

  "personaImpacts": [
    {"persona": "1인 가구", "impact": "...", "reason": "..."},
    {"persona": "신혼부부", "impact": "...", "reason": "..."},
    {"persona": "취업준비생", "impact": "...", "reason": "..."},
    {"persona": "대학생", "impact": "...", "reason": "..."},
    {"persona": "직장인", "impact": "...", "reason": "..."}
  ]
  // impact: "very_positive" | "positive" | "neutral" | "negative" | "very_negative" 중 하나.
  // reason: 토스 톤 한 문장.
  //   좋은 예: "혼자 살며 월세 부담이 크다면, 매달 몇 십만 원이 아껴질 수 있어요."
  //   좋은 예: "이 정책은 신혼부부와는 직접 연관이 없어요." (impact=neutral)
  //   나쁜 예: "기사 내용이 제공되지 않아 판단할 수 없음."
}

[반드시 지킬 것]
1. 토스 톤: 친근한 존댓말, 문장 짧게, 전문용어는 풀어서 설명.
2. "기사에 명시되지 않음" / "내용이 제공되지 않음" / "판단할 수 없음" 같은 회피 문구 절대 금지.
   → 정보가 없으면 checkpoints는 빈 배열, personaImpacts reason은 "~와는 직접 연관이 없어요" 같은 담백한 한 줄로.
3. 과장·추측·일반론 금지. 오직 기사 속 사실만.
4. 이모지 쓰지 말 것.`;

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
