import { createApp } from './app';
import { loadServerConfig } from './config/env';

const config = loadServerConfig();
const app = createApp();

app.listen(config.port, config.host, () => {
    console.log(`server running at http://${config.host}:${config.port}`);
});
