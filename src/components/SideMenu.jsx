import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie, faReceipt, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'


import PropTypes from 'prop-types';

export default function SideMenu({OnResume, OnLogs, OnCreateCategories}) {
    // Rest of the code

SideMenu.propTypes = {
    OnResume: PropTypes.func.isRequired,
    OnLogs: PropTypes.func.isRequired,
    OnCreateCategories: PropTypes.func.isRequired,
};
    const [active, setActive] = useState(false)
    return(
        <div 
            className={`absolute flex rounded-r-3xl z-50 flex-col text-textAccentPalette items-center justify-center h-auto bg-accentPalette ${active ? "w-26" : "w-12"}`}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}    
        >
            <div 
                className="p-2 w-full flex flex-row gap-2 items-center hover:bg-hoverPalette rounded-tr-3xl cursor-pointer"
                onClick={() => {OnResume(true); OnLogs(false); OnCreateCategories(false)}}
            >
                <FontAwesomeIcon className="text-2xl " icon={faChartPie} />
                {active ? <h1>Stadistics</h1> : null}
            </div>
            <div 
                className="p-2 pl-3 w-full flex flex-row gap-2 items-center hover:bg-hoverPalette cursor-pointer"
                onClick={() => {OnResume(false); OnLogs(true); OnCreateCategories(false)}}
            >
                <FontAwesomeIcon className="text-2xl" icon={faReceipt} />
                {active ? <h1>Add logs</h1> : null}
            </div>
            <div 
                className="p-2 w-full flex flex-row gap-2 items-center hover:bg-hoverPalette rounded-ee-3xl cursor-pointer"
                onClick={() => {OnResume(false); OnLogs(false); OnCreateCategories(true)}}
            >
                <FontAwesomeIcon className="text-2xl " icon={faLayerGroup} />
                {active ? <h1>Manage C/T</h1> : null}
            </div>
        </div>
    )
}