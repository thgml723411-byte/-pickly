import { useState } from 'react'

const SearchForm = ({ onSubmit }) => {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(keyword)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="좋아하는 장르, 배우, 분위기를 입력하세요"
      />
      <button type="submit">추천받기</button>
    </form>
  )
}

export default SearchForm
