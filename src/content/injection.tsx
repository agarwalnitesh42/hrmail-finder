// src/content/injection.tsx
import { isLinkedInJobPage, getCompanyNameFromDOM } from '../utils/helpers';

interface SidePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface ButtonWrapperProps {
  onClick?: () => void;
}

let isInjected = false;
let buttonContainer: HTMLDivElement | null = null;
let buttonShadowHost: HTMLDivElement | null = null;
let targetElement: HTMLElement | null = null;

// Selectors for LinkedIn's "Save" or "Apply" button
const APPLY_BUTTON_SELECTOR = '.jobs-save-button';
const FALLBACK_APPLY_BUTTON_SELECTOR = '[data-test="jobs-save-button"]';
const ADDITIONAL_FALLBACK_SELECTOR = '.artdeco-button--secondary.artdeco-button--3';

// Ensure the button is injected inline next to the target element
const ensureButtonPosition = () => {
  if (!buttonShadowHost) {
    console.log('Button shadow host not found, cannot position');
    return;
  }

  // Find the target element (LinkedIn's "Save" or "Apply" button)
  targetElement = document.querySelector(APPLY_BUTTON_SELECTOR) as HTMLElement | null;
  if (!targetElement) {
    targetElement = document.querySelector(FALLBACK_APPLY_BUTTON_SELECTOR) as HTMLElement | null;
  }
  if (!targetElement) {
    targetElement = document.querySelector(ADDITIONAL_FALLBACK_SELECTOR) as HTMLElement | null;
  }

  if (!targetElement) {
    console.log('Target element (Save/Apply button) not found, hiding button');
    buttonShadowHost.style.display = 'none';
    return;
  }

  // Check if the button is already in the correct position
  if (buttonShadowHost.parentElement === targetElement.parentElement) {
    console.log('Button already in correct position');
    buttonShadowHost.style.display = 'inline-block'; // Use inline-block to align with LinkedIn's buttons
    return;
  }

  // Remove the button from its current location (if any)
  if (buttonShadowHost.parentElement) {
    buttonShadowHost.remove();
  }

  // Inject the button inline as a sibling of the target element
  try {
    targetElement.insertAdjacentElement('afterend', buttonShadowHost);
    console.log('Button shadow host injected inline next to target element');
    buttonShadowHost.style.display = 'inline-block';
  } catch (error) {
    console.error('Failed to inject button shadow host inline:', error);
    buttonShadowHost.style.display = 'none';
  }
};

export const injectButtonAndPanel = (
  ButtonWrapperComponent: React.ComponentType<ButtonWrapperProps>,
  SidePanelComponent: React.ComponentType<SidePanelProps>
) => {
  if (!isLinkedInJobPage()) {
    console.log('Not a LinkedIn job page, exiting');
    if (buttonShadowHost) {
      buttonShadowHost.style.display = 'none';
    }
    return;
  }

  // Check if injection has already been performed
  if (isInjected && buttonShadowHost && document.body.contains(buttonShadowHost)) {
    console.log('Injection already performed, ensuring button visibility');
    buttonShadowHost.style.display = 'inline-block';
    ensureButtonPosition();
    return;
  }

  console.log('=== Starting injectButtonAndPanel ===');

  // Create button shadow host and container
  buttonShadowHost = document.createElement('div');
  buttonShadowHost.id = 'hrmail-button-shadow-host';
  const buttonShadowRoot = buttonShadowHost.attachShadow({ mode: 'open' });
  buttonContainer = document.createElement('div');
  buttonContainer.id = 'hrmail-button';
  buttonShadowRoot.appendChild(buttonContainer);

  // Create the button using plain JavaScript
  const button = document.createElement('button');
  button.textContent = 'Reveal Email & Apply';

  // Add inline styles to match LinkedIn's button style
  button.style.display = 'inline-flex';
  button.style.alignItems = 'center';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#0073b1'; // LinkedIn blue
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.fontSize = '14px';
  button.style.fontWeight = '600';
  button.style.cursor = 'pointer';
  button.style.marginLeft = '8px';

  // Add an icon (using a base64-encoded image or a URL if available)
  const icon = document.createElement('span');
  icon.textContent = '📧'; // Placeholder emoji
  icon.style.marginRight = '8px';
  icon.style.fontSize = '16px';
  button.insertBefore(icon, button.firstChild);

  // Add click event listener to dispatch sidePanelToggle event
  button.addEventListener('click', () => {
    console.log('Button clicked, dispatching sidePanelToggle event');
    window.dispatchEvent(new CustomEvent('sidePanelToggle'));
  });

  // Append the button to the container
  buttonContainer.appendChild(button);
  console.log('Button created and appended to buttonContainer using document.createElement');

  // Inject the button inline
  ensureButtonPosition();
  isInjected = true;

  // Log the company name for debugging
  const companyName = getCompanyNameFromDOM();
  console.log('Company Name:', companyName);
};

export const cleanupInjection = () => {
  if (buttonShadowHost) {
    buttonShadowHost.remove();
    buttonShadowHost = null;
  }
  buttonContainer = null;
  isInjected = false;
  targetElement = null;
};

export const getButtonContainer = () => buttonContainer;