import React from 'react';
import { THEMES } from '../constants/themes';
import './ThemeSelector.css';

export default function ThemeSelector({ themeId, onChange }) {
  const activeTheme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  return (
    <div className="theme-selector">
    <span className="theme-selector-label">{activeTheme.labelEmoji}</span>
    <select
      className="theme-select"
      value={themeId}
      onChange={(e) => onChange(e.target.value)}
      title="Wybierz motyw"
    >
      {THEMES.map((theme) => (
        <option key={theme.id} value={theme.id}>
          {theme.name}
        </option>
      ))}
    </select>
    </div>
  );
}
