// React에서 호출한 요청을 받아 aiService.js를 실행하고, 추천 결과를 React로 반환합니다.
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {createRecommendation} = require("./ai/aiService");

exports.getRecommendation = onCall(
    {
      region: "us-central1",
      // 프론트엔드에서 로그인 없이도 호출할 수 있도록 공개 호출을 허용합니다.
      // 배포 후 인증이 필요해지면 Firebase Auth 검증 로직을 추가하세요.
      invoker: "public",
    },
    async (request) => {
      const formData = request.data;

      // 필수 입력값이 없으면 프론트엔드에서 처리하기 쉬운 invalid-argument 오류를 반환합니다.
      if (!formData) {
        throw new HttpsError("invalid-argument", "추천에 필요한 입력 정보가 없습니다.");
      }
      if (!formData.contentType) {
        throw new HttpsError("invalid-argument", "원하는 콘텐츠 종류를 선택해 주세요.");
      }
      if (!formData.genre || !formData.genre.trim()) {
        throw new HttpsError("invalid-argument", "좋아하는 장르를 입력해 주세요.");
      }
      if (!formData.mood || !formData.mood.trim()) {
        throw new HttpsError("invalid-argument", "현재 기분을 입력해 주세요.");
      }
      if (!formData.atmosphere || !formData.atmosphere.trim()) {
        throw new HttpsError("invalid-argument", "선호하는 분위기를 입력해 주세요.");
      }

      try {
        const recommendation = await createRecommendation(formData);
        return {recommendation};
      } catch (err) {
        console.error("AI 추천 생성 오류", err);
        throw new HttpsError("internal", "추천 결과를 생성하지 못했습니다.");
      }
    },
);

// invalid-argument: 사용자가 입력한 값이 부족하거나 올바르지 않을 때 사용합니다.
// internal: 서버 내부 처리 또는 AI 호출 과정에서 실패했을 때 사용합니다.
// public 호출을 허용했으므로, 민감한 작업을 추가할 때는 인증/권한 검사를 함께 넣어야 합니다.


