const http = require('http');
const fs = require('fs');
const path = require('path');

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || '1234');
const root = path.resolve(process.cwd(), 'public');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8'
};

function sendFile(filePath, response) {
  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    'Content-Type': mimeTypes[extension] || 'application/octet-stream'
  });
  fs.createReadStream(filePath).pipe(response);
}

function resolvePath(requestPath) {
  const decodedPath = decodeURIComponent((requestPath || '/').split('?')[0]);
  const normalizedPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const candidate = path.normalize(path.join(root, normalizedPath));

  if (!candidate.startsWith(root)) {
    return null;
  }

  return candidate;
}

const server = http.createServer((request, response) => {
  const candidate = resolvePath(request.url);

  if (!candidate) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  fs.stat(candidate, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(candidate, response);
      return;
    }

    const indexPath = path.join(candidate, 'index.html');
    fs.stat(indexPath, (indexError, indexStats) => {
      if (!indexError && indexStats.isFile()) {
        sendFile(indexPath, response);
        return;
      }

      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    });
  });
});

server.listen(port, host, () => {
  console.log(`Serving public at http://${host}:${port}`);
});
