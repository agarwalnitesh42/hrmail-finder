// src/content/positioning.ts
import { debounce } from '../utils/helpers';
import { getButtonContainer } from './injection';

const JOB_CONTAINER_SELECTOR = 'div.jobs-details__main-content';
const APPLY_BUTTON_SELECTOR = '.jobs-save-button';
const FALLBACK_APPLY_BUTTON_SELECTOR = '[data-test="jobs-save-button"]';
const ADDITIONAL_FALLBACK_SELECTOR = '.artdeco-button--secondary.artdeco-button--3';

let saveButtonObserver: MutationObserver | null = null;
let resizeObserver: ResizeObserver | null = null;
let isPositioning = false;

export const positionButtonWithRetry = (retryCount = 0, maxRetries = 10) => {
  if (isPositioning) {
    console.log('Positioning already in progress, skipping');
    return;
  }

  isPositioning = true;
  const buttonContainer = getButtonContainer();

  if (!buttonContainer) {
    console.log('Button container not found, skipping positioning');
    isPositioning = false;
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
      setTimeout(() => {
        isPositioning = false;
        positionButtonWithRetry(retryCount + 1, maxRetries);
      }, 500);
      return;
    } else {
      console.log('Save button not found after maximum retries, hiding button');
      buttonContainer.style.display = 'none';
      setupSaveButtonObserver();
      isPositioning = false;
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

  isPositioning = false;
};

const setupSaveButtonObserver = () => {
  if (saveButtonObserver) {
    saveButtonObserver.disconnect();
  }

  const jobContainer = document.querySelector(JOB_CONTAINER_SELECTOR) || document.body;
  saveButtonObserver = new MutationObserver(
    debounce((mutations) => {
      let shouldReposition = false;
      mutations.forEach((mutation: any) => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
          const saveButton =
            document.querySelector(APPLY_BUTTON_SELECTOR) ||
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
    }, 300)
  );
  saveButtonObserver.observe(jobContainer, { childList: true, subtree: true });
  console.log('Save button observer set up');
};

export const setupPositionListeners = () => {
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
      resizeObserver = null;
    }
  };
};

export const cleanupPositionListeners = () => {
  if (saveButtonObserver) {
    saveButtonObserver.disconnect();
    saveButtonObserver = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
};