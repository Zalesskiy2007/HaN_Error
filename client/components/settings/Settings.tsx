import React from 'react';

import { Socket, io } from 'socket.io-client';
import * as cookie from "../../utils/Cookie-util";
import {User, Friend, _User, _Friend} from "../../User";

export function Settings(props: {socket: Socket, user: _User, friends: _Friend[], isAuth: Boolean}) {
    return (
        <div>
            <h1>Settings of {props.user.name}</h1>
        </div>
    );
}
