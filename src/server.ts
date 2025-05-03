import app from "./app";
import config from "./module/config";

import { log } from 'console';

app.listen(config.PORT, () => {
    log(`🚀 Server running on http://localhost:${config.PORT}`);
});