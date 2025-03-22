import { Link, useNavigate } from "react-router-dom";
import styles from "./loginPanel.module.css";
import { useState } from "react";
import axios from "axios";

export default function LoginPanel() {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.userEmail || !formData.userPassword) {
      setError("Вы пропустили поля для заполнения");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      setError("Некорректный email");
      return;
    }

    if (formData.userPassword.length < 5) {
      setError("Пароль должен быть длиннее 5 символов");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/login", {
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/profile"); // Используйте navigate здесь
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Ошибка входа в аккаунт");
      } else {
        setError("Ошибка при отправке запроса");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPanel}>
      <form className={styles.formData} onSubmit={loginUser}>
        <div className={styles.inputs}>
          <label htmlFor="userEmail"></label>
          <input
            onChange={handleInputChange}
            value={formData.userEmail}
            placeholder="@"
            name="userEmail"
            type="email"
          />
          <label htmlFor="userPassword"></label>
          <input
            onChange={handleInputChange}
            value={formData.userPassword}
            placeholder="Passw*rd"
            name="userPassword"
            type="password"
          />
          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}
        </div>
        <div className={styles.buttons}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "login"}
          </button>
          <button type="button" className={styles.registrationButton}>
            <Link to="/registration">registration</Link>
          </button>
        </div>
      </form>
    </div>
  );
}
