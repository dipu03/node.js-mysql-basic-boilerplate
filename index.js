
const app = require('./app.js');
const config = require('./src/config/config.js');
const logger = require('./src/config/logger.js');
const socket = require("socket.io")

const http = require('http');


let servers = http.createServer(app);
// const io = new Server(server);

const io = socket(servers, {
    cors: {
        origin: '*'
    }
});
app.set('socketio', io)

let server = servers.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
});


//server exit operations
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

//unexpectedError handler
const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', exitHandler);
