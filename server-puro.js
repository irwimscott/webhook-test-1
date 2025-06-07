const http = require('http');

const PORT = 5000;

const server = http.createServer((req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    // Parse headers
    const host = req.headers['host'] || '';
    const userAgent = req.headers['user-agent'] || '';

    // Prepare response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Node.js HTTP Server</title></head>
        <body>
          <h2>Request Recebido</h2>
          <p><strong>Método:</strong> ${req.method}</p>
          <p><strong>URL:</strong> ${req.url}</p>
          <p><strong>Host:</strong> ${host}</p>
          <p><strong>User-Agent:</strong> ${userAgent}</p>
          <h3>Body:</h3>
          <pre>${body}</pre>
        </body>
      </html>
    `);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
