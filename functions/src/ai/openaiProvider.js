// OpenAI API 설정을 확인하고, OpenAI 객체를 생성한 뒤 프롬프트를 보내 결과를 반환합니다.
const OpenAI = require("openai");

// 프론트엔드(Recommend.jsx)가 기대하는 형태: {title, genre, description, reason}[]
const recommendationSchema = {
  type: "object",
  properties: {
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {type: "string"},
          genre: {type: "string"},
          description: {type: "string"},
          reason: {type: "string"},
        },
        required: ["title", "genre", "description", "reason"],
        additionalProperties: false,
      },
    },
  },
  required: ["recommendations"],
  additionalProperties: false,
};

const requestOpenAI = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;

  // Firebase Functions 환경변수에 OPENAI_API_KEY가 없으면 AI 호출을 진행할 수 없습니다.
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");
  }

  const openai = new OpenAI({apiKey});

  // text.format(json_schema)로 구조화된 응답을 강제해서, 프론트에서 바로 배열로 쓸 수 있게 합니다.
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: "recommendations",
        schema: recommendationSchema,
        strict: true,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("추천 결과가 비어 있습니다.");
  }

  let parsed;
  try {
    parsed = JSON.parse(response.output_text);
  } catch (err) {
    throw new Error("추천 결과 형식이 올바르지 않습니다.");
  }

  if (
    !Array.isArray(parsed.recommendations) ||
    parsed.recommendations.length === 0
  ) {
    throw new Error("추천 결과가 비어 있습니다.");
  }

  return parsed.recommendations;
};

module.exports = {
  requestOpenAI,
};

