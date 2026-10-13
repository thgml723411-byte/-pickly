import React, { useState } from 'react'
import { requestRecommendation } from '../services/recommendationApi'
import { saveRecommendation, saveRecommendationResult } from '../firebase/firestore'
import { Helmet } from 'react-helmet-async'
import styles from './Recommend.module.scss'

const Recommend = ({ user }) => {
  const [formData, setFormData] = useState({
    contentType: '',
    genre: '',
    mood: '',
    atmosphere: '',
    likeWork: '',
    avoid: '',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [errMessage, setErrMessage] = useState('')
  const [relaicomm, setrelaicomm] = useState([])
  const [recomm, setRecomm] = useState([])

  const fncChange = (e) => {
    const { name, value } = e.target
    setFormData((item) => ({ ...item, [name]: value }))
  }

  const fncSubmit = async (e) => {
    e.preventDefault()
    setErrMessage('')
    setRecomm([])

    if (!user?.uid) {
      setErrMessage('로그인 사용자 정보를 확인할 수 없습니다.')
      return
    }

    setIsSaving(true)

    try {
      const result = await saveRecommendation(user.uid, {
        ...formData,
        status: 'requested',
      })

      const rel = await requestRecommendation(formData)
      if (!Array.isArray(rel) || rel.length === 0) {
        throw new Error('추천 결과가 비어 있습니다.')
      }

      await saveRecommendationResult(result, rel)

      setRecomm(rel)
      setrelaicomm(rel)
    } catch (err) {
      if (err.code === 'functions/invalid-argument') {
        setErrMessage(err.message || '입력값을 확인해 주세요.')
      } else {
        setErrMessage(err.message || '추천을 처리하지 못했습니다. 다시 시도해 주세요.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className={styles.recommend}>
      <Helmet>
        <title>추천 받기 | MIQ</title>
      </Helmet>

      <section>
        <p>RECOMMEND</p>
        <h1>나의 취향을 알려주세요</h1>
        <p>아래 항목을 입력하면 MIQ가 나에게 어울리는 콘텐츠를 찾아드립니다.</p>
      </section>

      <form onSubmit={fncSubmit}>
        <div>
          <label htmlFor='contentType'>원하는 콘텐츠 종류</label>
          <select
            id='contentType'
            name='contentType'
            value={formData.contentType}
            onChange={fncChange}
            required
          >
            <option value=''>선택해주세요</option>
            <option value='movie'>영화</option>
            <option value='music'>음악</option>
            <option value='book'>도서</option>
            <option value='drama'>드라마</option>
          </select>
        </div>

        <div>
          <label htmlFor='genre'>좋아하는 장르</label>
          <input id='genre' name='genre' value={formData.genre} onChange={fncChange} />
        </div>

        <div>
          <label htmlFor='mood'>현재 기분</label>
          <input id='mood' name='mood' value={formData.mood} onChange={fncChange} />
        </div>

        <div>
          <label htmlFor='atmosphere'>선호하는 분위기</label>
          <select
            id='atmosphere'
            name='atmosphere'
            value={formData.atmosphere}
            onChange={fncChange}
          >
            <option value=''>선택해주세요</option>
            <option value='calm'>차분하고 편안한</option>
            <option value='bright'>밝고 즐거운</option>
            <option value='emotion'>감성적인</option>
            <option value='exciting'>긴장감 있고 신나는</option>
          </select>
        </div>

        <div>
          <label htmlFor='likeWork'>좋아하는 작품</label>
          <input id='likeWork' name='likeWork' value={formData.likeWork} onChange={fncChange} />
        </div>

        <div>
          <label htmlFor='avoid'>싫어하거나 피하고 싶은 요소</label>
          <input id='avoid' name='avoid' value={formData.avoid} onChange={fncChange} />
        </div>

        <button type='submit' disabled={isSaving}>
          {isSaving ? '추천 받는 중...' : '맞춤 추천 받기'}
        </button>
      </form>

      {errMessage && <p>{errMessage}</p>}

      {relaicomm.length > 0 && (
        <section>
          <div>
            <p>AI RECOMMENDATION</p>
            <h2>맞춤 콘텐츠 추천</h2>
            <p>입력하신 취향을 바탕으로 추천합니다.</p>
          </div>
          <div>
            {relaicomm.map((item, idx) => (
              <article key={`${item.title}-${idx}`}>
                <div>
                  <span>추천 {idx + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.genre}</p>
                <p>{item.description}</p>
                <div>
                  <p>추천 이유</p>
                  <p>{item.reason}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default Recommend

