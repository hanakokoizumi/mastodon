import api from 'mastodon/api';
import { oidc_enabled } from 'mastodon/initial_state';

/**
 * GET the URL returned by the server after sign-out (e.g. OIDC RP-initiated logout)
 * without navigating the main window away from the SPA. Only used when OIDC is enabled.
 */
function xhrGet(url: string): Promise<void> {
  const absolute = new URL(url, window.location.href).toString();

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', absolute, true);
    xhr.withCredentials = true;
    xhr.timeout = 15_000;
    xhr.onload = () => resolve();
    xhr.onerror = () => resolve();
    xhr.ontimeout = () => resolve();
    xhr.send();
  });
}

export async function logOut() {
  try {
    const response = await api(false).delete<{ redirect_to?: string }>(
      '/auth/sign_out',
      { headers: { Accept: 'application/json' }, withCredentials: true },
    );

    if (response.status !== 200) {
      console.error(
        'Failed to log out, got an unexpected response from the server',
        response,
      );
      return;
    }

    const redirectTo = response.data.redirect_to;

    if (oidc_enabled) {
      if (typeof redirectTo === 'string' && redirectTo.length > 0) {
        await xhrGet(redirectTo);
      }

      window.location.href = '/';
    } else if (typeof redirectTo === 'string' && redirectTo.length > 0) {
      window.location.href = redirectTo;
    } else {
      console.error(
        'Failed to log out, got an unexpected non-redirect response from the server',
        response,
      );
    }
  } catch (error) {
    console.error('Failed to log out, response was an error', error);
  }
}
