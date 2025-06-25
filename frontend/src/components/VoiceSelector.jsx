import React from "react";

function VoiceSelector({ value, onChange, options, getSelectedVoiceLabel, disabled }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        🎭 Select Voice
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {options.map((voice) => (
          <option key={voice.value} value={voice.value}>
            {voice.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-400 mt-1">
        Currently selected: {getSelectedVoiceLabel()}
      </p>
    </div>
  );
}

export default VoiceSelector; 