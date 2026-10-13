// React에서 입력한 취향 데이터를 Cloud Functions의 getRecommendation callable 함수로 보내고
// AI가 만든 추천 결과를 받아옵니다.
import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebase/firebase.js'

export const requestRecommendation = async (formData) => {
  const getRecommendation = httpsCallable(functions, 'getRecommendation')
  const response = await getRecommendation(formData)
  const recommendations = response.data?.recommendation

  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    throw new Error('추천 결과가 비어 있습니다.')
  }

  return recommendations
}

export const reqiestRecommendations = requestRecommendation
