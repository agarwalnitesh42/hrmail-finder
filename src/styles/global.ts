// src/styles/global.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Only apply styles to extension-specific elements */
  #hrmail-root,
  #hrmail-button-wrapper,
  .onboarding-overlay,
  .side-panel {
    font-family: 'Poppins', sans-serif !important;
    color: #333 !important;
    box-sizing: border-box; // Only for extension elements
  }

  /* Ensure buttons and inputs within extension have consistent styles */
  #hrmail-root button,
  #hrmail-root input,
  #hrmail-root select,
  .onboarding-overlay button,
  .onboarding-overlay input,
  .onboarding-overlay select,
  .side-panel button,
  .side-panel input,
  .side-panel select {
    font-family: 'Poppins', sans-serif !important;
    color: #333 !important;
    background-color: #fff !important;
  }

  /* Ensure side panel overlay doesn't interfere with LinkedIn */
  #hrmail-panel {
    position: relative;
    z-index: 1000;
  }

  /* Smooth scrolling for email list within extension */
  #hrmail-root ::-webkit-scrollbar,
  .onboarding-overlay ::-webkit-scrollbar,
  .side-panel ::-webkit-scrollbar {
    width: 8px;
  }

  #hrmail-root ::-webkit-scrollbar-track,
  .onboarding-overlay ::-webkit-scrollbar-track,
  .side-panel ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  #hrmail-root ::-webkit-scrollbar-thumb,
  .onboarding-overlay ::-webkit-scrollbar-thumb,
  .side-panel ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  #hrmail-root ::-webkit-scrollbar-thumb:hover,
  .onboarding-overlay ::-webkit-scrollbar-thumb:hover,
  .side-panel ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export default GlobalStyles;