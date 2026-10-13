import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { moods } from '../data/moods'
import MoodIcon from '../components/MoodIcon'
import styles from './Home.module.scss'

const collections = [
  { type: 'movie', category: '영화 · 드라마', mood: 'calm', title: '고요한 영화의 밤', description: '분주했던 하루 끝, 마음의 속도를 늦추고 싶다면.', art: 'cinema', label: 'A SCENE TO STAY', number: '01' },
  { type: 'music', category: '음악', mood: 'bright', title: '기분 좋은 리듬 한 조각', description: '평범한 일상에 작은 설렘을 더하고 싶다면.', art: 'music', label: 'ON REPEAT, TODAY', number: '02' },
  { type: 'book', category: '도서', mood: 'emotion', title: '마음에 오래 남는 문장', description: '지금의 기분을 가만히 들여다보고 싶다면.', art: 'book', label: 'A PAGE FOR YOU', number: '03' },
]

const FilmStrip = ({ className = '', priority = false }) => (
  <div className={`${styles.filmWindow} ${className}`} aria-hidden='true'>
    <div className={styles.filmTrack}>
      {[0, 1, 2].map((copy) => (
        <div key={copy} className={styles.filmSegment}>
          {[0, 1].map((frame) => (
            <div key={frame} className={styles.filmScene}>
              <img src='/images/mood-cozy-cinema.jpg' alt='' width='1536' height='1024' loading={priority ? 'eager' : 'lazy'} fetchPriority={priority && copy === 0 && frame === 0 ? 'high' : 'auto'} />
            </div>
          ))}
          <span className={styles.filmFrameNumber}>PICKLY 400 / MOVIE NIGHT</span>
        </div>
      ))}
    </div>
  </div>
)

const RecordArtwork = ({ className = '' }) => (
  <div className={`${styles.record} ${className}`} aria-hidden='true'>
    <div className={styles.recordFace}>
      <img src='/images/mood-record-art.jpg' alt='' />
      <div className={styles.recordGrooves} />
      <span className={styles.recordBrand}>PICKLY RECORDS</span>
      <span className={styles.recordSide}>SIDE A</span>
      <span className={styles.recordSpeed}>STEREO<br /><b>33⅓</b></span>
      <svg className={styles.recordStar} viewBox='0 0 100 100'><path d='m50 5 11 29 31 2-24 20 8 30-26-17-26 17 8-30L8 36l31-2Z' fill='currentColor' /><circle cx='50' cy='49' r='10' fill='#211e1c' /></svg>
      <span className={styles.recordBottom}>YOUR MOOD, ON REPEAT.</span>
    </div>
  </div>
)

const BookArtwork = ({ className = '' }) => (
  <div className={className} aria-hidden='true'>
    <div className={styles.bookPhoto}>
      <img src='/images/mood-amaranth-folder-cutout.png' alt='' width='736' height='919' />
      <div className={styles.bookCoverCopy}>
        <small>DEAR MY MOOD,</small>
        <strong>한 페이지의<br />여유.</strong>
        <p>마음이 머무는<br />이야기 한 조각.</p>
        <span>pickly library / 03</span>
      </div>
    </div>
  </div>
)

