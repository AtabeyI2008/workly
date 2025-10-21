// Simple API wrapper that uses fetch and the APP_CONFIG.API_BASE
(function(global){
  const API_BASE = (global.APP_CONFIG && global.APP_CONFIG.API_BASE) || "/api";

  function getToken() {
    try { return localStorage.getItem("token"); } catch(e){ return null; }
  }

  async function request(path, opts = {}) {
    const url = API_BASE + path;
    const method = opts.method || 'GET';
    const headers = opts.headers || {};
    const body = opts.body;

    if (getToken()) headers['Authorization'] = 'Bearer ' + getToken();
    const fetchOpts = { method, headers };
    if (body) {
      if (body instanceof FormData) {
        fetchOpts.body = body;
      } else {
        headers['Content-Type'] = 'application/json';
        fetchOpts.body = JSON.stringify(body);
      }
    }
    const res = await fetch(url, fetchOpts);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();
      if (!res.ok) throw { status: res.status, body: json };
      return json;
    } else {
      const text = await res.text();
      if (!res.ok) throw { status: res.status, body: text };
      return text;
    }
  }

  global.API = {
    request,
    get: (p) => request(p, { method: 'GET' }),
    post: (p, b) => request(p, { method: 'POST', body: b }),
    put: (p, b) => request(p, { method: 'PUT', body: b }),
    del: (p) => request(p, { method: 'DELETE' })
  };
})(window);
console.log("API wrapper loaded, API_BASE:", window.APP_CONFIG && window.APP_CONFIG.API_BASE);
