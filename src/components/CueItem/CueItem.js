import { useState } from "react";
import styles from "./CueItem.module.css";

export const CueItem = ({ cue, removeCue }) => {
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
    cue.text = text;
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div>{cue.id}</div>|<div>{cue.startTime}</div>|<div>{cue.endTime}</div>|
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
        <button onClick={removeCue}>Delete</button>
      </div>
    </div>
  );
};
