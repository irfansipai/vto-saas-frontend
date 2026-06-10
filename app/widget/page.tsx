// frontend/app/widget/page.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FaceLandmarker, PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { JewelryModules } from "@/utils/jewelryModules";

export default function WidgetPage() {
  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);

  // NEW: Track the exact video frame timestamp
  const lastVideoTimeRef = useRef<number>(-1);

  // --- State ---
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [systemStatus, setSystemStatus] = useState("Initializing...");

  // 1. Concurrent Initialization of both AI Models
  useEffect(() => {
    const initializeModels = async () => {
      try {
        setSystemStatus("Downloading Multi-Model AI Bundle...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        // Spin up both networks in parallel via native promises
        const [faceModel, poseModel] = await Promise.all([
          FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 1
          }),
          PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numPoses: 1
          })
        ]);

        faceLandmarkerRef.current = faceModel;
        poseLandmarkerRef.current = poseModel;

        setModelLoaded(true);
        setSystemStatus("Dual AI Engines Online. Standby.");
      } catch (error) {
        console.error("Multi-model load error:", error);
        setSystemStatus("Failed to initialize system neural paths.");
      }
    };
    initializeModels();

    return () => {
      if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
      if (poseLandmarkerRef.current) poseLandmarkerRef.current.close();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Camera Hardware Discovery & Initial Handshake
  const initializeCameraSystem = async () => {
    try {
      const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      setCameras(videoDevices);
      initialStream.getTracks().forEach(track => track.stop());
      if (videoDevices.length > 0) setSelectedCameraId(videoDevices[0].deviceId);
    } catch (error) {
      console.error(error);
      setSystemStatus("Webcam hardware block encountered.");
    }
  };

  // 3. Hot-Swapping Streams based on Dropdown Selections
  useEffect(() => {
    if (!selectedCameraId) return;
    const startStream = async () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCameraId } }
        });
        streamRef.current = newStream;
        if (videoRef.current) videoRef.current.srcObject = newStream;
      } catch (error) {
        console.error(error);
      }
    };
    startStream();
  }, [selectedCameraId]);

  // 4. Combined Frame Prediction and Multi-Module Processing
  const predictWebcam = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (
      !video || 
      !canvas || 
      !faceLandmarkerRef.current || 
      !poseLandmarkerRef.current || 
      video.readyState < 2 || 
      video.videoWidth <= 2
    ) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    // CRITICAL FIX: Only run the AI if the video has actually moved forward to a new frame
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // MediaPipe requires strictly increasing timestamps
      const startTimeMs = performance.now();

      try {
        const faceResults = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);
        const poseResults = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);

        if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
          const faceData = faceResults.faceLandmarks[0];
          JewelryModules.renderForehead(faceData, ctx, canvas);
          JewelryModules.renderNosepin(faceData, ctx, canvas);
          JewelryModules.renderEarrings(faceData, ctx, canvas);
        }

        if (poseResults.landmarks && poseResults.landmarks.length > 0) {
          const poseData = poseResults.landmarks[0];
          JewelryModules.renderNecklace(poseData, ctx, canvas);
        }
      } catch (e) {
        // Silently catch the transient NORM_RECT frame drops during hardware warmup
      }
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  }, []);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setSystemStatus("System Active. Processing Multi-Model Engine.");
      
      // Start the video stream
      videoRef.current.play().then(() => {
        // Wait 150 milliseconds for the hardware buffer to actually push pixels
        // before firing the first AI prediction frame.
        setTimeout(() => {
          predictWebcam();
        }, 150);
      }).catch((err) => {
        console.error("Camera play interrupted:", err);
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-zinc-950 flex flex-col items-center overflow-hidden">
      
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
        onLoadedData={handleVideoLoad}
      ></video>

      <canvas
        ref={canvasRef}
        className="absolute w-full h-full object-cover scale-x-[-1] z-10 pointer-events-none"
      ></canvas>

      <div className="absolute top-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex flex-col items-center gap-4">
        {modelLoaded && cameras.length === 0 && (
          <button
            onClick={initializeCameraSystem}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-500 transition-colors"
          >
            Open 2D Try-On Engine
          </button>
        )}
        {cameras.length > 0 && (
          <select
            className="bg-zinc-800 text-white p-2 rounded outline-none border border-zinc-600 w-64 text-sm"
            value={selectedCameraId}
            onChange={(e) => setSelectedCameraId(e.target.value)}
          >
            {cameras.map((c) => <option key={c.deviceId} value={c.deviceId}>{c.label}</option>)}
          </select>
        )}
      </div>

      <div className="absolute bottom-10 left-10 z-20 text-xs font-mono text-zinc-400 bg-black/80 p-3 rounded-lg border border-zinc-800 shadow-2xl">
        Status: <span className="text-white">{systemStatus}</span>
      </div>
    </div>
  );
}