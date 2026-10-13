import React, {useEffect,useState} from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { observeAuthState } from '../firebase/auth'

import ProtectedRoute from '../components/ProtectedRoute.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import SignUp from '../pages/SignUp.jsx'
import Recommend from '../pages/Recommend.jsx'
import MyPage from '../pages/MyPage.jsx'
import NotFound from '../pages/NotFound.jsx'
import Loading from '../components/Loading.jsx'

const Router = () => {
  const location = useLocation()
  const [user,setUser] = useState(null)
  const [isAuthLoding,setIsAuthLoding] = useState(true)

  useEffect(()=>{
     const Obsering = observeAuthState((cuser)=>{
       setUser(cuser)
       setIsAuthLoding(false)
     })
     return Obsering //실시간 상태 감시 중지
  },[])

  if(isAuthLoding){
    return<Loading/>
  }

  return (
    <>
      <Header user={user}/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/recommend' 
          element={
          <ProtectedRoute user={user}>
            <Recommend user={user}/>
          </ProtectedRoute>
        }
        />
          <Route path='/login' 
          element={
            user ? <Navigate to={location.state?.from || '/mypage'} replace/> : <Login/>
          }
          />
          <Route path='/signup'
          element={
            user ? <Navigate to={location.state?.from || '/mypage'} replace/> : <SignUp/>
          }
          />
          <Route path='/mypage' 
          element={
          <ProtectedRoute user={user}>
            <MyPage user={user}/>
          </ProtectedRoute>
          }
          />
          <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default Router

//전체 라우터 관리
//앱에그냥불려가는곳
