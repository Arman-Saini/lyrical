import { useBackground } from '../../hooks/useBackground'
import styles from './BackgroundLayer.module.css'

export default function BackgroundLayer() {
  const { bgUrl, overlayOpacity } = useBackground()

  return (
    <>
      {bgUrl && (
        <div
          className={styles.bg}
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      )}
      <div
        className={styles.overlay}
        style={{ opacity: overlayOpacity }}
      />
    </>
  )
}
