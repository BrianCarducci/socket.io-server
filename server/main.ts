import express from 'express';
const app = express();

import http from 'http';
const httpServer = http.createServer(app);

import cookieParser from 'cookie-parser';
import { RoomsState } from './model/Room';
import { socketSetup } from './socket';


app.use(express.json());
app.use(cookieParser());
app.use(require('./routes'));
app.use(express.static('client'));

export const roomsState = new RoomsState();

socketSetup(httpServer);

httpServer.listen(3000, () => console.log('listening on *:3000'));
