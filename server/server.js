import http from 'https';
import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import jwt from 'jsonwebtoken';
import generateUniqueId from 'generate-unique-id';

import { User } from './user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cookieNoneValue = '-1';

const app = express();
app.use(morgan('combined'));
app.use(express.static('.'));
app.use(express.static('../client'));
app.use(express.static('../client/assets/fonts'));
app.use(express.static('../client/assets/images'));
app.use(express.static('../client/styles'));
app.use(express.static('../node_modules/maplibre-gl/dist'));

app.get('/login', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/register', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/map', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/friends', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/settings', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/index.html'));
});

app.use('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../out/pageNotFound.html'));
});

const server = http.createServer(
    {
        key: fs.readFileSync('../cert/key.pem'),
        cert: fs.readFileSync('../cert/cert.pem')
    },
    app
);

const io = new Server(server);

mongoose.connect('mongodb://127.0.0.1:27017/HereAndNow');

io.on('connection', (socket) => {
    console.log(`Client connected with id: ${socket.id}`); // WHY SUCH A LOT OF CONNECTIONS???!!!

    // Clear database
    /*User.find()
        .then((res) => {
            for (let i = 0; i < res.length; i = i + 1) {
                User.deleteOne({ login: res[i].login })
                    .then(() => {
                        console.log('Deleted succeed!');
                    })
                    .catch((err) => console.log(err));
            }
        })
        .catch((err) => console.log(err)); */

    socket.on('checkLogin', (data) => {
        let obj = {
            status: 'null'
        };

        if (data === '') {
            obj.status = 'null';
            socket.emit('checkLoginResponse', JSON.stringify(obj));
        } else {
            User.findOne({ login: data })
                .then((res) => {
                    if (res !== null) obj.status = 'not_avaliable';
                    else obj.status = 'avaliable';

                    socket.emit('checkLoginResponse', JSON.stringify(obj));
                })
                .catch((err) => {
                    console.log('Error: ' + err);
                    obj.status = 'null';
                    socket.emit('checkLoginResponse', JSON.stringify(obj));
                });
        }
    });

    socket.on('registerSubmit', (data) => {
        let d = JSON.parse(data);

        User.find()
            .then((res) => {
                let search = true;
                let gen = -1;

                while (search) {
                    let newSesId = generateUniqueId({
                        length: 32,
                        useLetters: false,
                        useNumbers: true
                    });

                    let find = false;
                    for (let i = 0; i < res.length; i = i + 1) {
                        if (res[i].sessionId === newSesId) {
                            find = true;
                            break;
                        }
                    }

                    if (!find) {
                        search = false;
                        gen = newSesId;
                    }
                }

                let pers = new User({
                    name: d.name,
                    login: d.login,
                    password: d.password,
                    coordLng: 0,
                    coordLat: 0,
                    sessionId: gen,
                    friends: [],
                    friendsReceivedReq: [],
                    friendsSentReq: [],
                    imageSrc: d.img,
                    imageWidth: d.imgW,
                    imageHeight: d.imgH,
                    trackingGeo: true,
                    mapStyle: 0
                });

                pers.save()
                    .then((res) => {
                        socket.emit('logIn', JSON.stringify({ sesId: res.sessionId }));
                    })
                    .catch((err) => {
                        console.log('Error: ' + err);
                    });
            })
            .catch((err) => {
                console.log('Error: ' + err);
            });
    });

    socket.on('requestPerson', (data) => {
        if (data !== cookieNoneValue) {
            let sId = parseInt(data);

            User.findOne({ sessionId: sId })
                .then((res) => {
                    if (!res) {
                        //todo
                        socket.emit('logOut');
                    } else {
                        let obj = {
                            name: res.name,
                            login: res.login,
                            id: res._id,
                            coordLng: res.coordLng,
                            coordLat: res.coordLat,
                            friends: res.friends,
                            friendsReceivedReq: res.friendsReceivedReq,
                            friendsSentReq: res.friendsSentReq,
                            imageSrc: res.imageSrc,
                            trackingGeo: res.trackingGeo,
                            mapStyle: res.mapStyle
                        };

                        socket.emit('setPerson', JSON.stringify(obj));
                    }
                })
                .catch((err) => {
                    console.log(err);

                    //todo
                    socket.emit('logOut');
                });
        } else {
            //todo
            socket.emit('logOut');
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected with id: ${socket.id}`);
    });
});

mongoose.connection.once('open', () => {
    console.log('Connected to database!');
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on port ${server.address().port} :)`);
    });
});
