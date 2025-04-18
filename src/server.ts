import { config } from 'dotenv';
config();
import app from "./app";

import { log } from 'console';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    log(`🚀 Server running on http://localhost:${PORT}`);
});