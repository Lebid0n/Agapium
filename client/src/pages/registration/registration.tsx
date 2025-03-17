import RegistrationPanel from "../../components/registrationPanel/registrationPanel";

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
