import { app } from './app';
import { env } from './config/env';
import { connectMongo } from './config/mongodb';

(async () => {
    await connectMongo();
    const server = app.listen(env.PORT, () =>
        console.log(`🚀 Server ready @ http://localhost:${env.PORT}`),
    );

    process.on('SIGTERM', () => server.close());
})();
