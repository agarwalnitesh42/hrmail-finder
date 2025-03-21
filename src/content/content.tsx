// src/content/content.tsx
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Button from '../components/Button';
import SidePanel from '../sidePanel/SidePanel';
import { GlobalStyles } from '../styles/global';
import { injectElement, isLinkedInJobPage, getCompanyNameFromDOM } from '../utils/helpers';
import Logo from '../components/Logo';

const JOB_CONTAINER_SELECTOR = 'div.jobs-description-content'; // Target the job details container

// Main App component to manage button and side panel
const App: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null); // Ref for the button container

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPanelOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !document.querySelector('.side-panel')?.contains(event.target as Node) // Assuming SidePanel has class 'side-panel'
      ) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelOpen]);

  return (
    <>
      <GlobalStyles />
      <div
        id="hrmail-button-wrapper"
        ref={buttonRef} // Attach ref to button container
        style={{ width: '300px', display: 'flex', marginLeft: '10px', justifyContent: 'space-between', padding: '10px' }}
      >
        <Button onClick={() => setIsPanelOpen(true)} disabled={isPanelOpen}>
          Reveal Email & Apply
        </Button>
        <div style={{ display: 'flex' }}>
          <Logo />
        </div>
      </div>
      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}></SidePanel>
    </>
  );
};

const injectButtonAndPanel = () => {
  console.log('=== Starting injectButtonAndPanel ===');

  // Ensure we're on a LinkedIn job page
  if (!isLinkedInJobPage()) {
    console.log('Not a LinkedIn job page, exiting');
    return;
  }
  console.log('Confirmed LinkedIn job page');

  // Target the "Apply" button with a flexible selector
  const applyButtonContainer = document.getElementsByClassName('jobs-apply-button--top-card')[0] as HTMLElement | null;
  console.log('applyButtonContainer found:', applyButtonContainer);

  if (!applyButtonContainer) {
    console.log('Apply button not found or already injected, exiting');
    return;
  }
  console.log('Apply button is available');

  // Check if the button is visible
  const isVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const isInViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    return isInViewport && window.getComputedStyle(element).visibility !== 'hidden';
  };

  if (!isVisible(applyButtonContainer)) {
    console.log('Apply button not visible, retrying in 500ms');
    setTimeout(injectButtonAndPanel, 500);
    return;
  }
  console.log('Apply button is visible');

  // Create a single root container for the entire extension UI
  let rootContainer = document.getElementById('hrmail-root') as HTMLElement | null;
  if (!rootContainer) {
    rootContainer = document.createElement('div');
    rootContainer.id = 'hrmail-root';
    try {
      document.body.appendChild(rootContainer);
      console.log('Root container appended to body');
    } catch (error) {
      console.error('Failed to append root container:', error);
      return;
    }
  }

  // Verify rootContainer is in DOM
  if (!document.body.contains(rootContainer)) {
    console.error('rootContainer not in DOM after append');
    return;
  }
  console.log('rootContainer verified in DOM');

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'hrmail-button';
  buttonContainer.style.display = 'inline-flex';
  buttonContainer.style.marginLeft = '10px';

  // Inject the button container next to the apply button
  try {
    injectElement(buttonContainer, applyButtonContainer, 'after');
    console.log('Button container injected');
  } catch (error) {
    console.error('Injection failed:', error);
    document.body.appendChild(buttonContainer);
    console.warn('Fallback: Appended buttonContainer to body');
  }

  // Get company name
  const companyName = getCompanyNameFromDOM();
  console.log('Company Name:', companyName);

  // Render everything in the root container
  try {
    const root = ReactDOM.createRoot(rootContainer);
    root.render(<App />);
    console.log('App component rendered successfully');
  } catch (error) {
    console.error('Failed to render App component:', error);
  }
};

// Run injection on page load and DOM changes
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, starting injection');
  injectButtonAndPanel();
});

let lastJobUrl = window.location.href; 

// Use a MutationObserver to detect changes in the job container
const jobContainer = document.querySelector(JOB_CONTAINER_SELECTOR);
if (jobContainer) {
  new MutationObserver(() => {
    const currentJobUrl = window.location.href;
    if (currentJobUrl !== lastJobUrl) {
      console.log('Job page changed, re-running injection');
      lastJobUrl = currentJobUrl;
      injectButtonAndPanel();
    }
  }).observe(jobContainer, { childList: true, subtree: true });
} else {
  console.warn(`Job container (${JOB_CONTAINER_SELECTOR}) not found, using URL polling as fallback`);
  setInterval(() => {
    const currentJobUrl = window.location.href;
    if (currentJobUrl !== lastJobUrl) {
      console.log('Job URL changed, re-running injection');
      lastJobUrl = currentJobUrl;
      injectButtonAndPanel();
    }
  }, 1000); // Poll every 1 second
}
export { App };