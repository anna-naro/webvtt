import { CueItem } from "../CueItem/CueItem";

export function CuesList({ cues, track }) {
  return (
    <div>
      {cues.map((cue) => {
        const removeCue = () => {
          track.removeCue(cue);
        };

        return <CueItem key={cue.id} cue={cue} removeCue={removeCue} />;
      })}
    </div>
  );
}
