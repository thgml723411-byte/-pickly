import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { observeuser } from '../firebase/firestore'
import styles from './Header.module.scss'

const Header = ({ user }) => { //프롭스 설정
  const [isLoggin, setIsLoggin] = useState(false)
  const [nickname, setNickname] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      setNickname('')
      return undefined
    }
    const stopObserve = observeuser(
      user.uid,
      (userData) => {
        setNickname(userData?.nickname || '')
      },
      (error) => {
        setNickname('')
      }
    )

    return stopObserve
  }, [user])

  const fnclogout = async () => {
    setIsLoggin(true)
    try {
      await logout()
      navigate('/')
    }catch(err){
      console.error('로그아웃에러', err)
      alert('로그아웃중 문제가 발생, 다시 시도해주세요')
    }finally {
      setIsLoggin(false)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to='/' className={styles.logo}>MIQ</Link>

        <nav className={styles.nav}>
          <Link to='/'>홈</Link>
          <Link to='/recommend'>AI 추천</Link>
          {
            user ? (
              <>
                <span>{nickname ? `${nickname}님` : '사용자님'}</span>
                <Link to='/mypage'>마이페이지</Link>
                <button onClick={fnclogout} disabled={isLoggin}>
                  {isLoggin ? '로그아웃중' : '로그아웃'}
                </button>
              </>
            ) : (
              <>
                <Link to='/login'>로그인</Link>
                <Link to='/signup'>회원가입</Link>
              </>
            )
          }
        </nav>
      </div>
    </header>
  )
}

export default Header
