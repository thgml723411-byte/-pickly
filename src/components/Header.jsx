import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
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
        <Link to='/' className={styles.logo} aria-label='Pickly 홈'>pickly<span aria-hidden='true'>✳</span></Link>

        <nav className={styles.nav} aria-label='주 메뉴'>
          <NavLink to='/' end className={({ isActive }) => isActive ? styles.active : styles.link}>오늘의 무드</NavLink>
          <NavLink to='/recommend' className={({ isActive }) => isActive ? styles.active : styles.link}>콘텐츠 찾기</NavLink>
          {
            user ? (
              <>
                <span>{nickname ? `${nickname}님` : '사용자님'}</span>
                <NavLink to='/mypage' className={({ isActive }) => isActive ? styles.active : styles.link}>마이페이지</NavLink>
                <button onClick={fnclogout} disabled={isLoggin}>
                  {isLoggin ? '로그아웃중' : '로그아웃'}
                </button>
              </>
            ) : (
              <>
                <NavLink to='/login' className={({ isActive }) => isActive ? styles.active : styles.link}>로그인</NavLink>
                <Link to='/signup' className={styles.join}>시작하기</Link>
              </>
            )
          }
        </nav>
      </div>
    </header>
  )
}

export default Header
