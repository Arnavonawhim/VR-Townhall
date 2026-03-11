import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function UnityEmbed({ onExit }) {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl:     "/unity/Build/My Games.loader.js",
    dataUrl:       "/unity/Build/My Games.data",
    frameworkUrl:  "/unity/Build/My Games.framework.js",
    codeUrl:       "/unity/Build/My Games.wasm",
  });

  const loadPercent = Math.round(loadingProgression * 100);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "#0a0a0a",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {!isLoaded && (
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
        style={{
          width: "100vw", height: "100vh",
          visibility: isLoaded ? "visible" : "hidden",
        }}
      />

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
    </div>
  );
}