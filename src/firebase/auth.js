import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from './firebase'

// 이메일과 비밀번호로 회원가입합니다.
const signUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  )

  return userCredential.user
}

// 이메일과 비밀번호로 로그인합니다.
const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  )

  return userCredential.user
}

// 현재 로그인한 사용자를 로그아웃합니다.
const logout = async () => {
  await signOut(auth)
}

// 로그인 상태가 변경될 때마다 사용자 정보를 전달합니다.
// 반환된 함수를 호출하면 상태 감시를 중지할 수 있습니다.
const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user)
  })
}

// 입력한 이메일로 비밀번호 재설정 메일을 보냅니다.
const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email)
}

// 현재 로그인한 사용자의 계정을 삭제합니다.
const deleteAccount = async () => {
  const currentUser = auth.currentUser

  if (!currentUser) {
    throw new Error('로그인한 사용자가 없습니다.')
  }

  await deleteUser(currentUser)
}

export {
  signUp,
  login,
  logout,
  observeAuthState,
  resetPassword,
  deleteAccount,
}

