// src/content/utils.ts
const JOB_CONTAINER_SELECTOR = 'div.jobs-details__main-content';
const JOB_TITLE_SELECTOR = '.job-details-jobs-unified-top-card__job-title';

let jobLoadObserver: MutationObserver | null = null;

export const waitForJobPostLoad = (callback: () => void, retryCount = 0, maxRetries = 20) => {
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

export const cleanupJobLoadObserver = () => {
  if (jobLoadObserver) {
    jobLoadObserver.disconnect();
    jobLoadObserver = null;
  }
};