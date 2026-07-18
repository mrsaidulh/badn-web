// Theme configuration and dynamic management for BADN
// Allows changing the website color palette dynamically from the Admin Panel.

import { safeLocalStorage } from './storage';

export interface Theme {
  id: string;
  name: string;
  primary: string;
  hover: string;
  light: string;
  text: string;
  hoverText: string;
}

export const THEMES: Theme[] = [
  {
    id: 'olive',
    name: 'Olive Green (Default)',
    primary: '#99C754',
    hover: '#143a1b',
    light: '#f0f7f0',
    text: '#143a1b',
    hoverText: '#ffffff'
  },
  {
    id: 'teal',
    name: 'Teal Ocean',
    primary: '#0D9488',
    hover: '#115E59',
    light: '#F0FDFA',
    text: '#ffffff',
    hoverText: '#ffffff'
  },
  {
    id: 'blue',
    name: 'Sapphire Blue',
    primary: '#1D4ED8',
    hover: '#1E3A8A',
    light: '#EFF6FF',
    text: '#ffffff',
    hoverText: '#ffffff'
  },
  {
    id: 'terracotta',
    name: 'Terracotta Warm',
    primary: '#e17100',
    hover: '#78350F',
    light: '#FFF7ED',
    text: '#ffffff',
    hoverText: '#ffffff'
  }
];

export function applyTheme(themeId: string): Theme {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  
  // Set CSS custom variables on the document element
  const root = document.documentElement;
  root.style.setProperty('--color-brand', theme.primary);
  root.style.setProperty('--color-brand-hover', theme.hover);
  root.style.setProperty('--color-brand-light', theme.light);
  root.style.setProperty('--color-brand-text', theme.text);
  root.style.setProperty('--color-brand-hover-text', theme.hoverText);
  
  // Persist the choice in local storage
  safeLocalStorage.setItem('badn_theme_id', theme.id);
  
  // Fire a custom event to notify components about the theme change
  window.dispatchEvent(new CustomEvent('theme_changed', { detail: theme }));
  
  return theme;
}

export function getCurrentTheme(): Theme {
  const savedId = safeLocalStorage.getItem('badn_theme_id') || 'olive';
  return THEMES.find(t => t.id === savedId) || THEMES[0];
}

