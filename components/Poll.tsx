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
  const answered = !!answer;
  const correct = answered && options[answer];
  const wrong = answered && !correct;

  if (!options) {
    return null;
  }

  const className = classNames(styles.poll, {
    [styles.required]: required,
    [styles.answered]: answered,
    [styles.wrong]: wrong,
    [styles.correct]: correct,
  });

  const pickOption = (text: string) => !answered && setAnswer(text);

  return (
    <div className={className}>
      <ul className={styles.options}>
        {Object.keys(options).map((text) => (
          <li
            key={text}
            onClick={() => pickOption(text)}
            className={classNames(styles.option, {
              [styles.selected]: text === answer,
              [styles.correctAnswer]: wrong && options[text],
            })}
          >
            {text}
          </li>
        ))}
      </ul>

      <div className={styles.response}>
        {correct && answer ? (
          correctResponse
        ) : !correct && answer ? (
          wrongResponse
        ) : (
          <>&nbsp;</>
        )}
      </div>
    </div>
  );
}
