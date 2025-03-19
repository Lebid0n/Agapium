import { useEffect, useState } from "react";
import styles from "./userProfile.module.css";
import test from "../../assets/picture1.png";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userName: string;
  exp: number;
  userId: number;
}

export default function UserProfile() {
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserName(decoded.userName);
        setUserId(decoded.userId);
      } catch (err) {
        console.error("Ошибка при декодировании токена:", err);
      }
    }
  }, []);

  return (
    <div className={styles.userProfilePanel}>
      <div className={styles.userImgs}>
        <img className={styles.userHat} src={test} alt="Шапка профиля" />
        <img className={styles.avatar} src={test} alt="Аватар" />
      </div>
      <div className={styles.userData}>
        <div className={styles.userInfo}>
          <p>{userName || "Загрузка..."}</p>
        </div>
        <div className={styles.userLinks}></div>
        <div className={styles.userPosts}></div>
      </div>
    </div>
  );
}
