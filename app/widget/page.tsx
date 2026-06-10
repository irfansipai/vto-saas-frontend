"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function WidgetPage() {
  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // Replaces your global `let currentStream`
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);

  // --- State ---
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [systemStatus, setSystemStatus] = useState("Waiting for user initialization...");
  const [trackingStatus, setTrackingStatus] = useState("Offline");

  // 1. Initialize MediaPipe Model (Runs once on load)
  useEffect(() => {
    const initializeModel = async () => {
      try {
        setSystemStatus("Downloading AI Model...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

        setModelLoaded(true);
        setSystemStatus("AI Ready. Waiting for camera permission.");
      } catch (error) {
        console.error(error);
        setSystemStatus("Error loading AI Model.");
      }
    };

    initializeModel();

    return () => {
      if (handLandmarkerRef.current) handLandmarkerRef.current.close();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Camera Permission & Enumeration Flow (Your 5-step logic)
  const initializeCameraSystem = async () => {
    try {
      setSystemStatus("Requesting permission to unlock camera labels...");
      
      // STEP 1: Dummy stream to trigger permission pop-up
      const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });

      // STEP 2: Enumerate devices now that permission is granted
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      
      // STEP 3: Populate State (React will automatically build the dropdown)
      setCameras(videoDevices);

      // STEP 4: Stop dummy stream
      initialStream.getTracks().forEach(track => track.stop());

      // STEP 5: Start the actual stream using the first device
      if (videoDevices.length > 0) {
        setSelectedCameraId(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error(error);
      setSystemStatus("Initialization failed. Permission denied.");
    }
  };

  // 3. Start Specific Stream (Triggered whenever selectedCameraId changes)
  useEffect(() => {
    if (!selectedCameraId) return;

    const startStream = async () => {
      setSystemStatus("Connecting to selected camera...");
      
      // Stop old stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCameraId } }
        });
        
        streamRef.current = newStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          // We don't play() yet, we wait for onLoadedData to ensure dimensions
        }
      } catch (error) {
        console.error("Failed to start camera:", error);
        setSystemStatus("Failed to start selected camera hardware.");
      }
    };

    startStream();
  }, [selectedCameraId]);

  // 4. MediaPipe Tracking Loop
  const predictWebcam = useCallback(() => {
    const video = videoRef.current;
    
    // Guard against the 2x2 virtual camera buffer issue
    if (!video || !handLandmarkerRef.current || video.videoWidth <= 2) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    try {
      const startTimeMs = performance.now();
      const results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        const indexBase = results.landmarks[0][5];
        setTrackingStatus(`Tracking... X: ${indexBase.x.toFixed(2)}, Y: ${indexBase.y.toFixed(2)}`);
      } else {
        setTrackingStatus("No hand detected.");
      }
    } catch (e) {
      // Ignore transient frame errors
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  }, []);

  // Handle Video Load
  const handleVideoLoad = () => {
    if (videoRef.current) {
      setSystemStatus(`Stream active: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
      videoRef.current.play();
      predictWebcam();
    }
  };

  return (
    <div className="relative w-full h-screen bg-zinc-950 flex flex-col items-center overflow-hidden">
      
      {/* Visual Camera Layer */}
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
        onLoadedData={handleVideoLoad}
      ></video>

      {/* Top Controls Overlay */}
      <div className="absolute top-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex flex-col items-center gap-4">
        
        {/* Step 1 Button */}
        {modelLoaded && cameras.length === 0 && (
          <button
            onClick={initializeCameraSystem}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-500"
          >
            Unlock Cameras & Start
          </button>
        )}

        {/* Camera Selector Dropdown */}
        {cameras.length > 0 && (
          <div className="flex items-center gap-3 bg-zinc-900/80 p-3 rounded-lg border border-zinc-700">
            <label className="text-zinc-300 font-semibold text-sm">Source:</label>
            <select
              className="bg-zinc-800 text-white p-2 rounded outline-none border border-zinc-600 w-64"
              value={selectedCameraId}
              onChange={(e) => setSelectedCameraId(e.target.value)}
            >
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId.substring(0, 5)}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Diagnostics Panel */}
      <div className="absolute bottom-10 left-10 z-20 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 w-96 space-y-2 shadow-2xl">
        <div className="text-sm font-bold text-white mb-2 border-b border-zinc-800 pb-1">System Status</div>
        <div><span className="text-zinc-500">System:</span> {systemStatus}</div>
        <div><span className="text-zinc-500">AI Tracking:</span> {trackingStatus}</div>
      </div>

    </div>
  );
}