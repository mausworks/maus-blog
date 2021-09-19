import classNames from "classnames";
import { useState } from "react";
import styles from "./Poll.module.css";

export type PollOptions = {
  [text: string]: boolean;
};

export type PollProps = {
  options: PollOptions;
  required?: boolean;
  correctResponse?: string;
  wrongResponse?: string;
};

export function Poll({
  options,
  correctResponse = "Correct!",
  wrongResponse = "Wrong!",
  required = false,
}: PollProps) {
  const [answer, setAnswer] = useState<string>();
  const correct = !!answer && options[answer];

  if (!options) {
    return null;
  }

  const className = classNames(styles.poll, {
    [styles.required]: required,
    [styles.answered]: answer,
    [styles.correct]: correct,
  });

  return (
    <div className={className}>
      <ul className={styles.options}>
        {Object.keys(options).map((text) => (
          <li
            key={text}
            className={classNames(styles.option, {
              [styles.selected]: text === answer,
            })}
            onClick={() => setAnswer(text)}
          >
            {text}
          </li>
        ))}

        <div className={styles.response}>
          {correct && answer
            ? correctResponse
            : !correct && answer
            ? wrongResponse
            : null}
        </div>
      </ul>
    </div>
  );
}
