import { useCallback, useEffect, useRef, useState } from "react";
import { CuesList } from "./components/CuesList/CuesList";
import { WebVTTParser, WebVTTSerializer } from "webvtt-parser";
import { AddCueForm } from "./components/AddCueForm/AddCueForm";
import { CustomVTTCue } from "./utils/CustomVTTCue";
import Hls from "hls.js";

//https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt
const vttSerializer = new WebVTTSerializer();
const vttParser = new WebVTTParser();

function App() {
  const trackRef = useRef({});
  const audioRef = useRef();
  const videoRef = useRef();

  const [activeCue, setActiveCue] = useState("");
  const [cues, setCues] = useState([]);
  const [vttSrc, setVttSrc] = useState("");

  const initializeHls = useCallback(() => {
    var hls = new Hls();
    
    hls.loadSource('http://localhost:3000/closeCaptionsMedia/silence.m3u8');
    
    hls.attachMedia(audioRef.current);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      audioRef.current.play();
    });
  }, [audioRef])

  useEffect(() => {
    async function load() {
      const vttTree = vttParser.parse(
        await fetch("subtitles.vtt").then((res) => res.text()),
        "metadata"
      );

      console.log('vttTree.cues',vttTree.cues);

      setCues(vttTree.cues);
    }

    load();

    initializeHls();
  }, [initializeHls]);

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
    setCues((prevCues) => {
      const newCustomCue = new CustomVTTCue({id: prevCues.length + 1, startTime: 8, endTime: 12, text:"this is a test"});
      const newCue = new VTTCue(newCustomCue.startTime, newCustomCue.endTime, newCustomCue.text);

      newCue.id = newCustomCue.id;
      trackRef.current.track.addCue(newCue);

      return [...prevCues, newCustomCue]});
  };

  const deleteCaption = () => {
    const removedCue = trackRef.current.track.cues[1];
    trackRef.current.track.removeCue(removedCue);
    setCues((prevState) => prevState.filter((cue) => cue.id !== removedCue.id));
  };

  const updateCaption = () => {
    const newText = 'my name is anna'
    
    const cue = trackRef.current.track.cues[0];
    cue.text = newText;

    setCues((prevCues) => {
      prevCues[0].text = newText;
      
      return [...prevCues];
    })
  };

  const toggleCaptionPosition = () => {
    const cue = trackRef.current.track.cues[0];

    if(cue.line === 'auto') cue.line = -1;
    
    if(cue.line === 0) cue.line = -1;
    else cue.line = 0;
  };

  const changeSize = (ratio) => {
    const video = videoRef.current.getBoundingClientRect();

    switch (ratio) {
      case "16:9":
        audioRef.current.style.width = `${video.width * 0.6}px`;
        audioRef.current.style.height = `calc(${audioRef.current.style.width}  * 9/16)`;
        break;
        
        case "9:16":
          audioRef.current.style.height = `${video.height * 0.6}px`;
        audioRef.current.style.width = `calc(${audioRef.current.style.height} * 9/16)`;
        break;

      default:
        audioRef.current.style.height = `${video.height}px`;
        audioRef.current.style.width = `${video.width}px`;
        break;
    }

    audioRef.current.style.margin = `calc((${video.height}px - ${audioRef.current.style.height}) / 2) calc((${video.width}px - ${audioRef.current.style.width}) / 2)`
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
    <main style={{ display: "flex", flexDirection: "column", position: 'relative', }}>
      <video width={900} ref={videoRef}>
        <source src="https://wsc-sports.video/dyvh"></source>
      </video>

      <div style={{position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <video muted id="video" ref={audioRef} style={{width: 900, height: 506.25, border: '2px solid red'}}>
          <track
            default
            kind="captions"
            // src="subtitles.vtt"
            src={vttSrc}
            srcLang="en"
            label="captions"
            ref={trackRef}
          />
        </video>
      </div>

      <button onClick={addCaption}>
        Add Caption (add text from 8 to 12 seconds)
      </button>

      <button onClick={deleteCaption}>
        Delete Caption (delete text from 2 to 5 seconds)
      </button>

      <button onClick={updateCaption}>
        Update Caption (update text from 0 to 2 seconds)
      </button>

      <button onClick={toggleCaptionPosition}>
        Toggle Caption Position (text from 0 to 2 seconds)
      </button>

      <button onClick={() => changeSize("16:9")}>16:9</button>
      <button onClick={() => changeSize("9:16")}>9:16</button>
      <button onClick={() => changeSize('')}>None</button>

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
