// server.js

const { app, server } = require('./app');
const { port } = require('./config/config');

server.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
