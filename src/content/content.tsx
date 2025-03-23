// src/content/content.tsx
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Button from '../components/Button';
import SidePanel from '../sidePanel/SidePanel';
import Onboarding from '../components/Onboarding';
import { GlobalStyles } from '../styles/global';
import { isLinkedInJobPage, getCompanyNameFromDOM, debounce } from '../utils/helpers';
import Logo from '../components/Logo';

const JOB_CONTAINER_SELECTOR = 'div.jobs-details__main-content';
const JOB_TITLE_SELECTOR = '.job-details-jobs-unified-top-card__job-title';
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
      <>
        <GlobalStyles />
        <div className="onboarding-overlay">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </>
    );
  }

  // Only render button if on a LinkedIn job page
  if (!isLinkedInJobPage()) {
    return null;
  }

  return (
    <>
      <GlobalStyles />
      <div
        id="hrmail-button-wrapper"
        ref={buttonRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Button onClick={handleButtonClick} disabled={isPanelOpen}>
          Reveal Email & Apply
        </Button>
        <Logo />
      </div>
    </>
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

  return <SidePanel isOpen={isOpen} onClose={handleClose} />;
};

// Global variables to manage state
let isInjected = false;
let buttonRoot: ReactDOM.Root | null = null;
let sidePanelRoot: ReactDOM.Root | null = null;
let shadowHost: HTMLElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let buttonContainer: HTMLDivElement | null = null;
let sidePanelContainer: HTMLDivElement | null = null;
let observer: MutationObserver | null = null;
let jobLoadObserver: MutationObserver | null = null;
let saveButtonObserver: MutationObserver | null = null;
let resizeObserver: ResizeObserver | null = null;
let lastJobUrl = window.location.href;

const waitForJobPostLoad = (callback: () => void, retryCount = 0, maxRetries = 20) => {
  const jobTitle = document.querySelector(JOB_TITLE_SELECTOR);
  if (jobTitle) {
    console.log('Job post fully loaded (job title found), proceeding with injection');
    callback();
    return;
  }

  if (retryCount < maxRetries) {
    console.log(`Job post not fully loaded, retrying (${retryCount + 1}/${maxRetries}) in 500ms`);
    setTimeout(() => waitForJobPostLoad(callback, retryCount + 1, maxRetries), 500);
  } else {
    console.error('Job post not loaded after maximum retries, proceeding with default injection');
    callback();
  }

  const jobContainer = document.querySelector(JOB_CONTAINER_SELECTOR) || document.body;
  jobLoadObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      const jobTitle = document.querySelector(JOB_TITLE_SELECTOR);
      if (jobTitle) {
        console.log('Job post loaded via observer (job title found), proceeding with injection');
        jobLoadObserver?.disconnect();
        callback();
      }
    });
  });
  jobLoadObserver.observe(jobContainer, { childList: true, subtree: true });
  console.log('Job load observer set up');
};

const injectButtonAndPanel = () => {
  // Only inject if on a LinkedIn job page
  if (!isLinkedInJobPage()) {
    console.log('Not a LinkedIn job page, exiting');
    if (buttonContainer) {
      buttonContainer.style.display = 'none'; // Hide button if already injected
    }
    return;
  }

  if (isInjected && shadowHost && document.body.contains(shadowHost)) {
    console.log('Injection already performed and shadow host exists, repositioning button');
    buttonContainer!.style.display = 'inline-flex'; // Show button on job page
    positionButtonWithRetry();
    return;
  }

  console.log('=== Starting injectButtonAndPanel ===');

  shadowHost = document.createElement('div');
  shadowHost.id = 'hrmail-shadow-host';
  shadowRoot = shadowHost.attachShadow({ mode: 'open' });

  try {
    document.body.appendChild(shadowHost);
    console.log('Shadow host appended to body');
  } catch (error) {
    console.error('Failed to append shadow host to body:', error);
    return;
  }

  buttonContainer = document.createElement('div');
  buttonContainer.id = 'hrmail-button';
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.zIndex = '1000';
  buttonContainer.style.display = 'inline-flex';

  shadowRoot.appendChild(buttonContainer);

  if (!shadowRoot.contains(buttonContainer)) {
    console.error('buttonContainer not in shadow DOM after append');
    return;
  }
  console.log('buttonContainer verified in shadow DOM');

  const companyName = getCompanyNameFromDOM();
  console.log('Company Name:', companyName);

  try {
    if (!buttonRoot) {
      buttonRoot = ReactDOM.createRoot(buttonContainer);
      buttonRoot.render(<App />);
      console.log('App component rendered successfully into buttonContainer');
      isInjected = true;
    }
  } catch (error) {
    console.error('Failed to render App component into buttonContainer:', error);
    return;
  }

  sidePanelContainer = document.getElementById('hrmail-sidepanel-root') as HTMLDivElement | null;
  if (!sidePanelContainer) {
    sidePanelContainer = document.createElement('div');
    sidePanelContainer.id = 'hrmail-sidepanel-root';
    try {
      document.body.appendChild(sidePanelContainer);
      console.log('Side panel container appended to body');
    } catch (error) {
      console.error('Failed to append side panel container:', error);
      return;
    }
  }

  if (!document.body.contains(sidePanelContainer)) {
    console.error('sidePanelContainer not in DOM after append');
    return;
  }
  console.log('sidePanelContainer verified in DOM');

  try {
    if (!sidePanelRoot) {
      sidePanelRoot = ReactDOM.createRoot(sidePanelContainer);
      sidePanelRoot.render(<SidePanelWrapper />);
      console.log('SidePanelWrapper component rendered successfully into sidePanelContainer');
    }
  } catch (error) {
    console.error('Failed to render SidePanelWrapper component:', error);
  }

  positionButtonWithRetry();
};

