import classNames from "classnames";

import styles from "./styles.module.scss";

const CONDITION_OPTIONS = ["fair", "good", "very good", "excellent", "new"];

interface ConditionProps {
  value?: string;
  className?: string;
}

export const Condition: React.FC<ConditionProps> = ({ value, className }) => {
  if (!value) return null;

  return (
    <div className={classNames(styles["condition-container"], className)}>
      <ul className={styles.conditions}>
        {CONDITION_OPTIONS.map((option) => (
          <li
            key={option}
            className={classNames(styles.condition, {
              [styles["condition--active"]]: value === option,
            })}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};
