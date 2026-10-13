import RecommendationCard from './RecommendationCard.jsx'

const RecommendationList = ({ items = [] }) => {
  if (items.length === 0) {
    return <p>추천 결과가 없습니다.</p>
  }

  return (
    <div className="recommendation-list">
      {items.map((item) => (
        <RecommendationCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default RecommendationList
