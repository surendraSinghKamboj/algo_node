const { app } = require('./app');
const { port } = require('./config/config');

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
