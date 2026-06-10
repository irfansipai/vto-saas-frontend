// frontend/app/widget/page.tsx
"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { FaceLandmarker, PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useSearchParams } from "next/navigation";
import { JewelryModules } from "@/utils/jewelryModules";

// --- 1. ISOLATED AR ENGINE COMPONENT ---
// This component houses all the browser search params and tracking loops safely down the React tree.
function TryOnWidgetCore() {
  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  // --- State ---
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [systemStatus, setSystemStatus] = useState("Initializing...");
  
  // --- Dynamic Assets & Configurations ---
  const searchParams = useSearchParams();
  const [productConfig, setProductConfig] = useState<any>(null);
  const activeAssetRef = useRef<HTMLImageElement | null>(null);
  const productConfigRef = useRef<any>(null);

  // Effect A: Dynamic Multi-Tenant API Fetcher
  useEffect(() => {
    const apiKey = searchParams.get("api_key");
    const sku = searchParams.get("sku");

    if (!apiKey || !sku) {
      setSystemStatus("Missing API Key or SKU in URL parameters.");
      return;
    }

    const fetchProductData = async () => {
      try {
        setSystemStatus(`Authenticating tenant and loading SKU: ${sku}...`);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
        
        if (!apiBaseUrl) {
          throw new Error("Environment variable NEXT_PUBLIC_API_URL is missing.");
        }

        const response = await fetch(`${apiBaseUrl}/api/v1/widget/config?api_key=${apiKey}&sku=${sku}`);
        if (!response.ok) throw new Error("Failed to authorize token or locate target item.");

        const data = await response.json();
        setProductConfig(data);
        productConfigRef.current = data; 

        // Safely cache image binary data outside of the React frame state lifecycle
        const img = new Image();
        img.crossOrigin = "anonymous"; 
        img.src = data.image_url;
        img.onload = () => {
          activeAssetRef.current = img;
          setSystemStatus(`Loaded ${data.category} asset successfully.`);
        };
      } catch (error) {
        console.error("API Fetch Error:", error);
        setSystemStatus("Authentication failure or remote server unreachable.");
      }
    };

    fetchProductData();
  }, [searchParams]);

  // Effect B: Concurrent Instantiation of WebAssembly Neural Graphs
  useEffect(() => {
    const initializeModels = async () => {
      try {
        setSystemStatus("Downloading Multi-Model AI Bundle...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const [faceModel, poseModel] = await Promise.all([
          FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
          }),
          PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numPoses: 1,
          }),
        ]);

        faceLandmarkerRef.current = faceModel;
        poseLandmarkerRef.current = poseModel;
        setModelLoaded(true);
        setSystemStatus("Dual AI Engines Online. Standby.");
      } catch (error) {
        console.error("Multi-model load error:", error);
        setSystemStatus("Failed to initialize vision graph buffers.");
      }
    };
    initializeModels();

    return () => {
      if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
      if (poseLandmarkerRef.current) poseLandmarkerRef.current.close();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Camera Access & Enumeration Handshake
  const initializeCameraSystem = async () => {
    try {
      const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setCameras(videoDevices);
      initialStream.getTracks().forEach((track) => track.stop());
      if (videoDevices.length > 0) setSelectedCameraId(videoDevices[0].deviceId);
    } catch (error) {
      console.error(error);
      setSystemStatus("Webcam hardware allocation blocked.");
    }
  };

  // Hot-Swapping Active Video Feed Contexts
  useEffect(() => {
    if (!selectedCameraId) return;
    const startStream = async () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCameraId } },
        });
        streamRef.current = newStream;
        if (videoRef.current) videoRef.current.srcObject = newStream;
      } catch (error) {
        console.error(error);
      }
    };
    startStream();
  }, [selectedCameraId]);

  // Unified Processing and Rendering Frame Handler
  const predictWebcam = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !faceLandmarkerRef.current || !poseLandmarkerRef.current || video.readyState < 2 || video.videoWidth <= 2) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const startTimeMs = performance.now();

      try {
        const faceResults = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);
        const poseResults = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);
        const category = productConfigRef.current?.category;

        if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
          const faceData = faceResults.faceLandmarks[0];
          if (category === "forehead") JewelryModules.renderForehead(faceData, ctx, canvas, activeAssetRef.current);
          else if (category === "nosepin") JewelryModules.renderNosepin(faceData, ctx, canvas, activeAssetRef.current);
          else if (category === "earring") JewelryModules.renderEarrings(faceData, ctx, canvas, activeAssetRef.current);
        }

        if (poseResults.landmarks && poseResults.landmarks.length > 0) {
          const poseData = poseResults.landmarks[0];
          if (category === "necklace") JewelryModules.renderNecklace(poseData, ctx, canvas, activeAssetRef.current);
        }
      } catch (e) {
        // Drop runtime frame misses silently
      }
    }
    requestRef.current = requestAnimationFrame(predictWebcam);
  }, []);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setSystemStatus("System Active. Processing Multi-Model Engine.");
      videoRef.current.play().then(() => {
          // Wait 150 milliseconds for the hardware buffer to actually push pixels
          // before firing the first AI prediction frame.
        setTimeout(() => { predictWebcam(); }, 150);
      }).catch((err) => { console.error("Video run interrupted:", err); });
    }
  };

  return (
    <div className="relative w-full h-screen bg-zinc-950 flex flex-col items-center overflow-hidden">
      <video ref={videoRef} className="absolute w-full h-full object-cover scale-x-[-1]" playsInline muted onLoadedData={handleVideoLoad}></video>
      <canvas ref={canvasRef} className="absolute w-full h-full object-cover scale-x-[-1] z-10 pointer-events-none"></canvas>
      <div className="absolute top-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex flex-col items-center gap-4">
        {modelLoaded && cameras.length === 0 && (
          <button onClick={initializeCameraSystem} className="px-6 py-3 bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-500 transition-colors">
            Open 2D Try-On Engine
          </button>
        )}
        {cameras.length > 0 && (
          <select className="bg-zinc-800 text-white p-2 rounded outline-none border border-zinc-600 w-64 text-sm" value={selectedCameraId} onChange={(e) => setSelectedCameraId(e.target.value)}>
            {cameras.map((c) => ( <option key={c.deviceId} value={c.deviceId}>{c.label}</option> ))}
          </select>
        )}
      </div>
      <div className="absolute bottom-10 left-10 z-20 text-xs font-mono text-zinc-400 bg-black/80 p-3 rounded-lg border border-zinc-800 shadow-2xl">
        Status: <span className="text-white">{systemStatus}</span>
      </div>
    </div>
  );
}

// --- 2. CLEAN MAIN EXPORT WRAPPED IN SUSPENSE ---
// Next.js statically builds this component without triggering a client-side search parameter bailout error.
export default function WidgetPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs">
        Loading WebAssembly Canvas Context...
      </div>
    }>
      <TryOnWidgetCore />
    </Suspense>
  );
}