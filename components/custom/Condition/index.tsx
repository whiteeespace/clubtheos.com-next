import classNames from "classnames";

import styles from "./styles.module.scss";

const CONDITION_OPTIONS = ["fair", "good", "very good", "excellent", "new"];

const getConditionDescription = (value: string) => {
  switch (value) {
    case "fair":
      return "Fair: Item shows significant wear and tear with major flaws";
    case "good":
      return "Good: Item exhibits moderate wear and tear with visible flaws.";
    case "very good":
      return "Very good: Item shows minor signs of wear and tear.";
    case "excellent":
      return "Excellent: Item is in excellent condition with minimal, insignificant flaws.";
    case "new":
      return "New: Item is brand new.";
    default:
      throw new Error("Invalid condition value");
  }
};

interface ConditionProps {
  value?: string;
  className?: string;
}

export const Condition: React.FC<ConditionProps> = ({ value, className }) => {
  if (!value) return null;

  const description = getConditionDescription(value);

  return (
    <div className={styles["container"]}>
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
      <p>{description}</p>
    </div>
  );
};
