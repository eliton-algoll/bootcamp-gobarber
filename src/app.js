import express from 'express';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // configurandoi a aplicação para aceitar requisições em Json
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

// exportando a instancia do App exportando apenas o server que será acessado externamente
export default new App().server;
