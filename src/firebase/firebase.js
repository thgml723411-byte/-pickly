import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

// .env ?뚯씪????ν븳 Firebase ?ㅼ젙媛믪쓣 媛?몄샃?덈떎.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// ?대? 珥덇린?붾맂 ?깆씠 ?덉쑝硫?湲곗〈 ?깆쓣 ?ъ슜?⑸땲??
// 媛쒕컻 以?Hot Reload濡??깆씠 ?щ윭 踰?珥덇린?붾릺??臾몄젣瑜??덈갑?⑸땲??
const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0]

// Firebase Authentication 媛앹껜瑜??앹꽦?⑸땲??
const auth = getAuth(firebaseApp)

// Firestore ?곗씠?곕쿋?댁뒪 媛앹껜瑜??앹꽦?⑸땲??
const db = getFirestore(firebaseApp)


// Cloud Functions 媛앹껜瑜??앹꽦?⑸땲??
const functions = getFunctions(firebaseApp, 'us-central1')

export { auth, db, functions }

if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
}

export default firebaseApp

//us-central1?대쭏?뚮?濡쒖벝?섏뾾?붽쾬?몃뜳?쨓s?먯엳?붽구濡
