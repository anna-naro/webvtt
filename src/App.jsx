import { useEffect, useRef, useState } from "react";
import { CuesList } from "./components/CuesList/CuesList";
import { WebVTTParser, WebVTTSerializer } from "webvtt-parser";
import { AddCueForm } from "./components/AddCueForm/AddCueForm";
import { CustomVTTCue } from "./utils/CustomVTTCue";

//https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt
const vttSerializer = new WebVTTSerializer();
const vttParser = new WebVTTParser();

function App() {
  const trackRef = useRef({});
  const videoRef = useRef();
  const [activeCue, setActiveCue] = useState("");
  const [cues, setCues] = useState([]);
  const [vttSrc, setVttSrc] = useState("");

  useEffect(() => {
    async function load() {
      const vttTree = vttParser.parse(
        await fetch("subtitles.vtt").then((res) => res.text()),
        "metadata"
      );

      setCues(vttTree.cues);
    }

    load();
  }, []);

  useEffect(() => {
    const { track } = trackRef.current;

    track.addEventListener("cuechange", onCueChange);

    return () => {
      track.removeEventListener("cuechange", onCueChange);
    };
  }, [trackRef]);

  useEffect(() => {
    if (!cues.length) return;

    console.log(cues);

    const blob = new Blob([vttSerializer.serialize(cues)], {
      type: "text/plain",
    });
    const trackSrc = URL.createObjectURL(blob);

    setVttSrc(trackSrc);
  }, [cues]);

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

  const removeCue = (id) => () => {
    setCues((prevState) => prevState.filter((cue) => cue.id !== id));
  };

  const updateCueText = (id, newText) => {
    setCues((prevState) => {
      const index = prevState.findIndex((cue) => cue.id === id);

      const newState = [...prevState];
      newState[index].text = newText;
      newState[index].tree.children[0].value = newText;

      return newState;
    });
  };

  const addCue = (options) => {
    setCues((prevState) => [
      ...prevState,
      new CustomVTTCue({ ...options, id: prevState.length + 1 }),
    ]);
  };

  return (
    <main style={{ display: "flex", flexDirection: "column" }}>
      <video muted id="video" controls width={900} ref={videoRef}>
        <source src="https://wsc-sports.video/k3y9" type="video/mp4" />

        <track
          default
          kind="subtitles"
          // src="subtitles.vtt"
          src={vttSrc}
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

      <AddCueForm addCue={addCue} />
      <CuesList
        cues={cues}
        track={trackRef.current.track}
        removeCue={removeCue}
        updateCueText={updateCueText}
      />
    </main>
  );
}

export default App;
