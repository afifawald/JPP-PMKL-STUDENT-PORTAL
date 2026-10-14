// ══ CLOUDFLARE WORKER ROUTER (STATIC ASSETS + API) ══
import * as statusApi from './functions/api/status.js';
import * as annApi from './functions/api/announcements.js';
import * as eventsApi from './functions/api/events.js';
import * as rentalsApi from './functions/api/rentals.js';
import * as albumApi from './functions/api/album.js';
import * as printingApi from './functions/api/printing.js';
import * as printJobsApi from './functions/api/print-jobs.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const context = { request, env };

    // API Routes
    if (url.pathname === '/api/status') {
      if (request.method === 'POST') return statusApi.onRequestPost(context);
      if (request.method === 'OPTIONS') return statusApi.onRequestOptions();
      return statusApi.onRequestGet(context);
    }

    if (url.pathname === '/api/announcements') {
      if (request.method === 'POST') return annApi.onRequestPost(context);
      if (request.method === 'DELETE') return annApi.onRequestDelete(context);
      if (request.method === 'OPTIONS') return annApi.onRequestOptions();
      return annApi.onRequestGet(context);
    }

    if (url.pathname === '/api/events') {
      if (request.method === 'POST') return eventsApi.onRequestPost(context);
      if (request.method === 'DELETE') return eventsApi.onRequestDelete(context);
      if (request.method === 'OPTIONS') return eventsApi.onRequestOptions();
      return eventsApi.onRequestGet(context);
    }

    if (url.pathname === '/api/rentals') {
      if (request.method === 'POST') return rentalsApi.onRequestPost(context);
      if (request.method === 'DELETE') return rentalsApi.onRequestDelete(context);
      if (request.method === 'OPTIONS') return rentalsApi.onRequestOptions();
      return rentalsApi.onRequestGet(context);
    }

    if (url.pathname === '/api/album') {
      if (request.method === 'POST') return albumApi.onRequestPost(context);
      if (request.method === 'DELETE') return albumApi.onRequestDelete(context);
      if (request.method === 'OPTIONS') return albumApi.onRequestOptions();
      return albumApi.onRequestGet(context);
    }

    if (url.pathname === '/api/printing') {
      if (request.method === 'POST') return printingApi.onRequestPost(context);
      if (request.method === 'OPTIONS') return printingApi.onRequestOptions();
      return printingApi.onRequestGet(context);
    }

    if (url.pathname === '/api/print-jobs') {
      if (request.method === 'POST') return printJobsApi.onRequestPost(context);
      if (request.method === 'OPTIONS') return printJobsApi.onRequestOptions();
      return printJobsApi.onRequestGet(context);
    }

    // Serve Static Assets (HTML, CSS, JS, Images)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  }
};