const Home = () => {
  const [selectedMood, setSelectedMood] = useState(moods[0].id)
  const currentMood = moods.find((mood) => mood.id === selectedMood)

  return (
    <>
      <Helmet>
        <title>Pickly | 오늘의 무드, 오늘의 발견</title>
        <meta name='description' content='오늘의 기분에 어울리는 영화, 음악, 책, 드라마. Pickly에서 지금의 나를 위한 콘텐츠를 발견해 보세요.' />
      </Helmet>
      <main className={styles.home}>
        <div className={styles.issueLine}><span>THE EVERYDAY MOOD ARCHIVE</span><span>FILMS, RECORDS & LITTLE STORIES</span><span>VOL. 01 — PICKLY</span></div>
        <section className={styles.hero} aria-labelledby='hero-title'>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span /> A LITTLE PICK, JUST FOR YOU</p>
            <p className={styles.heroEnglish}>Stay in<br /><em>your mood.</em><span aria-hidden='true'>✳</span></p>
            <h1 id='hero-title'>오늘의 기분에,<br className={styles.mobileBreak} /> 딱 맞는 발견.</h1>
            <p className={styles.heroText}>조금 지친 날도, 괜히 설레는 날도.<br />지금의 당신에게 어울리는 이야기를 골라요.</p>
            <a href='#mood-picker' className={styles.cta}>오늘의 무드 고르기 <span aria-hidden='true'>↗</span></a>
            <div className={styles.heroFootnote}><span aria-hidden='true'>↳</span><p>영화 한 편, 음악 한 곡, 책 한 권.<br />좋아하는 순간을 하나씩 모아보세요.</p></div>
          </div>

          <div className={styles.editorialStage} aria-hidden='true'>
            <FilmStrip className={styles.filmstrip} priority />
            <BookArtwork className={styles.paperStack} />
            <RecordArtwork className={styles.heroRecord} />
            <span className={styles.artworkCaption}>COLLECT MOMENTS, NOT JUST CONTENTS.</span>
          </div>
        </section>

        <div className={styles.ticker} aria-hidden='true'><span>YOUR MOOD</span><i>✳</i><span>YOUR MOMENT</span><i>✳</i><span>YOUR LITTLE PICK</span><i>✳</i><span>YOUR MOOD</span></div>

        <section className={styles.moodSection} id='mood-picker' aria-labelledby='mood-title'>
          <div className={styles.sectionHead}>
            <div><p className={styles.eyebrow}>CHAPTER 01 / THE FEELING</p><h2 id='mood-title'>오늘, 어떤 기분인가요?</h2></div>
            <p>정답은 없어요.<br />지금의 마음에 가장 가까운 것을 골라요.</p>
          </div>
          <div className={styles.moodGrid} role='group' aria-label='오늘의 무드 선택'>
            {moods.map((mood, index) => (
              <button key={mood.id} type='button' className={`${styles.moodCard} ${styles[mood.id]}`} aria-pressed={selectedMood === mood.id} onClick={() => setSelectedMood(mood.id)}>
                <span className={styles.moodCardTop}><span>MOOD / 0{index + 1}</span><span className={styles.selectionMark}>{selectedMood === mood.id ? '✓' : '+'}</span></span>
                <MoodIcon mood={mood.id} />
                <span className={styles.moodEnglish}>{mood.english}</span>
                <strong>{mood.label}</strong>
                <span className={styles.moodDescription}>{mood.description}</span>
                <span className={styles.moodCardBottom}>PICKLY MOOD NOTES <span aria-hidden='true'>↗</span></span>
              </button>
            ))}
          </div>
          <div className={styles.selectionBar}>
            <p aria-live='polite'><span>MY MOOD TODAY</span><strong>{currentMood.label}</strong></p>
            <Link to={`/recommend?mood=${selectedMood}`} className={styles.cta}>나의 콘텐츠 찾기 <span aria-hidden='true'>↗</span></Link>
          </div>
        </section>

        <section className={styles.collections} aria-labelledby='collection-title'>
          <div className={styles.sectionHead}>
            <div><p className={styles.eyebrow}>CHAPTER 02 / THE LITTLE FINDS</p><h2 id='collection-title'>이런 순간에는, 이런 취향.</h2></div>
            <p>어디서 시작할지 모르겠다면,<br />마음이 가는 장면부터.</p>
          </div>
          <div className={styles.collectionGrid}>
            {collections.map((item) => (
              <Link key={item.type} to={`/recommend?mood=${item.mood}&type=${item.type}`} className={styles.collectionCard}>
                <div className={`${styles.collectionArt} ${styles[item.art]}`} aria-hidden='true'>
                  <span className={styles.collectionLabel}>{item.label}</span>
                  {item.art === 'cinema' && <FilmStrip className={styles.miniFilm} />}
                  {item.art === 'music' && <><span className={styles.albumSleeve} /><RecordArtwork className={styles.collectionRecord} /></>}
                  {item.art === 'book' && <BookArtwork className={styles.readingStack} />}
                  <span className={styles.collectionArtNumber}>NO. {item.number}</span>
                </div>
                <div className={styles.collectionBody}><span className={styles.category}>{item.category}</span><h3>{item.title}<span aria-hidden='true'>↗</span></h3><p>{item.description}</p></div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.closing}>
          <span className={styles.closingStamp} aria-hidden='true'>a little<br /><em>pickly.</em><span>✳</span></span>
          <div><p className={styles.eyebrow}>LESS SCROLLING, MORE FEELING</p><h2>고민은 짧게,<br />좋아하는 순간은 길게.</h2><p>기분과 취향을 알려주면, Pickly가 추천 이유와 함께 골라드려요.</p></div>
          <Link to={`/recommend?mood=${selectedMood}`}>오늘의 Pick 만나기 <span aria-hidden='true'>↗</span></Link>
        </section>
      </main>
    </>
  )
}

export default Home
