const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const bodyParser = require('body-parser');

const PORT = 8000;

server.use(bodyParser.json());
server.use(middlewares);

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port http://localhost:${PORT}`);
});
