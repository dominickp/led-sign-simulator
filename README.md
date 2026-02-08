# LED Wall Simulator

This document outlines the scope and technical specifications for the LED Wall Simulator, a web-based tool designed to help you preview music visualizations with hardware-level accuracy.

1. Project Overview
The LED Wall Simulator is a front-end application that transforms standard video files into a simulated LED matrix display. It allows users to visualize how low-resolution content (e.g., 256x256) looks when rendered on physical diodes, accounting for pixel pitch (the gap between LEDs) and light emission characteristics.

2. Functional Requirements
    - Local Video Playback: Users must be able to load local .mp4, .mov, or .webm files via the browser’s File API without uploading data to a server.
    - Configurable panel size: Allow the user to change different aspect ratios and grid sizes (e.g. 128x256 vs 512x512)
    - Resolution Simulation: The tool must downsample or map video input to specific LED grid sizes (e.g., 64x64, 128x128, or 256x256).
    - Physical Pitch Control: A slider to adjust the "gap" between simulated LEDs to mimic different density panels (e.g., P3 vs. P6).
    - Transport Controls: Basic Play/Pause functionality and audio output from the source video.
    - Visual Fidelity: Real-time rendering of circular diodes and (optional) light bloom/glow to simulate high-brightness emitters.

1. Technical Architecture

The app is built as a Single Page Application (SPA) using a "Web-First" approach to ensure accessibility and zero installation.

A. Core Technologies

    - p5.js (WEBGL Mode): Acts as the primary engine for canvas management and video handling.
    - GLSL (OpenGL Shading Language): Handles the "heavy lifting" by using a Fragment Shader to render thousands of LEDs simultaneously on the GPU.
    - Web File API: Uses URL.createObjectURL to map local disk files to browser memory for instant playback.

B. Rendering Pipeline

    - Input Layer: Video is drawn to a hidden "source" buffer at its native resolution.
    - Processing Layer: The Fragment Shader divides the screen into a grid based on the ledCount variable. It samples a single color from the center of each grid cell to ensure 1:1 pixel accuracy.
    - Output Layer: A mathematical mask is applied to each cell to draw a circle. The area outside the circle is rendered as black to simulate the panel's substrate.


1. Development Roadmap

    Phase 1 (MVP): Basic p5.js sketch with file uploader, 256x256 grid, and "pitch" slider. (Current Stage)

    Phase 2 (UX): Add "Wall Preset" buttons (e.g., "P3 128x128", "P6 256x256") and a scrubbable timeline.

    Phase 3 (Polishing): Implement the Bloom Shader for realistic night-room lighting and a "Fullscreen" preview mode.
