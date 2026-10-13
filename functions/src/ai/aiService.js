// 사용자가 입력한 취향 데이터를 OpenAI가 이해할 수 있는 질문으로 정리합니다.
// 실제 OpenAI 호출은 openaiProvider.js에 맡기고, 이 파일은 추천 요청 내용을 구성합니다.
const {requestOpenAI} = require("./openaiProvider");

const createRecommendation = async (formData) => {
  const {
    contentType,
    genre,
    mood,
    atmosphere,
    likeWork,
    avoid,
  } = formData;

  // 프론트엔드에서 받은 값을 바탕으로 추천 프롬프트를 만듭니다.
  const prompt = `
당신은 사용자의 취향을 분석해 콘텐츠를 추천하는 전문가입니다.
아래 사용자 정보를 바탕으로 콘텐츠 3개를 추천해 주세요.

[사용자 취향]
- 원하는 콘텐츠 종류: ${contentType}
- 좋아하는 장르: ${genre}
- 현재 기분: ${mood}
- 선호하는 분위기: ${atmosphere}
- 좋아하는 작품: ${likeWork || "입력하지 않음"}
- 피하고 싶은 요소: ${avoid || "입력하지 않음"}

[추천 결과에 포함할 내용]
- title: 콘텐츠 제목
- genre: 콘텐츠 종류/장르
- description: 간단한 소개
- reason: 추천 이유

반드시 한국어로 작성해 주세요.
`;

  const recommendation = await requestOpenAI(prompt);
  return recommendation;
};

module.exports = {
  createRecommendation,
};

