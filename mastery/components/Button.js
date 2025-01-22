import styles from "../styles/components/Button.module.scss";

export default function Button({ type = "primary", onClick, children }) {
  return (
    <button
      className={`${styles.button} ${styles[`button--${type}`]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
