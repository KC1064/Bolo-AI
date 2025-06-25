import React, { useState, useRef, useEffect } from "react";
import VoiceSelector from "./components/VoiceSelector";
import TextInputArea from "./components/TextInputArea";
import ActionButtons from "./components/ActionButtons";
import StatusMessage from "./components/StatusMessage";
import AudioPlayer from "./components/AudioPlayer";
import Instructions from "./components/Instructions";

function App() {
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [selectedVoice, setSelectedVoice] = useState("en-male"); // Default voice
  const audioRef = useRef(null);
  const currentAudioUrl = useRef(null); // Track current audio URL for cleanup
  const [isTranslating, setIsTranslating] = useState(false);

  // Voice options
  const voiceOptions = [
    { value: "en-male", label: "🇺🇸 English - Male", language: "English" },
    { value: "en-female", label: "🇺🇸 English - Female", language: "English" },
    { value: "hi-male", label: "🇮🇳 Hindi - Male", language: "Hindi" },
    { value: "hi-female", label: "🇮🇳 Hindi - Female", language: "Hindi" },
    { value: "ja-male", label: "🇯🇵 Japanese - Male", language: "Japanese" },
    { value: "ja-female", label: "🇯🇵 Japanese - Female", language: "Japanese" },
  ];

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

  //Sending request and performing checks on input
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
        body: JSON.stringify({
          text: trimmedText,
          voice: selectedVoice, // Include selected voice in the request
        }),
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
              errorDetail = errorDetail
                .map((e) => e.msg || JSON.stringify(e))
                .join("; ");
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

  const getSelectedVoiceLabel = () => {
    const voice = voiceOptions.find((v) => v.value === selectedVoice);
    return voice ? voice.label : "Unknown Voice";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-4 sm:p-6">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            🎤 Bolo AI
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            Convert your text into natural-sounding speech using Bark TTS
          </p>
        </div>

        {/* Backend Status Indicator */}
        <div className="mb-4 flex justify-center">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              backendStatus === "ready"
                ? "bg-green-900/50 text-green-300 border border-green-500"
                : backendStatus === "checking"
                ? "bg-yellow-900/50 text-yellow-300 border border-yellow-500"
                : "bg-red-900/50 text-red-300 border border-red-500"
            }`}
          >
            {backendStatus === "ready" && "✅ Backend Ready"}
            {backendStatus === "checking" && "🔄 Checking Backend..."}
            {backendStatus === "unhealthy" && "❌ Backend Unavailable"}
          </div>
        </div>

        {/* Voice Selection */}
        <VoiceSelector
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          options={voiceOptions}
          getSelectedVoiceLabel={getSelectedVoiceLabel}
          disabled={isLoading}
        />

        {/* Text Input Area */}
        <TextInputArea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          maxLength={500}
          currentLength={textInput.length}
        />

        {/* Action Buttons */}
        <ActionButtons
          onSpeak={handleSpeak}
          onClear={handleClear}
          isLoading={isLoading}
          isSpeakDisabled={isLoading || !textInput.trim() || backendStatus !== "ready"}
          isClearDisabled={isLoading}
        />

        {/* Status Messages */}
        <StatusMessage
          isLoading={isLoading}
          isTranslating={isTranslating}
          error={error}
          success={success}
          selectedVoiceLabel={getSelectedVoiceLabel()}
        />

        {/* Audio Player */}
        <AudioPlayer audioRef={audioRef} />

        {/* Instructions */}
        <Instructions />
      </div>
    </div>
  );
}

export default App;
