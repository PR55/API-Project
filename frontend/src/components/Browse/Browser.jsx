// import { useState } from "react"
import EventsBrowser from "../Events/EventsBrowser";
import GroupsBrowser from "../Groups/GroupsBrowser";
import './Browse.css'
import { useNavigate } from "react-router-dom";

export default function Browser() {

    const navigate = useNavigate();

    const url = window.location.href.split('/')[3];

    return (
        <div id='browsePage'>
            <button
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
            >Groups</button>
            <div id='browseDisplay'>
                {url === 'groups'?<GroupsBrowser />:<EventsBrowser/>}
            </div>
        </div>
    )
}
