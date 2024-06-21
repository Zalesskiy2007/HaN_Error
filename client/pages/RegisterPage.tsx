import React, { ChangeEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Redirect, Switch} from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import * as cookie from "../utils/Cookie-util";
import {User, Friend, _User, _Friend} from "../User";
import { imageToData, dataToImage } from '../utils/Image';

export function RegisterPage(props: {socket: Socket, user: _User, friends: _Friend[], isAuth: Boolean}) {
    const history = useHistory();

    if (props.isAuth) {
        return (<Switch><Redirect exact from="/register" to="/map" /> </Switch>);                
    }

    const [usernameStatus, setUsernameStatus] = useState<boolean | null>(null);
    let [usName, setUsName] = useState("");
    const [profilePhotoSelected, setProfilePhotoSelcted] =
        useState<boolean>(false);

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const username = event.target.value;        
        setUsName(username);
    };

    useEffect(() => {
        props.socket.emit("checkLogin", usName);
    }, [usName]);

    useEffect(() => {
        props.socket.on("checkLoginResponse", (data) => {
            let obj = JSON.parse(data);
            if (obj.status === "null")
                setUsernameStatus(null);
            else if (obj.status === "avaliable")
                setUsernameStatus(true);
            else if (obj.status === "not_avaliable")
                setUsernameStatus(false);
        });
    }, []);

    const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setProfilePhotoSelcted(true);
        } else {
            setProfilePhotoSelcted(false);
        }
    };

    let submitForm = () => {
        let n = document.getElementById("inpNameReg") as HTMLInputElement;
        let pass = document.getElementById("inpPassReg") as HTMLInputElement;
        let log = document.getElementById("username") as HTMLInputElement;
        let file = document.getElementById('profile-photo') as HTMLInputElement;        
        if (file !== null && usernameStatus === true && n.value !== '' && pass.value !== '' && file.files !== null && file.files[0] !== undefined) {
            let url = URL.createObjectURL(file.files[0]);
            let newImg = document.createElement('img');
            newImg.src = url;

            newImg.onload = () => {
                newImg.width = 512;
                newImg.height = 512; 

                imageToData(newImg, (data: any) => {
                    let newSrc = dataToImage(data, newImg.width, newImg.height);

                    let d = {
                        login: log.value,
                        password: pass.value,
                        name: n.value,
                        imgW: 512,
                        imgH: 512,
                        img: newSrc
                    };
                    props.socket.emit("registerSubmit", JSON.stringify(d));
                });
            };            
        }        
    }

    return (
        <div className="login-wrapper">
            <div className="login-content">
                <div className="login-content-wrapper">
                    <div className="div-row row-title">
                        <h2>Create an account</h2>
                    </div>
                    <div className="register-div-row row-name">
                        <input
                            id='inpNameReg'                        
                            type="text"
                            className="register-input"
                            placeholder="your name"
                        />
                    </div>
                    <div className="register-div-row row-username">
                        <input
                            id="username"
                            type="text"
                            className="register-input"
                            placeholder="username"
                            onChange={handleUsernameChange}
                        />
                        <label
                            htmlFor="username"
                            id="username_label"
                            style={{ color: usernameStatus ? 'green' : 'red' }}
                        >
                            {usernameStatus === null
                                ? ''
                                : usernameStatus === true
                                ? 'username is available'
                                : 'username is not available'}
                        </label>
                    </div>
                    <div className="register-div-row row-password">
                        <input
                            type="password"
                            className="register-input"
                            placeholder="password"
                            id='inpPassReg'
                        />
                    </div>
                    <div className="register-div-row row-image">
                        <input
                            type="file"
                            id="profile-photo"
                            accept="image/*"
                            className="register-input"
                            onChange={handleProfilePhotoChange}
                            style={{ display: 'none' }}
                        />
                        <button
                            className="profile-photo-button"
                            onClick={() =>
                                document
                                    .getElementById('profile-photo')
                                    ?.click()
                            }
                        >
                            Profile photo{' '}
                            {profilePhotoSelected && <span>&#10004;</span>}
                        </button>
                    </div>
                    <div className="register-div-row">
                        <button
                            className="register-create-button"
                            onClick={submitForm}
                        >
                            {' '}
                            Create
                        </button>
                    </div>
                    <div className="register-div-row">
                        <button
                            className="register-signin-button"
                            onClick={() => history.push('/login')}
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
