import 'dotenv/config';
import app, {setServer} from './app.js';

import connectDB from './configs/db_connection.js';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);

        const server= app.listen(PORT, () => {
            console.log(`🚀 Server started on port ${PORT}`);
        });
        setServer(server); // Assign the server instance to the exported variable
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();