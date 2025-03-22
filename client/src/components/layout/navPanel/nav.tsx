import styles from "./nav.module.css";

export default function Nav() {
  return (
    <nav className={`${styles.nav} ${styles.nunito}`}>
      <ul>
        <li>profile</li>
        <li>news</li>
        <li>settings</li>
        <li>exit</li>
      </ul>
      <button className={styles.nunito}>close</button>
    </nav>
  );
}
