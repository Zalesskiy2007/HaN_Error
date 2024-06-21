import React from 'react';
import { Map } from '../components/map/Map';

import { Redirect, Switch } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import * as cookie from "../utils/Cookie-util";
import {User, Friend, _User, _Friend} from "../User";

export function MapPage(props: {socket: Socket, user: _User, friends: _Friend[], isAuth: Boolean}) {
    if (props.isAuth) {
        return (
            <div className="map-wrapper">
                <Map socket={props.socket} user={props.user} friends={props.friends} isAuth={props.isAuth}/>
            </div>
        );
    } else {
       return (
            <Switch>
                <Redirect exact from="/" to="/login" />
                <Redirect exact from="/map" to="/login" />
            </Switch>            
       ); 
    }          
}
