import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { requestRecommendation } from '../services/recommendationApi'
import { saveRecommendation, saveRecommendationResult } from '../firebase/firestore'
import { Helmet } from 'react-helmet-async'
import { moods, contentTypes } from '../data/moods'
import MoodIcon from '../components/MoodIcon'
import styles from './Recommend.module.scss'

const Recommend = ({ user }) => {
  const [searchParams] = useSearchParams()
  const initialMood = moods.find((mood) => mood.id === searchParams.get('mood'))
  const initialType = contentTypes.find((type) => type.value === searchParams.get('type'))
  const [formData, setFormData] = useState({
    contentType: initialType?.value || '',
    genre: '',
    mood: initialMood?.value || '',
    atmosphere: initialMood?.atmosphere || '',
    likeWork: '',
    avoid: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errMessage, setErrMessage] = useState('')
  const [recommendations, setRecommendations] = useState([])

  const fncChange = (e) => {
    const { name, value } = e.target
    setFormData((item) => ({ ...item, [name]: value }))
  }

  const chooseMood = (mood) => {
    setFormData((item) => ({ ...item, mood: mood.value, atmosphere: mood.atmosphere }))
  }

  const fncSubmit = async (e) => {
    e.preventDefault()
    setErrMessage('')
    setRecommendations([])

    if (!user?.uid) {
      setErrMessage('로그인 사용자 정보를 확인할 수 없습니다.')
      return
    }

    setIsSaving(true)
    try {
      const result = await saveRecommendation(user.uid, { ...formData, status: 'requested' })
      const response = await requestRecommendation(formData)
      if (!Array.isArray(response) || response.length === 0) {
        throw new Error('추천 결과가 비어 있습니다.')
      }
      await saveRecommendationResult(result, response)
      setRecommendations(response)
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
      <Helmet><title>오늘의 Pick 찾기 | Pickly</title></Helmet>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>A PICK FOR YOUR MOOD</p>
        <h1 className={styles.title}>지금의 나에게 어울리는 이야기.</h1>
        <p className={styles.text}>오늘의 기분에 취향을 조금 더해주세요.<br />Pickly가 당신을 위한 콘텐츠를 골라드릴게요.</p>
      </section>

      <form className={styles.form} onSubmit={fncSubmit} aria-busy={isSaving}>
        <fieldset className={styles.moodFieldset} disabled={isSaving}>
          <legend>01 <span>오늘의 무드</span></legend>
          <div className={styles.moodOptions}>
            {moods.map((mood) => (
              <button key={mood.id} type='button' className={styles.moodOption} aria-pressed={formData.mood === mood.value} onClick={() => chooseMood(mood)}>
                <MoodIcon mood={mood.id} /><span>{mood.label}</span><span aria-hidden='true'>{formData.mood === mood.value ? '✓' : '+'}</span>
              </button>
            ))}
          </div>
          <div className={styles.field}>
            <label htmlFor='mood'>나의 기분 <span>필수 · 무드를 고르거나 직접 적어주세요</span></label>
            <input id='mood' name='mood' value={formData.mood} onChange={fncChange} maxLength={300} placeholder='예: 비 오는 날, 잔잔한 위로가 필요해요' required />
          </div>
        </fieldset>

        <fieldset className={styles.tasteFieldset} disabled={isSaving}>
          <legend>02 <span>조금 더, 나의 취향</span></legend>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor='contentType'>어떤 콘텐츠를 찾나요? <span>필수</span></label>
              <select id='contentType' name='contentType' value={formData.contentType} onChange={fncChange} required>
                <option value=''>콘텐츠를 선택해주세요</option>
                {contentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor='atmosphere'>끌리는 분위기 <span>필수</span></label>
              <select id='atmosphere' name='atmosphere' value={formData.atmosphere} onChange={fncChange} required>
                <option value=''>분위기를 선택해주세요</option>
                <option value='calm'>차분하고 편안한</option>
                <option value='bright'>밝고 즐거운</option>
                <option value='emotion'>감성적인</option>
                <option value='exciting'>긴장감 있고 신나는</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor='genre'>좋아하는 장르 <span>필수</span></label>
              <input id='genre' name='genre' value={formData.genre} onChange={fncChange} maxLength={200} placeholder='예: 로맨스, 재즈, 에세이' required />
            </div>
            <div className={styles.field}>
              <label htmlFor='likeWork'>좋아하는 작품 <span>선택</span></label>
              <input id='likeWork' name='likeWork' value={formData.likeWork} onChange={fncChange} maxLength={300} placeholder='취향을 알려줄 작품이 있나요?' />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label htmlFor='avoid'>피하고 싶은 요소 <span>선택</span></label>
              <input id='avoid' name='avoid' value={formData.avoid} onChange={fncChange} maxLength={300} placeholder='예: 잔인한 장면, 슬픈 결말' />
            </div>
          </div>
        </fieldset>
        <div className={styles.formBottom}>
          <p>당신의 기분과 취향을 바탕으로 AI가 추천해요.</p>
          <button className={styles.submit} type='submit' disabled={isSaving}>{isSaving ? '오늘의 Pick을 고르는 중…' : '오늘의 Pick 만나기'} <span aria-hidden='true'>↗</span></button>
        </div>
        {isSaving && <p className={styles.status} role='status'>지금의 무드에 어울리는 콘텐츠를 찾고 있어요. 잠시만 기다려주세요.</p>}
        {errMessage && <p className={styles.error} role='alert'>{errMessage}</p>}
      </form>

      {recommendations.length > 0 && (
        <section className={styles.results} aria-labelledby='results-title' aria-live='polite'>
          <div className={styles.resultsHead}>
            <div><p className={styles.eyebrow}>PICKED FOR YOUR MOOD</p><h2 id='results-title' className={styles.title}>오늘의 당신을 위한 Pick.</h2><p>지금의 기분과 취향에 어울리는 콘텐츠를 모았어요.</p></div>
            <span className={styles.badge}>{recommendations.length} PICKS</span>
          </div>
          <div className={styles.grid}>
            {recommendations.map((item, idx) => (
              <article className={styles.card} key={`${item.title}-${idx}`}>
                <div className={styles.cardHead}><span className={styles.cardIndex}>{String(idx + 1).padStart(2, '0')}</span><span className={styles.cardType}>{contentTypes.find((type) => type.value === formData.contentType)?.label}</span></div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardMeta}>{item.genre}</p>
                <p className={styles.cardBody}>{item.description}</p>
                <div className={styles.reason}><h4>지금의 당신에게 추천하는 이유</h4><p>{item.reason}</p></div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default Recommend
