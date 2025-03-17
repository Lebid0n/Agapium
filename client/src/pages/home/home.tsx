import Header from "../../components/header/header";
import Nav from "../../components/navPanel/nav";
import News from "../../components/news/news";
//styles
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className={styles.content}>
        <Nav />
        <News />
      </div>
    </>
  );
}
