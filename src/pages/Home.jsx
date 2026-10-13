import React from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import Style from './Home.module.scss'

const features = [
  {title : '간단한 취향 입력',
    description : '좋아하는 장르의 분위기를 입력해 보세요'
  },
  {title : '맞춤형 콘텐츠 추천',
    description : '좋아하는 장르의 분위기를 입력해 보세요'
  },
  {title : '새로운 취향 발견',
    description : '좋아하는 장르의 분위기를 입력해 보세요'
  },
]
const sampleData = [
  {category : '영화', title : '따뜻한 분위기 영화', description : '편안한 주말에 보기 좋아요'},
  {category : '음악', title : '집중할때 듣는 음악', description : '편안한 주말에 보기 좋아요'},
  {category : '도서', title : '마음이 즐거워지는 책', description : '편안한 주말에 보기 좋아요'},
]

const swatchStyles = {
  '영화': Style.swatchRed,
  '음악': Style.swatchBlue,
  '도서': Style.swatchBrown,
}

const Home = () => {
  return (
    <>
    <Helmet>

    <title>miq | 나에게 맞는 콘텐츠 추천</title>

    <meta name='description'
      content='취향과 기분을 입력하고 나에게 어울리는 영화,음악,애니'/>
    <meta name="robbts" content='index,follow'/>

    </Helmet>

    <main className={Style.home}>

      <section className={Style.hero}>
        <p className={Style.eyebrow}>my page</p>
        <h2 className={Style.heroTitle}>나에게 알맞는 콘텐츠를 찾아보세요 </h2>
        <p className={Style.heroText}>미큐는 당신 취향을 바탕으로 미디어 콘텐츠를 추천해드립니다.</p>
        <Link to='recommend' className={Style.cta}>추천 시작하기</Link>
      </section>

      <section className={Style.about}>
        <p className={Style.eyebrow}>about miq</p>
        <h2 className={Style.sectionTitle}>미큐는 어떤 서비스인가요?</h2>
        <p className={Style.sectionText}>미큐는 간단한 취향을 입력받아서 지금의 나에게 어울리는 콘텐츠를 찾아</p>
      </section>

      <section className={Style.features}>
        <div className={Style.sectionHead}>
          <p className={Style.eyebrow}>miq</p>
          <h2 className={Style.sectionTitle}>미큐의 특별한 점</h2>
        </div>
        <div className={Style.grid}>
          {
            features.map((item)=>(
              <article key={item.title} className={Style.card}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))
          }
        </div>
      </section>

      <section className={Style.popular}>
        <div className={Style.sectionHead}>
          <p className={Style.eyebrow}>POPULAR CONTENTS</p>
          <h2 className={Style.sectionTitle}>인기 콘텐츠 예시</h2>
        </div>
        <div className={Style.grid}>
          {
            sampleData.map((item)=>(
              <article key={item.title} className={Style.swatchCard}>
                <div className={`${Style.swatch} ${swatchStyles[item.category] ?? Style.swatchRed}`}>
                  <span className={Style.swatchLabel}>{item.category}</span>
                </div>
                <div className={Style.swatchBody}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))
          }
        </div>
      </section>

    </main>

    </>
  )
}

export default Home

//<Helmet><title><meta>검색엔진
