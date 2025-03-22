import styles from "./news.module.css";
import picture1 from "../../assets/picture1.png";

export default function News() {
  return (
    <>
      <main className={styles.newsPanel}>
        <div className={styles.post}>
          <img src={picture1} alt="there is some post" />
          <p>Нету бога, понимаешь?</p>
        </div>
      </main>
    </>
  );
}
