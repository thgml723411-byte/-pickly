import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { signUp } from '../firebase/auth.js'
import { saveUser } from '../firebase/firestore.js'
import styles from './signUp.module.scss'

const SignUp = () => {
  const [nicname, setNicname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errMessage, setErrmessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [confirmMessage, setconfirmMessage] = useState('')
  const navigate = useNavigate()

  const fncpass = (e) => {
    const confirmValue = e.target.value
    setPasswordConfirm(confirmValue)

    if(password === confirmValue){
       setconfirmMessage('비밀번호가 일치합니다')
       return
    }
       setconfirmMessage('비밀번호가 일치하지 않습니다')
   }


  const checkPasswordMatch = () => {
    if(password !== passwordConfirm){
       setErrmessage('비밀번호가 일치하지 않습니다')
       return false
    }
    return true
  }

  const fncSub = (e) => {
    e.preventDefault()

    if(!checkPasswordMatch()) return

    creatSignup()
  }

  const creatSignup = async () => {
     setErrmessage('')
     setIsLoading(true)

     try{
       const user = await signUp(email,password)//회원가입
       await saveUser (user.uid,{nicname,email:user.email})//user의 정보를 가지고 저장
       navigate('/')
     }catch(err){
        if(err.code === 'auth/email-already-in-use'){
          setErrmessage('이미 가입된 이메일 입니다')
        }else if (err.code === 'auth/invalid-email') {
        setErrmessage('올바른 이메일 형식을 입력해 주세요.')
      } else if (err.code === 'auth/weak-password') {
        setErrmessage('비밀번호는 6자 이상 입력해 주세요.')
      } else {
        setErrmessage('회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.')
      }
     }finally{
       setIsLoading(false)
     }
  }

  return (
    <main className={styles.signUp}>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>sign up</p>
        <h2 className={styles.title}>회원 가입</h2>
        <p className={styles.text}>가입하셔서 나에게 맞는 콘텐츠를 찾아보세요</p>
      </section>

      <form className={styles.form} onSubmit={fncSub}>
        <div className={styles.field}>
          <label htmlFor='nicname'>닉네임</label>
          <input id='nicname' type="text" value={nicname} onChange={(e) => setNicname(e.target.value)} placeholder="닉네임" />
        </div>

        <div className={styles.field}>
          <label htmlFor='email'>이메일</label>
          <input id='email' type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
        </div>

        <div className={styles.field}>
          <label htmlFor='password'>비밀번호</label>
          <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
        </div>

        <div className={styles.field}>
          <label htmlFor='passwordConfirm'>비밀번호 확인</label>
          <input id='passwordConfirm' type="password" value={passwordConfirm} onChange={fncpass} required/>
        </div>

        {
          confirmMessage && (
            <p className={password === passwordConfirm ? styles.confirmOk : styles.error}>{confirmMessage}</p>
          )
        }

        <button className={styles.submit} type='submit' disabled={isLoading}>{isLoading ? '가입중....' : '회원가입'}</button>

        {
          errMessage && (
            <p className={styles.error}>{errMessage}</p>
          )
        }

      </form>

    </main>
  )
}

export default SignUp

//import { signUp } from '../firebase/auth.js'는 함수를 데고 들어온 것