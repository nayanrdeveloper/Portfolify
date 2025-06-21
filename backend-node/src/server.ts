import { app } from './app';
import { connectMongo } from './config/mongodb';
import { env } from './config/env';

(async () => {
  await connectMongo();
  const server = app.listen(env.PORT, () =>
    console.log(`🚀 Server ready @ http://localhost:${env.PORT}`)
  );

  process.on('SIGTERM', () => server.close());
})();
