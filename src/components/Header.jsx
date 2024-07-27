import PropTypes from 'prop-types';
import { faChartPie, faReceipt, faLayerGroup, faDoorOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Header({OnResume, OnLogs, OnCreateCategories}){

    function handleCloseSession() {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        window.location.reload();
    }

    return(
        <>
            <div className='flex flex-row justify-between items-center px-4 md:px-8 mx-12 h-10 bg-accentPalette rounded-ee-3xl rounded-es-3xl'>
                <div className="flex flex-row gap-2 text-white">
                    <div 
                        className="p-1 sm:p-2 w-full flex flex-row gap-2 items-center hover:bg-hoverPalette cursor-pointer"
                        onClick={() => {OnResume(true); OnLogs(false); OnCreateCategories(false)}}
                    >
                        <FontAwesomeIcon className="text-1xl sm:text-2xl" icon={faChartPie} />
                    </div>
                    <div 
                        className="p-1 sm:p-2 w-full flex flex-row gap-2 items-center hover:bg-hoverPalette cursor-pointer"
                        onClick={() => {OnResume(false); OnLogs(true); OnCreateCategories(false)}}
                    >
                        <FontAwesomeIcon className="text-1xl sm:text-2xl" icon={faReceipt} />
                    </div>
                    <div 
                        className="p-1 sm:p-2 w-full flex flex-row gap-2 items-center hover:bg-hoverPalette cursor-pointer"
                        onClick={() => {OnResume(false); OnLogs(false); OnCreateCategories(true)}}
                    >
                        <FontAwesomeIcon className="text-1xl sm:text-2xl" icon={faLayerGroup} />
                    </div>
                </div>
                
                <div 
                    className='flex flex-row gap-2 text-white items-center text-sm md:text-2xl cursor-pointer hover:text-hoverPalette'
                    onClick={() => {
                        handleCloseSession()
                    }}
                >
                    <FontAwesomeIcon icon={faDoorOpen} />
                    <h1 className='hidden sm:block font-bold'>Cerrar sesion</h1>
                </div>

            </div>
        </>
    )   
}

Header.propTypes = {
    OnResume: PropTypes.func.isRequired,
    OnLogs: PropTypes.func.isRequired,
    OnCreateCategories: PropTypes.func.isRequired,
};