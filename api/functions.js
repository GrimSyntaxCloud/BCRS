const { app } = require('@azure/functions');
const { createHandler } = require('./handler');
app.http('bcrs', {
  route: '{*path}', authLevel: 'anonymous',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], handler: createHandler(),
});
