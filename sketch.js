let ledShader;
let img;
let video;
let pitchSlider;
let isVideoLoaded = false;
let ledCountSelect;
let timeline;
let timeDisplay;
let fullscreenBtn;

// The Shader Code (Vertex & Fragment)
const vs = `
    precision highp float;
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    void main() {
        vTexCoord = aTexCoord;
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
        gl_Position = positionVec4;
    }
`;

const fs = `
    precision highp float;
    varying vec2 vTexCoord;
    uniform sampler2D tex0;
    uniform vec2 resolution;
    uniform float ledCount; // e.g. 256.0
    uniform float pitch;    // size of the "dot"

    void main() {
        // 1. Create the grid coordinates
        vec2 grid = fract(vTexCoord * ledCount);
        vec2 cell = floor(vTexCoord * ledCount) / ledCount;

        // 2. Sample the video at the center of each "LED"
        vec4 col = texture2D(tex0, cell + (0.5/ledCount));

        // 3. Create the circular LED shape
        float dist = distance(grid, vec2(0.5));
        float radius = pitch;
        float softness = 0.03;
        float mask = 1.0 - smoothstep(radius - softness, radius + softness, dist);

        gl_FragColor = col * mask;
    }
`;

function setup() {
  let canvas = createCanvas(600, 600, WEBGL);
  canvas.parent("canvas-container");

  ledShader = createShader(vs, fs);

  // UI Elements
  pitchSlider = select("#pitchSlider");
  ledCountSelect = select("#ledCountSelect");
  timeline = select("#timeline");
  timeDisplay = select("#timeDisplay");
  fullscreenBtn = select('#fullscreenBtn');

  // File Handling
  select("#videoInput").elt.onchange = handleFile;
  select("#playBtn").mousePressed(toggleVideo);
  select('#presetP3').mousePressed(()=>{ ledCountSelect.elt.value = '128'; pitchSlider.elt.value = 0.18; });
  select('#presetP6').mousePressed(()=>{ ledCountSelect.elt.value = '256'; pitchSlider.elt.value = 0.18; });
  timeline.input(handleTimelineInput);
  fullscreenBtn.mousePressed(toggleFullscreen);
}

function handleFile(event) {
  const file = event.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    if (video) video.remove(); // Clean up previous

    video = createVideo(url, () => {
      video.volume(1);
      video.loop();
      video.hide();
      isVideoLoaded = true;
    });
  }
}

function toggleVideo() {
  if (!video) return;
  if (isVideoLoaded) {
    if (video.elt.paused) video.play();
    else video.pause();
  }
}

function handleTimelineInput() {
  if (!video || !isVideoLoaded) return;
  const t = parseFloat(timeline.elt.value);
  video.elt.currentTime = t;
}

function toggleFullscreen() {
  const el = document.querySelector('#canvas-container');
  if (!document.fullscreenElement) el.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function draw() {
  background(0);

  if (isVideoLoaded) {
    shader(ledShader);

    // Pass variables to the shader
    ledShader.setUniform("tex0", video);
    ledShader.setUniform("resolution", [width, height]);
    const ledCount = parseFloat(ledCountSelect.elt.value || 256);
    ledShader.setUniform("ledCount", ledCount);
    ledShader.setUniform("pitch", parseFloat(pitchSlider.elt.value));

    rect(0, 0, width, height);

    // Update timeline UI
    if (video.elt.duration && !isNaN(video.elt.duration)) {
      timeline.elt.max = video.elt.duration;
      timeline.elt.value = video.elt.currentTime;
      timeDisplay.html(formatTime(video.elt.currentTime) + ' / ' + formatTime(video.elt.duration));
    }
  }
}

function formatTime(seconds){
  if (!isFinite(seconds)) return '0:00';
  const s = Math.floor(seconds%60).toString().padStart(2,'0');
  const m = Math.floor(seconds/60);
  return m+':'+s;
}
