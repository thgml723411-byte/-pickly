import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../firebase/auth.js'
import styles from './Login.module.scss'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMessage, setErrMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const funSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrMessage('')

    try {
      await login(email, password)
      navigate(location.state?.from || '/mypage', { replace: true })
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        setErrMessage('올바른 이메일 형식을 입력해 주세요.')
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrMessage('이메일 또는 비밀번호가 일치하지 않습니다.')
      } else {
        setErrMessage('로그인 중 문제가 발생했습니다. 다시 시도해 주세요.')
      }
      console.error(err,'로그인 오류')//개발자를위해서
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>

    <Helmet>
       <html lang='ko'/>
       <title>로그인 | Pickly</title>
       <meta name='description' content='Pickly에 로그인하고 오늘의 기분에 맞는 콘텐츠를 발견하세요.'/>
    </Helmet>

    <main className={styles.login}>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>login</p>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.text}>{location.state?.from ? '고른 무드는 기억하고 있어요. 로그인하고 오늘의 Pick을 만나보세요.' : '다시 만나서 반가워요. 오늘은 어떤 기분인가요?'}</p>
      </section>

      <form className={styles.form} onSubmit={funSubmit}>
        <div className={styles.field}>
          <label htmlFor='email'>이메일</label>
          <input id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
        </div>

        <div className={styles.field}>
          <label htmlFor='password'>비밀번호</label>
          <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" required />
        </div>


        <button className={styles.submit} type="submit" disabled={isLoading}>{isLoading ? '로그인 중....' : '로그인'}</button>

        {
          errMessage && (
            <p className={styles.error}>{errMessage}</p>
          )
        }

      </form>

    <p className={styles.signupLink}>아직 회원이 아니신가요? <Link to='/signup' state={location.state}>회원가입</Link></p>

    </main>

    </>
  )
}

export default Login

//<></>의미없는태그
//검색에게유리한것헬멧
//required빈칸이있으면절대다음단계로넘어가지않는
//disabled버튼자체를못누르게하는
//form은무조건자동전송
