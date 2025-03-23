// utils/helpers.ts
export const debounce = <F extends (...args: any[]) => void>(func: F, wait: number): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const getCompanyNameFromDOM = (): string | null => {
  const jobTitleElement = document.querySelector('h1.t-24.t-bold');
  if (jobTitleElement) {
    const companyElement = document.querySelector('a[href*="/company/"]');
    return companyElement?.textContent?.trim() || null;
  }
  return null;
};

// utils/helpers.ts
export const injectElement = (element: HTMLElement, target: Element, position: 'before' | 'after') => {
  try {
    if (!target.parentNode) {
      console.warn('Target parent node not found, appending to body as fallback');
      document.body.appendChild(element);
      return;
    }
    if (position === 'before') {
      target.parentNode.insertBefore(element, target);
    } else {
      target.parentNode.insertBefore(element, target.nextSibling);
    }
  } catch (error) {
    console.error('Injection failed:', error);
    document.body.appendChild(element);
    console.warn('Fallback: Appended to body due to injection failure');
  }
};

export const isLinkedInJobPage = (): boolean => {
  return window.location.href.includes('linkedin.com/jobs/') || window.location.href.includes('http://localhost:3000/');
};

// utils/helpers.ts
// Utility to detect email provider and get compose URL
export const getComposeUrl = (userEmail: string, recipientEmails: string[], subject: string, body: string): string => {
  const domain = userEmail.split('@')[1]?.toLowerCase();
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const emailList = recipientEmails.join(',');

  switch (domain) {
    case 'gmail.com':
      return `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${emailList}&su=${encodedSubject}&body=${encodedBody}`;
    case 'yahoo.com':
      return `https://mail.yahoo.com/d/compose?to=${emailList}&subject=${encodedSubject}&body=${encodedBody}`;
    case 'outlook.com':
    case 'hotmail.com':
      return `https://outlook.live.com/mail/deeplink/compose?to=${emailList}&subject=${encodedSubject}&body=${encodedBody}`;
    case 'aol.com':
      return `https://mail.aol.com/webmail-std/en-us/compose?to=${emailList}&subject=${encodedSubject}&body=${encodedBody}`;
    default:
      // Fallback to mailto: if provider is unknown
      return `mailto:${emailList}?subject=${encodedSubject}&body=${encodedBody}`;
  }
};