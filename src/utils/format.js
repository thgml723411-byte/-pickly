export function formatDate(date) {
  return new Date(date).toLocaleDateString('ko-KR')
}

export function truncate(text, length = 100) {
  return text.length > length ? `${text.slice(0, length)}...` : text
}
