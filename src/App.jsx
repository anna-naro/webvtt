import { useEffect, useRef, useState } from "react";
import { CuesList } from "./components/CuesList/CuesList";

function App() {
  const trackRef = useRef({});
  const videoRef = useRef();
  const [activeCue, setActiveCue] = useState("");
  const [cues, setCues] = useState([]);

  useEffect(() => {
    const { track } = trackRef.current;

    setTimeout(() => {
      setCues(Array.from(track.cues));
    }, 80);

    track.addEventListener("cuechange", onCueChange);

    return () => {
      track.removeEventListener("cuechange", onCueChange);
    };
  }, [trackRef]);

  const addCaption = () => {
    const cue = new VTTCue(8, 12, "this is a test");
    trackRef.current.track.addCue(cue);
  };

  const deleteCaption = () => {
    const cue = trackRef.current.track.cues[1];
    trackRef.current.track.removeCue(cue);
  };

  const updateCaption = () => {
    const cue = trackRef.current.track.cues[0];
    cue.text = "my name is anna";
  };

  const onCueChange = () => {
    const activeCues = trackRef.current.track.activeCues;
    setActiveCue(activeCues[0]?.text || "");
  };

  return (
    <main style={{ display: "flex", flexDirection: "column" }}>
      <video id="video" controls width={900} ref={videoRef}>
        <source src="https://wsc-sports.video/k3y9" type="video/mp4" />

        <track
          default
          kind="subtitles"
          src="subtitles.vtt"
          srcLang="en"
          label="Subtitles"
          ref={trackRef}
        />
      </video>

      <button onClick={addCaption}>
        Add Caption (add text from 8 to 12 seconds)
      </button>

      <button onClick={deleteCaption}>
        Delete Caption (delete text from 2 to 5 seconds)
      </button>

      <button onClick={updateCaption}>
        Update Caption (update text from 0 to 2 seconds)
      </button>

      <div>
        <p>Current text: {activeCue}</p>
      </div>

      <CuesList cues={cues} track={trackRef.current.track} />
    </main>
  );
}

export default App;
