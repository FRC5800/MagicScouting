// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import { LiveUpdate } from "@capawesome/capacitor-live-update";

const initializeApp = async () => {
  LiveUpdate.addListener('nextBundleSet', async () => {
    const shouldReload = confirm('A new update is available. Would you like to install it now?');
    if (shouldReload) {
      // Reload the webview to apply the update immediately
      await LiveUpdate.reload();
    }
  });
};

initializeApp()