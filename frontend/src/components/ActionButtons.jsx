import React from "react";

function ActionButtons({ onSpeak, onClear, isLoading, isSpeakDisabled, isClearDisabled }) {
  return (
    <div className="mb-6 flex gap-3">
      <button
        onClick={onSpeak}
        disabled={isSpeakDisabled}
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
        onClick={onClear}
        disabled={isClearDisabled}
        className="py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg
                   shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500
                   focus:ring-offset-2 transition-all duration-300 ease-in-out
                   disabled:bg-gray-700 disabled:cursor-not-allowed"
      >
        Clear
      </button>
    </div>
  );
}

export default ActionButtons; 