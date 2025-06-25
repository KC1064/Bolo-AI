import React from "react";

function AudioPlayer({ audioRef }) {
  return (
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
  );
}

export default AudioPlayer; 