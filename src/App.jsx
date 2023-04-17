import React from 'react';

function App() {
  return (
    <video id="video" controls width={900}>
      <source
        src="https://wsc-sports.video/k3y9"
        type="video/mp4"
      />
      <track default kind="subtitles" src='subtitles.vtt' srclang="en" label='Subtitles'/>
    </video>
  );
}

export default App;
