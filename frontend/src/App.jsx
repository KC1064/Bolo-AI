import React, { useState, useRef, useEffect } from "react";

function App() {
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const audioRef = useRef(null);
  const currentAudioUrl = useRef(null); // Track current audio URL for cleanup

  // Health check on mount
  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "healthy" && data.model_loaded) {
          setBackendStatus("ready");
        } else {
          setBackendStatus("unhealthy");
        }
      })
      .catch(() => setBackendStatus("unhealthy"));
  }, []);

  // Cleanup audio URL on component unmount
  useEffect(() => {
    return () => {
      if (currentAudioUrl.current) {
        URL.revokeObjectURL(currentAudioUrl.current);
      }
    };
  }, []);

  const cleanupAudioUrl = () => {
    if (currentAudioUrl.current) {
      URL.revokeObjectURL(currentAudioUrl.current);
      currentAudioUrl.current = null;
    }
  };

  const handleSpeak = async () => {
    const trimmedText = textInput.trim();

    if (!trimmedText) {
      setError("Please enter some text to speak!");
      return;
    }

    if (trimmedText.length > 5000) {
      setError("Text is too long! Maximum 5000 characters allowed.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Clean up previous audio URL
    cleanupAudioUrl();

    try {
      console.log("Making request to backend...");

      const response = await fetch("http://localhost:8000/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmedText }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        let errorDetail = "Failed to generate audio.";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorJson = await response.json();
            errorDetail = errorJson.detail || errorDetail;
            if (Array.isArray(errorDetail)) {
              errorDetail = errorDetail.map(e => e.msg || JSON.stringify(e)).join("; ");
            }
          } else {
            errorDetail = await response.text();
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          errorDetail = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorDetail);
      }

      // Check if response has content
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        throw new Error("Received empty audio response from server");
      }

      // Get the audio stream as a Blob
      const audioBlob = await response.blob();
      console.log("Audio blob size:", audioBlob.size, "bytes");
      console.log("Audio blob type:", audioBlob.type);

      if (audioBlob.size === 0) {
        throw new Error("Received empty audio file");
      }

      // Create a URL for the Blob
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudioUrl.current = audioUrl;

      // Set the audio element's source
      if (audioRef.current) {
        audioRef.current.src = audioUrl;

        // Add event listeners for audio playback
        const audio = audioRef.current;

        const handleLoadedData = () => {
          console.log("Audio loaded successfully, duration:", audio.duration);
          setSuccess(true);
          // Auto-play the audio
          audio.play().catch((playError) => {
            console.error("Auto-play failed:", playError);
            setError(
              "Audio loaded but auto-play failed. Please click the play button."
            );
          });
        };

        const handleError = (e) => {
          console.error("Audio element error:", e);
          setError("Failed to load audio. The audio file might be corrupted.");
        };

        const handleCanPlay = () => {
          console.log("Audio can start playing");
        };

        // Remove existing listeners to avoid duplicates
        audio.removeEventListener("loadeddata", handleLoadedData);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("canplay", handleCanPlay);

        // Add new listeners
        audio.addEventListener("loadeddata", handleLoadedData);
        audio.addEventListener("error", handleError);
        audio.addEventListener("canplay", handleCanPlay);

        // Load the audio
        audio.load();
      }
    } catch (err) {
      console.error("Error fetching audio:", err);
      setError(`Error: ${err.message}`);
      cleanupAudioUrl();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setTextInput("");
    setError(null);
    setSuccess(false);
    cleanupAudioUrl();
    if (audioRef.current) {
      audioRef.current.src = "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSpeak();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-4 sm:p-6">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            🎤 Speak AI
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            Convert your text into natural-sounding speech using Coqui TTS
          </p>
        </div>

        {/* Text Input Area */}
        <div className="mb-6">
          <div className="relative">
            <textarea
              className="w-full h-40 p-4 text-gray-200 text-base bg-gray-700 border border-gray-600 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 ease-in-out resize-none"
              placeholder="Type or paste your text here... (Ctrl+Enter to generate speech)"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              maxLength={5000}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {textInput.length}/5000
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={handleSpeak}
            disabled={isLoading || !textInput.trim()}
            className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg
                       shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:ring-offset-2 transition-all duration-300 ease-in-out
                       transform hover:scale-105 active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed
                       disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating Speech...
              </span>
            ) : (
              "🔊 Generate Speech"
            )}
          </button>

          <button
            onClick={handleClear}
            disabled={isLoading}
            className="py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg
                       shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500
                       focus:ring-offset-2 transition-all duration-300 ease-in-out
                       disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>

        {/* Status Messages */}
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-900/50 border border-blue-500 rounded-lg">
            <p className="text-blue-300 text-sm flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating audio, please wait...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">❌ {error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg">
            <p className="text-green-300 text-sm">
              ✅ Audio generated successfully!
            </p>
          </div>
        )}

        {/* Audio Player */}
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-3">
            Generated audio will appear here:
          </p>
          <audio
            ref={audioRef}
            controls
            controlsList="nodownload"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ height: "54px" }}
          >
            Your browser does not support the audio element.
          </audio>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            💡 Tip: Use Ctrl+Enter as a keyboard shortcut to generate speech
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
