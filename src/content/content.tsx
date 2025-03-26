// src/content/content.tsx
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import SidePanel from '../sidePanel/SidePanel';
import Onboarding from '../components/Onboarding';
import { isLinkedInJobPage, getCompanyNameFromDOM } from '../utils/helpers';
import ButtonWrapper from '../components/ButtonWrapper';

const JOB_CONTAINER_SELECTOR = 'div.jobs-details__main-content';
const APPLY_BUTTON_SELECTOR = '.jobs-save-button';
const FALLBACK_APPLY_BUTTON_SELECTOR = '[data-test="jobs-save-button"]';
const ADDITIONAL_FALLBACK_SELECTOR = '.artdeco-button--secondary.artdeco-button--3';

// Main App component
const App: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chrome.storage.local.get(['onboardingCompleted'], (result) => {
      setOnboardingCompleted(!!result.onboardingCompleted);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPanelOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !document.querySelector('.side-panel')?.contains(event.target as Node)
      ) {
        setIsPanelOpen(false);
        const closeEvent = new CustomEvent('sidePanelToggle', { detail: { isOpen: false } });
        window.dispatchEvent(closeEvent);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelOpen]);

  const handleOnboardingComplete = () => {
    chrome.storage.local.set({ onboardingCompleted: true }, () => {
      setOnboardingCompleted(true);
    });
  };

  const handleButtonClick = () => {
    setIsPanelOpen(true);
    const openEvent = new CustomEvent('sidePanelToggle', { detail: { isOpen: true } });
    window.dispatchEvent(openEvent);
  };

  if (onboardingCompleted === null) {
    return null;
  }

  if (!onboardingCompleted) {
    return (
      <div className="onboarding-overlay">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (!isLinkedInJobPage()) {
    return null;
  }

  return (
    <div id="hrmail-button-wrapper" ref={buttonRef}>
      <ButtonWrapper onClick={handleButtonClick} disabled={isPanelOpen} />
    </div>
  );
};

// SidePanel Wrapper to manage its own state
const SidePanelWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSidePanelToggle = (event: Event) => {
      const customEvent = event as CustomEvent<{ isOpen: boolean }>;
      setIsOpen(customEvent.detail.isOpen);
    };

    window.addEventListener('sidePanelToggle', handleSidePanelToggle);
    return () => window.removeEventListener('sidePanelToggle', handleSidePanelToggle);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    const closeEvent = new CustomEvent('sidePanelToggle', { detail: { isOpen: false } });
    window.dispatchEvent(closeEvent);
  };

  return isOpen ? <SidePanel isOpen={isOpen} onClose={handleClose} /> : null;
};

// Global variables to manage state
let isInjected = false;
let appRoot: ReactDOM.Root | null = null;
let sidePanelRoot: ReactDOM.Root | null = null;
let sidePanelContainer: HTMLDivElement | null = null;
let buttonContainer: HTMLDivElement | null = null;
let lastJobUrl = window.location.href;
let monitorInterval: NodeJS.Timeout | null = null;

// Wait for the target element (Save/Apply button) to be visible
const waitForTargetElement = (
  callback: (targetElement: HTMLElement) => void,
  retryCount = 0,
  maxRetries = 20
) => {
  let targetElement: HTMLElement | null = document.querySelector(APPLY_BUTTON_SELECTOR);
  if (!targetElement) {
    targetElement = document.querySelector(FALLBACK_APPLY_BUTTON_SELECTOR);
  }
  if (!targetElement) {
    targetElement = document.querySelector(ADDITIONAL_FALLBACK_SELECTOR);
  }

  if (targetElement) {
    callback(targetElement);
    return;
  }

  if (retryCount < maxRetries) {
    setTimeout(() => waitForTargetElement(callback, retryCount + 1, maxRetries), 500);
  }
};

