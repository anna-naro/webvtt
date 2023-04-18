import { CueItem } from "../CueItem/CueItem";
import styles from "./CuesList.module.css";

export function CuesList({ cues, removeCue, updateCueText }) {
  return (
    <div className={styles.container}>
      {cues.map((cue) => (
        <CueItem
          key={cue.id}
          cue={cue}
          removeCue={removeCue}
          updateCueText={updateCueText}
        />
      ))}
    </div>
  );
}
