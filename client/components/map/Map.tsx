import React from 'react';
import Maplibre from '../../../node_modules/react-map-gl/dist/es5/exports-maplibre';
import { Marker } from './Popup';

import { Socket, io } from 'socket.io-client';
import * as cookie from "../../utils/Cookie-util";
import {User, Friend, _User, _Friend} from "../../User";

export function Map(props: {socket: Socket, user: _User, friends: _Friend[], isAuth: Boolean}) {
    const spbCoords = {
        lng: 30.3158,
        lat: 59.9398
    };

    return (
        <Maplibre
            onClick={() => {}}
            id="map"
            initialViewState={{
                longitude: spbCoords.lng,
                latitude: spbCoords.lat,
                zoom: 18
            }}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=tgMhLsjzo9PFbyrDjEbt"
        >
            <div className="popup-wrapper">
                <Marker
                    lng={spbCoords.lng}
                    lat={spbCoords.lat}
                    imageURL={props.user.imageSrc}
                />
            </div>
        </Maplibre>
    );
}
