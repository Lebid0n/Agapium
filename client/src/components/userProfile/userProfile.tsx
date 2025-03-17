import React, { useEffect, useState } from "react";
import styles from "./userProfile.module.css";
import test from "../../assets/picture1.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface DecodedToken {
  userName: string;
  exp: number;
  userId: number;
}

export default function UserProfile() {
  const [userName, setUserName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false); // Добавляем состояние для отслеживания загрузки аватара

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

  useEffect(() => {
    if (userId) {
      fetchAvatar(userId);
    }
  }, [userId]);

  const fetchAvatar = async (userId: number) => {
    setLoadingAvatar(true); // Начинаем загрузку
    try {
      const response = await axios.get(`/api/user/avatar/${userId}`);
      setAvatarUrl(response.data.avatarUrl);
    } catch (error: any) {
      console.error("Failed to fetch avatar:", error);
      // Обработка ошибки, например, показ дефолтного изображения
      setAvatarUrl(null); // Сбрасываем avatarUrl, чтобы отобразить дефолтное изображение
    } finally {
      setLoadingAvatar(false); // Заканчиваем загрузку
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    console.log("Кнопка нажата!");

    if (!selectedFile) {
      alert("Нужно выбрать файл для загрузки аватара!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const token = localStorage.getItem("token");

    try {
      console.log("Отправляю запрос на /profile/avatar...");
      const response = await axios.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Успешный ответ:", response);
      setAvatarUrl(response.data.avatarUrl);
      alert("Аватар успешно обновлен!");
    } catch (error: any) {
      console.error("Ошибка при загрузке аватара:", error);
      alert("Ошибка при загрузке аватара: " + error.message);
    }
  };

  return (
    <div className={styles.userProfilePanel}>
      <div className={styles.userImgs}>
        <img className={styles.userHat} src={test} alt="Шапка профиля" />
        {loadingAvatar ? (
          <p>Загрузка аватара...</p>
        ) : (
          <img className={styles.avatar} src={avatarUrl || test} alt="Аватар" />
        )}
      </div>
      <div className={styles.userData}>
        <div className={styles.userInfo}>
          <p>{userName || "Загрузка..."}</p>
        </div>
        <div className={styles.settingsPanel}>
          <label htmlFor="avatarChanger">Сменить аватар:</label>
          <input name="avatarChanger" type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Обновить</button>
        </div>
      </div>
    </div>
  );
}
