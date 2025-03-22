//functional components
import { Link } from "react-router-dom";
//styles
import styles from "./header.module.css";
//icons
import { FaCloud } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");

  const clearSearchBar = () => {
    setSearchValue("");
  };

  return (
    <header className={styles.header}>
      <div className={styles.IconPanel}>
        <Link to="/">
          <FaCloud className="" />
        </Link>
        <p className={`${styles.nunito} ${styles.text}`}>Agapium</p>
      </div>

      <div className={styles.searchPanel}>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="text"
          placeholder="Something else?"
        />
        {searchValue != "" && (
          <button onClick={clearSearchBar} className={styles.button}>
            <RxCross2 />
          </button>
        )}
        <button className={`${styles.button} ${styles.searchButton}`}>
          <IoSearchOutline />
        </button>
      </div>

      <div className={styles.userAccountPanel}>
        <Link to="/registration">
          <FaUserAlt />
        </Link>
      </div>
    </header>
  );
}
