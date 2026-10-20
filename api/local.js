// Local preview of the same API used by Azure Functions. Not included in deployment.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { HttpRequest } = require('@azure/functions');
const { createHandler } = require('./handler');
const handler = createHandler();
const root = path.resolve(__dirname, '../dist/bcrs');
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname.startsWith('/api/')) {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (Buffer.byteLength(raw) > 16384) { res.writeHead(413).end(); return; }
      }
      const request = new HttpRequest({
        url: `http://localhost${req.url}`, method: req.method,
        headers: req.headers, params: { path: pathname.slice(5) },
        ...(['POST', 'PUT'].includes(req.method) ? { body: { string: raw } } : {}),
      });
      const result = await handler(request);
      res.writeHead(result.status, { ...result.headers, 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.jsonBody));
      return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    const file = path.resolve(root, '.' + decodeURIComponent(pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(404).end(); return; }
    const contents = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : contents);
  } catch {
    res.writeHead(404).end('Not found');
  }
});
server.listen(process.env.PORT || 3000, process.env.HOST || '127.0.0.1',
  () => console.log('BCRS local demo ready.'));
