// import { useState } from "react"
import EventsBrowser from "../Events/EventsBrowser";
import GroupsBrowser from "../Groups/GroupsBrowser";
import './Browse.css'
import { Outlet, useNavigate } from "react-router-dom";

export default function Browser() {

    const navigate = useNavigate();

    const url = window.location.href.split('/')[3];

    return (
        <div id='browsePage'>
            {/* <button
            id='eventButtonBrowse'
            onClick={() => {
                if(url !== 'events'){
                    navigate('/events')
                }
            }}
            >Events</button>
            <button
            id='groupButtonBrowse'
            onClick={() => {
                if(url !== 'groups'){
                    navigate('/groups')
                }
            }}
            >Groups</button> */}
            <div id='selectionHeader'>
                <h2
                onClick={() => {
                    if(url !== 'events'){
                        navigate('/events')
                    }
                }}
                className={url === 'events'? "active neutral":"inactive clickable"}
                >{'Events'}</h2>
                <h2
                onClick={() => {
                    if(url !== 'groups'){
                        navigate('/groups')
                    }
                }}
                className={url === 'groups'? "active neutral":"inactive clickable"}
                >{'Groups'}</h2>
            </div>
            <div id='browseDisplay'>
                {url === 'groups'?<GroupsBrowser />:<EventsBrowser/>}
            </div>
            <Outlet/>
        </div>
    )
}
