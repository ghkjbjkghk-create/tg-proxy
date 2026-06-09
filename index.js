const https = require('https');

module.exports = (req, res) => {
  const url = new URL(req.url, 'https://api.telegram.org');
  const options = {
    hostname: 'api.telegram.org',
    path: url.pathname + url.search,
    method: req.method,
    headers: { ...req.headers, host: 'api.telegram.org' }
  };
  
  const proxy = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  proxy.on('error', (e) => {
    res.status(502).json({ ok: false, error: e.message });
  });
  
  req.pipe(proxy);
};
