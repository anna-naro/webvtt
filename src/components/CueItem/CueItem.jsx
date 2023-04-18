import { useState } from "react";
import styles from "./CueItem.module.css";
import { formatVttTime } from "../../utils/formatVttTime";

export const CueItem = ({ cue, removeCue, updateCueText }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(cue.text);

  const startEditing = () => {
    setIsEditing(true);
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") onSave();
  };

  const onSave = () => {
    updateCueText(cue.id, text);
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div>{cue.id}</div>|<div>{formatVttTime(cue.startTime)}</div>|
        <div>{formatVttTime(cue.endTime)}</div>|
        {isEditing ? (
          <input
            value={text}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={styles.input}
          />
        ) : (
          <div>{cue.text}</div>
        )}
      </div>

      <div>
        {isEditing ? (
          <button key="save" onClick={onSave}>
            Save
          </button>
        ) : (
          <button key="edit" onClick={startEditing}>
            Edit
          </button>
        )}
        <button onClick={removeCue(cue.id)}>Delete</button>
      </div>
    </div>
  );
};
