import app from './app';

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`[Server] listening at http://localhost:${port}`);
  app.emit('listen', server);
});
