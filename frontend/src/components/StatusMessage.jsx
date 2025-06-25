import React from "react";

function StatusMessage({ isLoading, isTranslating, error, success, selectedVoiceLabel }) {
  return (
    <>
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
            Generating audio with {selectedVoiceLabel}...
          </p>
        </div>
      )}
      {isTranslating && (
        <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-500 rounded-lg">
          <p className="text-yellow-300 text-sm flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-yellow-300"
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
            Translating to selected language...
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
            ✅ Audio generated successfully with {selectedVoiceLabel}!
          </p>
        </div>
      )}
    </>
  );
}

export default StatusMessage; 