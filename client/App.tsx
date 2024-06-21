import React, { useEffect, useRef, useState } from 'react';
import { BottomNavigation } from './components/common/Navigation';
import { MapPage } from './pages/MapPage';
import { SettingsPage } from './pages/SettingsPage';
import { FriendsPage } from './pages/FriendsPage';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { io } from 'socket.io-client';
import {User, Friend, _User, _Friend} from "./User";
import * as cookie from "./utils/Cookie-util";

export function App() {
    let [socket, setSocket] = useState(io());
    //cookie.deleteCookie(cookie.name); //reset

    let [sesId, setSesId] = useState<string>(cookie.getCookie(cookie.name));
    const setAuthFromSesId = (idData: string) => {
        if (idData === cookie.noneValue) return false;
        else return true;         
    };

    let [isAuth, setIsAuth] = useState(setAuthFromSesId(sesId));

    let intervalReq = useRef<NodeJS.Timeout | undefined>(undefined);

    let [user, setUser] = useState<_User>(User("abc", "test", -1, -1, -1, [-1], [-1], [-1], "-", false, -1));
    let [friends, setFriends] = useState<_Friend[]>([Friend("fr", "fr", -1, -1, -1, "-", false)]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log(`Connected with socketID: ${socket.id}`);            
        });        
        
        socket.on("logIn", (data) => {
            let d = JSON.parse(data).sesId.toString();
            cookie.setCookie(cookie.name, d);             
            setSesId(d);          
        });
        socket.on("logOut", () => {
            cookie.deleteCookie(cookie.name);      
            setSesId(cookie.noneValue);     
        });

        socket.on("setPerson", (data) => {
            let d = JSON.parse(data);

            let us = User(d.name, d.login, d.id, d.coordLng, d.coordLat, d.friends, d.friendsReceivedReq, d.friendsSentReq, d.imageSrc, d.trackingGeo, d.mapStyle);
            setUser(us);
        });
        
        return () => {
            socket.off("connect");
            clearInterval(intervalReq.current);
        };        
    }, []);

    useEffect(() => {
        let b = setAuthFromSesId(sesId);
        setIsAuth(b); 

        if (b === true) {
            clearInterval(intervalReq.current);
            intervalReq.current = setInterval(() => {                
                // socket emit request data about users and person themself, and maybe send new geo
                socket.emit("requestPerson", sesId);
            }, 2000);
        } else {
            clearInterval(intervalReq.current);
        }  
    }, [sesId]);

    return (
        <Router>
            <div className="app-container">
                <Switch>
                    <Route path="/map" render={(props) => (<MapPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/settings" render={(props) => (<SettingsPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/friends" render={(props) => (<FriendsPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />
                    <Route path="/login" render={(props) => (<LoginPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)}/> 
                    <Route path="/register" render={(props) => (<RegisterPage {...props} socket={socket} user={user} friends={friends} isAuth={isAuth}/>)} />                    
                    <Redirect exact from="/" to="/map" />
                </Switch>
                <BottomNavigation />
            </div>
        </Router>
    );
}