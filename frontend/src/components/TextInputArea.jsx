import React from "react";

function TextInputArea({ value, onChange, onKeyDown, disabled, maxLength, currentLength }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        📝 Enter Text to Speak
      </label>
      <div className="relative">
        <textarea
          className="w-full h-30 p-4 text-gray-200 text-base bg-gray-700 border border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 ease-in-out resize-none"
          placeholder="Type or paste your text here... (Ctrl+Enter to generate speech)"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          maxLength={maxLength}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {currentLength}/{maxLength}
        </div>
      </div>
    </div>
  );
}

export default TextInputArea; 