import LoginPanel from "../../components/auth/loginPanel/loginPanel";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <LoginPanel></LoginPanel>
    </div>
  );
}
