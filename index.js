const https = require("https");
module.exports = (req, res) => {
  const url = new URL(req.url, "https://api.telegram.org");
  const options = {
    hostname: "api.telegram.org",
    path: url.pathname + url.search,
    method: req.method,
    headers: { host: "api.telegram.org" }
  };
  const proxy = https.request(options, (pr) => {
    res.statusCode = pr.statusCode;
    Object.keys(pr.headers).forEach(k => res.setHeader(k, pr.headers[k]));
    pr.on("data", c => res.write(c));
    pr.on("end", () => res.end());
  });
  proxy.on("error", e => res.status(502).json({ok:false, error:e.message}));
  req.on("data", c => proxy.write(c));
  req.on("end", () => proxy.end());
};