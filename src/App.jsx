import { useCallback, useEffect, useRef, useState } from "react";
import { CuesList } from "./components/CuesList/CuesList";
import Hls from "hls.js";
import { stringifyVtt } from "./utils/stringify/stringifyVtt";

//https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt

function App() {
  const trackRef = useRef({});
  const audioRef = useRef();
  const videoRef = useRef();

  const [activeCue, setActiveCue] = useState("");
  const [cues, setCues] = useState([]);
  const [vttString, setVttString] = useState("");

  const initializeHls = useCallback(() => {
    var hls = new Hls();

    hls.loadSource("http://localhost:3000/closeCaptionsMedia/silence.m3u8");

    hls.attachMedia(audioRef.current);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      audioRef.current.play();
    });
  }, [audioRef]);

  useEffect(() => {
    initializeHls();
  }, [initializeHls]);

  useEffect(() => {
    const { track } = trackRef.current;

    trackRef.current.onload = () => {
      if(track.cues) setCues([...track.cues]);
    };

    track.addEventListener("cuechange", onCueChange);

    return () => {
      track.removeEventListener("cuechange", onCueChange);
    };
  }, [trackRef]);

  const updateCuesState = () => {
    setCues([...trackRef.current.track.cues]);
  };

  const addCaption = (cueDetails, shouldUpdateCuesState = true) => {
    const {startTime, endTime, text, id} = cueDetails;

    const cue = new VTTCue(startTime, endTime, text);
    if(id) cue.id = id;

    trackRef.current.track.addCue(cue);

    if(shouldUpdateCuesState) updateCuesState();
  };

  const deleteCaption = (removedCue, shouldUpdateCuesState = true) => {
    trackRef.current.track.removeCue(removedCue);

    if(shouldUpdateCuesState) updateCuesState();
  };

  const updateCaption = () => {

    [...trackRef.current.track.cues].forEach((cue, index) => {
      const modifiedCue = trackRef.current.track.cues.getCueById(cue.id);

      deleteCaption(modifiedCue, false);
      modifiedCue.text = `my name is anna ${index}`;
      addCaption(modifiedCue, false);
    })

    updateCuesState();
  };

  const toggleCaptionPosition = () => {
    [...trackRef.current.track.cues].forEach(cue => {
      if (cue.line === "auto") cue.line = -1;

      if (cue.line === 0) cue.line = -1;
      else cue.line = 0;
    })

    updateCuesState()
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

    audioRef.current.style.margin = `calc((${video.height}px - ${audioRef.current.style.height}) / 2) calc((${video.width}px - ${audioRef.current.style.width}) / 2)`;
  };

  const onCueChange = () => {
    const activeCues = trackRef.current.track.activeCues;
    setActiveCue(activeCues[0]?.text || "");
  };

  const stringifyCues = () => {
    const string = stringifyVtt(cues);

    setVttString(string);
    console.log(string);
  };

  return (
    <main>

      <div style={{ display: "flex", position: "relative" }}>
          <video width={900} ref={videoRef} autoPlay={true}>
          <source src="https://wsc-sports.video/dyvh"></source>
        </video>

        <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
          <video
            muted
            id="video"
            ref={audioRef}
            style={{ width: 900, height: 506.25, border: "2px solid red" }}
          >
            <track
              default
              kind="captions"
              src="subtitles.vtt"
              srcLang="en"
              label="captions"
              ref={trackRef}
            />
          </video>
        </div>

        <div style={{width: '300px', display: 'flex', flexDirection: 'column', marginLeft: '50px' }}>
          <button onClick={() => addCaption({id: Math.random(), startTime: 8, endTime: 12,text: "this is a test"})}>
            Add Caption (add text from 8 to 12 seconds)
          </button>

          <button onClick={() => deleteCaption(trackRef.current.track.cues.getCueById(cues[0].id))}>
            Delete Caption (delete text from 2 to 5 seconds)
          </button>

          <button onClick={updateCaption} style={{marginBottom: '10px'}}>
            Update Caption (update text from 0 to 2 seconds)
          </button>

          <button onClick={toggleCaptionPosition} style={{marginBottom: '10px'}}>
            Toggle Caption Position (text from 0 to 2 seconds)
          </button>

          <button onClick={() => changeSize("16:9")} style={{marginBottom: '10px'}}>16:9</button>
          <button onClick={() => changeSize("9:16")} style={{marginBottom: '10px'}}>9:16</button>
          <button onClick={() => changeSize("")} style={{marginBottom: '10px'}}>None</button>

          <button onClick={stringifyCues} style={{marginBottom: '10px'}}>vtt to string</button>
        </div>
      </div>

      <div>
        <p>Current text: {activeCue}</p>
      </div>

      <pre style={{}}>{vttString}</pre>

      {/* <AddCueForm addCue={addCue} /> */}
      <CuesList
        cues={cues}
        track={trackRef.current.track}
        // removeCue={removeCue}
        // updateCueText={updateCueText}
      />
    </main>
  );
}

export default App;
