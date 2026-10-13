const RecommendationCard = ({ item }) => {
  return (
    <div className="recommendation-card">
      <img src={item.image} alt={item.title} />
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  )
}

export default RecommendationCard
