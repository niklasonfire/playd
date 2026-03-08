export async function executeAutomation(automation) {
  const { method, url, headers = [], body } = automation;
  const headerObj = {};
  headers.forEach((h) => { if (h.key.trim()) headerObj[h.key.trim()] = h.value; });

  const opts = { method, headers: headerObj };
  if (["POST", "PUT", "PATCH"].includes(method) && body) {
    opts.body = body;
  }

  try {
    const res = await fetch(url, opts);
    let responseBody;
    try { responseBody = await res.text(); } catch { responseBody = ""; }
    if (responseBody.length > 4000) responseBody = responseBody.slice(0, 4000) + "\n...(truncated)";
    return {
      ok: res.ok, status: res.status, statusText: res.statusText,
      body: responseBody, timestamp: new Date().toISOString(), error: null,
    };
  } catch (err) {
    return {
      ok: false, status: 0, statusText: "Network Error",
      body: "", timestamp: new Date().toISOString(), error: err.message,
    };
  }
}
