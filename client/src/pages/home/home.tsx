import Header from "../../components/layout/header/header";
import Nav from "../../components/layout/navPanel/nav";
import News from "../../components/layout/news/news";
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
