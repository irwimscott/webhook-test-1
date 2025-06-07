/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var token = process.env.TOKEN || 'token';
var received_updates = [];

app.get('/', function(req, res) {
  res.send(`
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
  `);
});

app.get(['/facebook', '/instagram', '/threads'], function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    // Exibe o hub.challenge e a origem do request na tela
    res.send(`
      <html>
        <head><title>Webhook Challenge</title></head>
        <body>
          <h2>Webhook Challenge Recebido</h2>
          <p><strong>hub.challenge:</strong> ${req.query['hub.challenge']}</p>
          <p><strong>Origem do Request:</strong> ${req.originalUrl}</p>
        </body>
      </html>
    `);
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function(req, res) {
  console.log('Facebook request body:', req.body);

  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  console.log('request header X-Hub-Signature validated');
  // Process the Facebook updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.post('/instagram', function(req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  // Process the Instagram updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.post('/threads', function(req, res) {
  console.log('Threads request body:');
  console.log(req.body);
  // Process the Threads updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.listen();
