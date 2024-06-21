import mongoose from 'mongoose';

let UserS = new mongoose.Schema({
    name: String,
    login: String,
    password: String,
    coordLng: Number,
    coordLat: Number,
    sessionId: Number,
    friends: [Number],
    friendsReceivedReq: [Number],
    friendsSentReq: [Number],
    imageSrc: String,
    imageWidth: Number,
    imageHeight: Number,
    trackingGeo: Boolean,
    mapStyle: Number
});

let User = mongoose.model('Users', UserS);
export { User };
