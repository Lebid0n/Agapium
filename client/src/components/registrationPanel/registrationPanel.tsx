import { useState } from "react";
import axios from "axios";
import styles from "./registrationPanel.module.css";
import { z } from "zod";
import { Link } from "react-router-dom";

// Схема валидации с использованием Zod
const validationSchema = z
  .object({
    userName: z.string().min(5, "Имя должно быть длиннее 5 символов"),
    userEmail: z.string().email("Некорректный email"),
    userPassword: z.string().min(5, "Пароль должен быть длиннее 5 символов"),
    repeatPassword: z.string(),
  })
  .refine((data) => data.userPassword === data.repeatPassword, {
    message: "Пароли не совпадают",
    path: ["repeatPassword"], // Указываем, к какому полю относится ошибка
  });

export default function RegistrationPanel() {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createNewUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    try {
      validationSchema.parse(formData);

      const response = await axios.post("http://localhost:5000/register", {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
      });

      if (response.status === 201) {
        setError("");
        setSuccess("Регистрация прошла успешно!");
        setFormData({
          userName: "",
          userEmail: "",
          userPassword: "",
          repeatPassword: "",
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors.map((e) => e.message).join(", "));
      } else if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Ошибка при регистрации");
      } else {
        setError("Ошибка при отправке запроса");
      }
    }
  };

  return (
    <div className={styles.registrationPanel}>
      <form className={styles.formData} onSubmit={createNewUser}>
        <div className={styles.inputs}>
          <label htmlFor="userName"></label>
          <input
            onChange={handleInputChange}
            value={formData.userName}
            placeholder="name"
            name="userName"
            type="text"
          />
          <label htmlFor="userEmail"></label>
          <input
            onChange={handleInputChange}
            value={formData.userEmail}
            placeholder="email"
            name="userEmail"
            type="email"
          />
          <label htmlFor="userPassword"></label>
          <input
            onChange={handleInputChange}
            value={formData.userPassword}
            placeholder="password"
            name="userPassword"
            type="password"
          />
          <label htmlFor="repeatPassword"></label>
          <input
            onChange={handleInputChange}
            value={formData.repeatPassword}
            placeholder="repeat ur password"
            name="repeatPassword"
            type="password"
          />
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.saveButton}>
            save
          </button>
          <button type="button" className={styles.loginButton}>
            <Link to="/login">login</Link>
          </button>
        </div>
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className={styles.success}>
            <p>{success}</p>
          </div>
        )}
      </form>
    </div>
  );
}
