import React from 'react';
import { useHistory } from 'react-router';

import { Redirect, Switch} from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import * as cookie from "../utils/Cookie-util";
import {User, Friend, _User, _Friend} from "../User";

export function LoginPage(props: {socket: Socket, user: _User, friends: _Friend[], isAuth: Boolean}) {
    const history = useHistory();

    if (props.isAuth) {                
        return (<Switch><Redirect exact from="/login" to="/map" /></Switch>);                
    }

    return (
        <div className="login-wrapper">
            <div className="login-content">
                <div className="login-content-wrapper">
                    <div className="div-row row-title">
                        <h2>Sign in</h2>
                    </div>
                    <div className="div-row row-username">
                        <input
                            type="text"
                            className="input"
                            placeholder="username"
                        />
                    </div>
                    <div className="div-row row-password">
                        <input
                            type="password"
                            className="input"
                            placeholder="password"
                        />
                    </div>
                    <div className="div-row">
                        <button
                            className="submit-button"
                            onClick={() => {
                                history.push('/map');
                            }}
                        >
                            Login
                        </button>
                    </div>
                    <div className="div-row">
                        <button
                            className="signup-button"
                            onClick={() => history.push('/register')}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
