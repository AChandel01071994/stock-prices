import * as socketIo from 'socket.io';
import * as http from 'http';
import { NextFunction } from 'express';
import * as _ from 'lodash';
import { eventNames } from 'cluster';

class SocketRoomService {
    io: socketIo.Server;
    socket: socketIo.Socket
    /**
     * 
     * @param server 
     */
    initSocket(server: http.Server): void {
        // initiate socket connection and configuration
        this.io = socketIo(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        });
        // socket adapter to integrate multiple node processes
        //this.io.adapter(socketRedis({ host: config.redis.host, port: config.redis.port }));

        // allow cross origin
        this.io.origins('*:*');

        this.io.once('connection', this.onConnection.bind(this));
    }
    // local implementation
    onConnection(socket: socketIo.Socket) {
        this.socket = socket;
        // === listen socket event ===
        this.socket.on('some-event', (data: any) => {
            console.log("some-event-called")
        });

        // === socket error event ===
        this.io.on('error', (err: any) => {
            // TODO: log errors
            throw new Error(err);
        });
    }

    emit(eventName: string, data: any) {
        // sending to all clients except sender
        this.socket.broadcast.emit(eventName, data);
    }
}

export default new SocketRoomService();