// Clean up existing button and side panel
const cleanupInjection = () => {
  if (buttonContainer && document.body.contains(buttonContainer)) {
    buttonContainer.remove();
    buttonContainer = null;
  }
  if (appRoot) {
    appRoot.unmount();
    appRoot = null;
  }
  if (sidePanelContainer) {
    sidePanelContainer.remove();
    sidePanelContainer = null;
  }
  if (sidePanelRoot) {
    sidePanelRoot.unmount();
    sidePanelRoot = null;
  }
  isInjected = false;
};

// Inject the button and side panel container
const injectButtonAndPanel = (targetElement: HTMLElement) => {
  if (!isLinkedInJobPage()) {
    if (buttonContainer && document.body.contains(buttonContainer)) {
      cleanupInjection();
    }
    return;
  }

  // If the button is already injected and still in the DOM, do nothing
  if (isInjected && buttonContainer && document.body.contains(buttonContainer)) {
    return;
  }

  // Clean up only if necessary
  if (buttonContainer || appRoot || sidePanelContainer || sidePanelRoot) {
    cleanupInjection();
  }

  buttonContainer = document.createElement('div');
  buttonContainer.id = 'hrmail-button';

  try {
    targetElement.insertAdjacentElement('afterend', buttonContainer);
  } catch (error) {
    const jobContainer = document.querySelector(JOB_CONTAINER_SELECTOR) || document.body;
    jobContainer.appendChild(buttonContainer);
  }

  try {
    appRoot = ReactDOM.createRoot(buttonContainer);
    appRoot.render(<App />);
  } catch (error) {
    return;
  }

  sidePanelContainer = document.getElementById('hrmail-sidepanel-root') as HTMLDivElement | null;
  if (!sidePanelContainer) {
    sidePanelContainer = document.createElement('div');
    sidePanelContainer.id = 'hrmail-sidepanel-root';
    try {
      document.body.appendChild(sidePanelContainer);
    } catch (error) {
      return;
    }
  }

  if (!document.body.contains(sidePanelContainer)) {
    return;
  }

  try {
    if (!sidePanelRoot) {
      sidePanelRoot = ReactDOM.createRoot(sidePanelContainer);
      sidePanelRoot.render(<SidePanelWrapper />);
    }
  } catch (error) {
    return;
  }

  isInjected = true;

  getCompanyNameFromDOM();
};

// Setup navigation listeners with monitoring
const setupNavigationListeners = () => {
  const handlePopstate = () => {
    const currentJobUrl = window.location.href;
    if (currentJobUrl !== lastJobUrl) {
      lastJobUrl = currentJobUrl;
      isInjected = false;
      waitForTargetElement(injectButtonAndPanel);
    }
  };
  window.addEventListener('popstate', handlePopstate);

  // Monitor the button's presence and URL changes
  monitorInterval = setInterval(() => {
    const currentJobUrl = window.location.href;
    if (currentJobUrl !== lastJobUrl) {
      lastJobUrl = currentJobUrl;
      isInjected = false;
      waitForTargetElement(injectButtonAndPanel);
    } else if (isInjected && (!buttonContainer || !document.body.contains(buttonContainer))) {
      // Button was removed by LinkedIn's DOM updates, re-inject it
      waitForTargetElement(injectButtonAndPanel);
    }
  }, 1000);

  return () => {
    window.removeEventListener('popstate', handlePopstate);
    if (monitorInterval) {
      clearInterval(monitorInterval);
      monitorInterval = null;
    }
  };
};

// Run injection
const runInjection = () => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    waitForTargetElement(injectButtonAndPanel);
    const cleanupNavigation = setupNavigationListeners();

    window.addEventListener('unload', () => {
      cleanupNavigation();
      cleanupInjection();
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      waitForTargetElement(injectButtonAndPanel);
      const cleanupNavigation = setupNavigationListeners();

      window.addEventListener('unload', () => {
        cleanupNavigation();
        cleanupInjection();
      });
    });
  }
};

runInjection();

export { App };