const MoodIcon = ({ mood }) => (
  <svg width='40' height='40' viewBox='0 0 40 40' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    {mood === 'calm' && <><path d='M29 26A14 14 0 0 1 15 7a14 14 0 1 0 14 19Z' /><path d='M29 6v8m-4-4h8M34 20v4m-2-2h4' /></>}
    {mood === 'bright' && <><circle cx='20' cy='20' r='8' /><path d='M20 3v5m0 24v5M3 20h5m24 0h5M8 8l4 4m16 16 4 4M32 8l-4 4M12 28l-4 4' /></>}
    {mood === 'emotion' && <><path d='M20 33S5 24 5 14a8 8 0 0 1 15-4 8 8 0 0 1 15 4c0 10-15 19-15 19Z' /><path d='M10 16c0-3 2-5 5-5' /></>}
    {mood === 'exciting' && <><path d='m20 3 5 12 12 5-12 5-5 12-5-12-12-5 12-5Z' /><path d='m32 3 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z' /></>}
  </svg>
)

export default MoodIcon
