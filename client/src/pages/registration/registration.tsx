import RegistrationPanel from "../../components/auth/registrationPanel/registrationPanel";

import styles from "./registration.module.css";

export default function RegistrationPage() {
  return (
    <>
      <div className={styles.registrationPage}>
        <RegistrationPanel />
      </div>
    </>
  );
}
