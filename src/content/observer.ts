// src/content/observers.ts
import { debounce } from '../utils/helpers';
import { waitForJobPostLoad } from './utils';
import { injectButtonAndPanel, cleanupInjection } from './injection';

interface SidePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface ButtonWrapperProps {
  onClick?: () => void;
}

// Selectors for the job container and target element (Save/Apply button)
const JOB_CONTAINER_SELECTOR = 'div.jobs-details__main-content';
const APPLY_BUTTON_SELECTOR = '.jobs-save-button';
const FALLBACK_APPLY_BUTTON_SELECTOR = '[data-test="jobs-save-button"]';
const ADDITIONAL_FALLBACK_SELECTOR = '.artdeco-button--secondary.artdeco-button--3';

let observer: MutationObserver | null = null;
let lastJobUrl = window.location.href;

export const setupObservers = (
  SidePanelComponent: React.ComponentType<SidePanelProps>,
  ButtonWrapperComponent: React.ComponentType<ButtonWrapperProps>
) => {
  // Handle SPA navigation via popstate
  const handlePopstate = () => {
    const currentJobUrl = window.location.href;
    if (currentJobUrl !== lastJobUrl) {
      console.log('SPA navigation detected, waiting for job post to load');
      lastJobUrl = currentJobUrl;
      waitForJobPostLoad(() => injectButtonAndPanel(ButtonWrapperComponent, SidePanelComponent));
    }
  };
  window.addEventListener('popstate', handlePopstate);

  // Watch for changes to the job container to re-inject the button
  const jobContainer = document.querySelector(JOB_CONTAINER_SELECTOR) || document.body;
  observer = new MutationObserver(
    debounce((mutations) => {
      // Check if the URL has changed
      const currentJobUrl = window.location.href;
      if (currentJobUrl !== lastJobUrl) {
        console.log('Job page changed, waiting for job post to load');
        lastJobUrl = currentJobUrl;
        waitForJobPostLoad(() => injectButtonAndPanel(ButtonWrapperComponent, SidePanelComponent));
        return;
      }

      // Check if the target element (Save/Apply button) has been added or removed
      let shouldReinject = false;
      mutations.forEach((mutation: any) => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
          const targetElement =
            document.querySelector(APPLY_BUTTON_SELECTOR) ||
            document.querySelector(FALLBACK_APPLY_BUTTON_SELECTOR) ||
            document.querySelector(ADDITIONAL_FALLBACK_SELECTOR);
          const buttonShadowHost = document.querySelector('#hrmail-button-shadow-host');
          if (targetElement && !buttonShadowHost) {
            // Target element exists, but our button is missing—re-inject
            shouldReinject = true;
          } else if (!targetElement && buttonShadowHost) {
            // Target element is gone, but our button is still there—remove it
            cleanupInjection();
          }
        }
      });

      if (shouldReinject) {
        console.log('Target element detected via observer, re-injecting button');
        injectButtonAndPanel(ButtonWrapperComponent, SidePanelComponent);
      }
    }, 300)
  );
  observer.observe(jobContainer, { childList: true, subtree: true });
  console.log('MutationObserver set up on job container');

  // Cleanup on page unload
  window.addEventListener('unload', () => {
    cleanupObservers();
    cleanupInjection();
  });
};

export const cleanupObservers = () => {
  window.removeEventListener('popstate', () => {});
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};