const positionButtonWithRetry = (retryCount = 0, maxRetries = 10) => {
  if (!buttonContainer) {
    console.log('Button container not found, skipping positioning');
    return;
  }

  let saveButton = document.querySelector(APPLY_BUTTON_SELECTOR) as HTMLElement | null;
  if (!saveButton) {
    saveButton = document.querySelector(FALLBACK_APPLY_BUTTON_SELECTOR) as HTMLElement | null;
  }
  if (!saveButton) {
    saveButton = document.querySelector(ADDITIONAL_FALLBACK_SELECTOR) as HTMLElement | null;
  }

  if (!saveButton) {
    if (retryCount < maxRetries) {
      console.log(`Save button not found, retrying (${retryCount + 1}/${maxRetries}) in 500ms`);
      setTimeout(() => positionButtonWithRetry(retryCount + 1, maxRetries), 500);
      return;
    } else {
      console.error('Save button not found after maximum retries, positioning button at default location');
      buttonContainer.style.display = 'inline-flex';
      buttonContainer.style.top = '10px';
      buttonContainer.style.right = '10px';
      buttonContainer.style.left = 'auto';
      console.log('Button positioned at default location (top-right)');
      setupSaveButtonObserver();
      return;
    }
  }

  const rect = saveButton.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  buttonContainer.style.display = 'inline-flex';
  buttonContainer.style.top = `${rect.top + scrollTop}px`;
  buttonContainer.style.left = `${rect.right + scrollLeft + 10}px`;
  buttonContainer.style.right = 'auto';
  console.log('Button positioned at:', {
    top: buttonContainer.style.top,
    left: buttonContainer.style.left,
  });
};

const setupSaveButtonObserver = () => {
  if (saveButtonObserver) {
    saveButtonObserver.disconnect();
  }

  const jobContainer = document.querySelector(JOB_CONTAINER_SELECTOR) || document.body;
  saveButtonObserver = new MutationObserver((mutations) => {
    let shouldReposition = false;
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length || mutation.removedNodes.length) {
        const saveButton = document.querySelector(APPLY_BUTTON_SELECTOR) ||
                          document.querySelector(FALLBACK_APPLY_BUTTON_SELECTOR) ||
                          document.querySelector(ADDITIONAL_FALLBACK_SELECTOR);
        if (saveButton) {
          shouldReposition = true;
        }
      }
    });

    if (shouldReposition) {
      console.log('Save button detected via observer, repositioning button');
      positionButtonWithRetry();
    }
  });
  saveButtonObserver.observe(jobContainer, { childList: true, subtree: true });
  console.log('Save button observer set up');
};

const setupPositionListeners = () => {
  const handleScroll = debounce(() => {
    positionButtonWithRetry();
  }, 100);

  const handleResize = debounce(() => {
    positionButtonWithRetry();
  }, 100);

  window.addEventListener('scroll', handleScroll);
  resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(document.body);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  };
};

const setupNavigationListeners = () => {
  const handlePopstate = () => {
    const currentJobUrl = window.location.href;
    if (currentJobUrl !== lastJobUrl) {
      console.log('SPA navigation detected, waiting for job post to load');
      lastJobUrl = currentJobUrl;
      isInjected = false;
      waitForJobPostLoad(injectButtonAndPanel);
    }
  };
  window.addEventListener('popstate', handlePopstate);

  const jobContainer = document.querySelector(JOB_CONTAINER_SELECTOR) || document.body;
  observer = new MutationObserver(() => {
    const currentJobUrl = window.location.href;
    if (currentJobUrl !== lastJobUrl) {
      console.log('Job page changed, waiting for job post to load');
      lastJobUrl = currentJobUrl;
      isInjected = false;
      waitForJobPostLoad(injectButtonAndPanel);
    }
  });
  observer.observe(jobContainer, { childList: true, subtree: true });
  console.log('MutationObserver set up on job container');

  return () => {
    window.removeEventListener('popstate', handlePopstate);
    if (observer) {
      observer.disconnect();
    }
    if (jobLoadObserver) {
      jobLoadObserver.disconnect();
    }
    if (saveButtonObserver) {
      saveButtonObserver.disconnect();
    }
  };
};

const runInjection = () => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM loaded, waiting for job post to fully load');
    waitForJobPostLoad(() => {
      injectButtonAndPanel();
      const cleanupPosition = setupPositionListeners();
      const cleanupNavigation = setupNavigationListeners();

      window.addEventListener('unload', () => {
        cleanupPosition();
        cleanupNavigation();
        if (buttonRoot) {
          buttonRoot.unmount();
        }
        if (sidePanelRoot) {
          sidePanelRoot.unmount();
        }
      });
    });
  } else {
    console.log('DOM not ready, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM loaded, waiting for job post to fully load');
      waitForJobPostLoad(() => {
        injectButtonAndPanel();
        const cleanupPosition = setupPositionListeners();
        const cleanupNavigation = setupNavigationListeners();

        window.addEventListener('unload', () => {
          cleanupPosition();
          cleanupNavigation();
          if (buttonRoot) {
            buttonRoot.unmount();
          }
          if (sidePanelRoot) {
            sidePanelRoot.unmount();
          }
        });
      });
    });
  }
};

runInjection();

export { App };