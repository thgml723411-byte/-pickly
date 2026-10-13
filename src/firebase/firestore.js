import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'

const USERS_COLLECTION = 'users'
const RECOMMENDATIONS_COLLECTION = 'recommendations'

const saveUser = async (userId, userData) => {
  const userReference = doc(db, USERS_COLLECTION, userId)

  await setDoc(userReference, {
    ...userData,
    updatedAt: serverTimestamp(),
  })
}

const getUser = async (userId) => {
  const userReference = doc(db, USERS_COLLECTION, userId)
  const userSnapshot = await getDoc(userReference)

  if (!userSnapshot.exists()) {
    return null
  }

  return {
    id: userSnapshot.id,
    ...userSnapshot.data(),
  }
}

const observeuser = (userId, onChange, onError) => {
  const userReference = doc(db, USERS_COLLECTION, userId)

  return onSnapshot(
    userReference,
    (userSnapshot) => {
      if (!userSnapshot.exists()) {
        onChange(null)
        return
      }

      onChange({
        id: userSnapshot.id,
        ...userSnapshot.data(),
      })
    },
    onError,
  )
}

const updateUserNickname = async (userId, nickname) => {
  const userReference = doc(db, USERS_COLLECTION, userId)

  await updateDoc(userReference, {
    nickname,
    updatedAt: serverTimestamp(),
  })
}

const saveRecommendation = async (userId, recommendationData) => {
  const recommendationCollection = collection(db, RECOMMENDATIONS_COLLECTION)

  const recommendationReference = await addDoc(recommendationCollection, {
    ...recommendationData,
    userId,
    createdAt: serverTimestamp(),
  })

  return recommendationReference.id
}

const saveRecommendationResult = async (recommId, recommItem) => {
  const recommendationReference = doc(db, RECOMMENDATIONS_COLLECTION, recommId)

  await updateDoc(recommendationReference, {
    results: recommItem,
    status: 'completed',
    updatedAt: serverTimestamp(),
  })
}

const getRecommendations = async (userId) => {
  const recommendationCollection = collection(db, RECOMMENDATIONS_COLLECTION)
  const userRecommendationsQuery = query(
    recommendationCollection,
    where('userId', '==', userId),
  )

  const recommendationSnapshot = await getDocs(userRecommendationsQuery)
  const recommendations = []

  recommendationSnapshot.forEach((recommendationDocument) => {
    const recommendation = recommendationDocument.data()

    if (recommendation.userId === userId) {
      recommendations.push({
        id: recommendationDocument.id,
        ...recommendation,
      })
    }
  })

  recommendations.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0
    const bTime = b.createdAt?.toMillis?.() || 0
    return bTime - aTime
  })

  return recommendations
}

const deleteRecommendation = async (recommendationId) => {
  const recommendationReference = doc(
    db,
    RECOMMENDATIONS_COLLECTION,
    recommendationId,
  )

  await deleteDoc(recommendationReference)
}

export {
  saveUser,
  getUser,
  saveRecommendation,
  saveRecommendationResult,
  getRecommendations,
  deleteRecommendation,
  observeuser,
  updateUserNickname,
}
