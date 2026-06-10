"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- 3D COMPONENT ---
// This runs inside the Three.js Canvas, completely isolated from React's DOM rendering.
const JewelryModel = ({ landmarkRef }: { landmarkRef: React.MutableRefObject<any> }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ viewport }) => {
    if (!meshRef.current || !landmarkRef.current) {
      // Hide the mesh if no hand is detected
      if (meshRef.current) meshRef.current.visible = false;
      return;
    }

    meshRef.current.visible = true;

    // We want to attach to the base of the index finger (Landmark 5)
    const indexBase = landmarkRef.current[5];

    // THE MATH: Mapping MediaPipe (0 to 1) to Three.js World Space
    // MediaPipe origin is Top-Left. Three.js origin is Center.
    const x = (indexBase.x - 0.5) * viewport.width;
    const y = -(indexBase.y - 0.5) * viewport.height;
    
    // Z is relative depth. We scale it up so it moves forward/backward noticeably
    const z = -indexBase.z * 10; 

    // Smoothly interpolate the position so it doesn't jitter
    meshRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.5);

    // Optional: Add basic rotation based on two knuckles to match finger angle
    const indexTip = landmarkRef.current[8];
    if (indexTip) {
        const dx = (indexTip.x - indexBase.x) * viewport.width;
        const dy = -(indexTip.y - indexBase.y) * viewport.height;
        const angle = Math.atan2(dy, dx);
        meshRef.current.rotation.z = angle - Math.PI / 2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};


// --- MAIN APP COMPONENT ---
export default function WidgetPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // The bridge between AI and 3D
  const latestLandmarks = useRef<any>(null);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [systemStatus, setSystemStatus] = useState("Waiting for initialization...");

  // 1. Initialize MediaPipe
  useEffect(() => {
    const initializeModel = async () => {
      try {
        setSystemStatus("Downloading AI Model...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

        setModelLoaded(true);
        setSystemStatus("AI Ready.");
      } catch (error) {
        console.error(error);
      }
    };
    initializeModel();
  }, []);

  // 2. Camera Enumeration
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
    }
  };

  // 3. Start Selected Camera
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

  // 4. Tracking Loop
  const predictWebcam = useCallback(() => {
    const video = videoRef.current;
    if (!video || !handLandmarkerRef.current || video.videoWidth <= 2) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const startTimeMs = performance.now();
    const results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);

    if (results.landmarks && results.landmarks.length > 0) {
      // SILENTLY UPDATE THE REF FOR THREE.JS (No React Re-renders!)
      latestLandmarks.current = results.landmarks[0];
    } else {
      latestLandmarks.current = null;
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  }, []);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setSystemStatus("Stream active. 3D Engine running.");
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

      {/* 3D WebGL Canvas Layer */}
      <div className="absolute w-full h-full z-10 pointer-events-none scale-x-[-1]">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          {/* Inject the jewelry model and pass the silently updating ref */}
          <JewelryModel landmarkRef={latestLandmarks} />
        </Canvas>
      </div>

      {/* Top Controls Overlay */}
      <div className="absolute top-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex flex-col items-center gap-4">
        {modelLoaded && cameras.length === 0 && (
          <button
            onClick={initializeCameraSystem}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-500"
          >
            Start WebGL Try-On
          </button>
        )}
        {cameras.length > 0 && (
          <select
            className="bg-zinc-800 text-white p-2 rounded outline-none border border-zinc-600 w-64"
            value={selectedCameraId}
            onChange={(e) => setSelectedCameraId(e.target.value)}
          >
            {cameras.map((c) => <option key={c.deviceId} value={c.deviceId}>{c.label}</option>)}
          </select>
        )}
      </div>

      <div className="absolute bottom-10 left-10 z-20 text-xs font-mono text-zinc-500 bg-black/80 p-2 rounded">
        Status: {systemStatus}
      </div>
    </div>
  );
}