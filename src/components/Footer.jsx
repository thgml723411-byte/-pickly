import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div><p className={styles.logo}>pickly<span aria-hidden='true'>✳</span></p><p>오늘의 무드, 오늘의 발견.</p></div>
        <p>&copy; {new Date().getFullYear()} Pickly. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
