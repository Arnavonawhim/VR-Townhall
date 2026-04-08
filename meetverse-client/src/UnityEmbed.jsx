import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function UnityEmbed({ mode, avatarData, roomData, onExit, inputActive }) {
  const UNITY_URL = "https://pub-cacca82a567344458962d14fa504e338.r2.dev";

  const { unityProvider, isLoaded, loadingProgression, sendMessage } = useUnityContext({
    loaderUrl: `${UNITY_URL}/Meetverse.loader.js`,
    dataUrl: `${UNITY_URL}/Meetverse.data`,
    frameworkUrl: `${UNITY_URL}/Meetverse.framework.js`,
    codeUrl: `${UNITY_URL}/Meetverse.wasm`,

    webglContextAttributes: {
    preserveDrawingBuffer: true,
    },
  });


  const [hasBootstrapped, setHasBootstrapped] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (mode === "dashboard") {
      console.log("Sending LoadDashboardScene to Unity...");
      sendMessage("SceneLoader", "LoadDashboardScene");
      setHasBootstrapped(false);
    } else if (mode === "multiplayer" && !hasBootstrapped && roomData) {
      const payload = JSON.stringify({
        roomId: roomData.roomId || "",
        type: roomData.type || "auditorium",
        isHost: roomData.isHost || false,
        relayJoinCode: roomData.relayJoinCode || "",
        avatarJson: avatarData || "",
      });
      if (roomData.isHost) {
        console.log("Sending CreateRoom to Unity:", payload);
        sendMessage("RoomBootstrapper", "CreateRoom", payload);
      } else {
        console.log("Sending JoinRoom to Unity:", payload);
        sendMessage("RoomBootstrapper", "JoinRoom", payload);
      }
      setHasBootstrapped(true);
    }
  }, [isLoaded, mode, avatarData, roomData, hasBootstrapped, sendMessage]);

  const loadPercent = Math.round(loadingProgression * 100);
  const isDashboard = mode === "dashboard";

  return (
    <div
      id="unity-container"
      style={{
        position: "fixed",
        zIndex: isDashboard ? 5 : 300,
        background: isDashboard ? "#131B2E" : "#0a0a0a",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",

        // Dashboard: sits inside the sidebar avatar box area
        top: isDashboard ? 308 : 0,
        bottom: isDashboard ? 0 : "auto",
        left: isDashboard ? 0 : 0,
        width: isDashboard ? 300 : "100%",
        height: isDashboard ? "auto" : "100%",
        borderRadius: isDashboard ? 0 : 0,
        pointerEvents: (isDashboard || inputActive) ? "none" : "auto",
        boxShadow: isDashboard ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
        border: isDashboard ? "1px solid #2A3A5C" : "none",
      }}
    >
      {!isLoaded && !isDashboard && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 16, zIndex: 1,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.5rem", letterSpacing: "0.1em",
            color: "#f5f5f0"
          }}>
            LOADING MEETVERSE
          </div>
          <div style={{
            width: 240, height: 2,
            background: "#242424", borderRadius: 2,
          }}>
            <div style={{
              height: "100%", background: "#d4522a",
              width: `${loadPercent}%`,
              transition: "width 0.3s ease",
              borderRadius: 2,
            }} />
          </div>
          <div style={{
            fontFamily: "monospace", fontSize: "0.75rem",
            color: "#555", letterSpacing: "0.08em"
          }}>
            {loadPercent}%
          </div>
        </div>
      )}

      <Unity
        unityProvider={unityProvider}
        tabIndex={(isDashboard || inputActive) ? -1 : 0}
        style={{
          width: "100%", height: "100%",
          visibility: isLoaded ? "visible" : "hidden",
        }}
      />

      {mode !== "dashboard" && (
        <button
          onClick={onExit}
          style={{
            position: "absolute", top: 20, right: 20,
            background: "rgba(10,10,10,0.8)",
            border: "1px solid #242424",
            color: "#888", padding: "7px 16px",
            fontFamily: "sans-serif", fontSize: "0.75rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer", borderRadius: 3, zIndex: 2,
          }}
        >
          Exit ✕
        </button>
      )}
    </div>
  );
}