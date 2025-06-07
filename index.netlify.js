/**
 * Versão para Netlify Functions: não inclui servidor embutido.
 * Exporte handlers para cada rota como funções separadas.
 */

const token = process.env.TOKEN || 'token';
let received_updates = [];

// Handler para a página principal
exports.handler = async function(event, context) {
  if (event.path === "/" && event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <html>
          <head>
            <title>Webhook Test</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background: #f9f9f9; }
              h1 { color: #333; }
              pre { background: #eee; padding: 16px; border-radius: 8px; }
            </style>
          </head>
          <body>
            <h1>Bem-vindo ao Webhook Test</h1>
            <p>Use este endpoint para testar webhooks do Facebook, Instagram e Threads.</p>
            <h2>Últimos Webhooks Recebidos</h2>
            <pre>${JSON.stringify(received_updates, null, 2)}</pre>
          </body>
        </html>
      `
    };
  }

  // Webhook GET para verificação
  if (["/facebook", "/instagram", "/threads"].includes(event.path) && event.httpMethod === "GET") {
    const params = event.queryStringParameters || {};
    if (params['hub.mode'] === 'subscribe' && params['hub.verify_token'] === token) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: `
          <html>
            <head><title>Webhook Challenge</title></head>
            <body>
              <h2>Webhook Challenge Recebido</h2>
              <p><strong>hub.challenge:</strong> ${params['hub.challenge']}</p>
              <p><strong>Origem do Request:</strong> ${event.path}</p>
            </body>
          </html>
        `
      };
    } else {
      return { statusCode: 400 };
    }
  }

  // Webhook POST para Facebook, Instagram, Threads
  if (["/facebook", "/instagram", "/threads"].includes(event.path) && event.httpMethod === "POST") {
    let body = {};
    try { body = JSON.parse(event.body); } catch {}
    received_updates.unshift(body);
    return { statusCode: 200 };
  }

  // Not found
  return { statusCode: 404 };
};
