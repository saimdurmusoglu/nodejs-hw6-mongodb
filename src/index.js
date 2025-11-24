//  src/index.js
import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

import './db/models/user.js';
import './db/models/session.js';
import './db/models/contact.js';

(async () => {
  await initMongoConnection();
  setupServer();
})();
