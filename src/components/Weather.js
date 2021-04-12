import React, { useState, useEffect } from "react";

export default function Weather({ weather, unit, country }) {

    useEffect(() => {
        setDayNightCycle();
    }, [country]);

    const setDayNightCycle = () => {
        const progress = document.getElementById('progress');
        const progressContainer = document.getElementById('progress-container');

        let preDay = parseInt(weather.sundata?.sunrise.replaceAll(':', ''));
        let postDay = 240000 - parseInt(weather.sundata?.sunset.replaceAll(':', ''));
        const dayLength = 1 - (preDay + postDay) / 240000;

        progress.setAttribute('percent', `${Math.floor(dayLength * 100)}`);
        progress.style.transform = `rotate(${(preDay / 10000) * 15}deg)`;
        progressContainer.style.transform = `rotate(${((24 - (new Date().getUTCHours() + country.timezone/3600)) * 15) - 90}deg)`;
    }



    return (
        <div className="weather-box">
            <div className="container">

                <div className="w-2 h-2 rounded-lg bg-white mb-2"></div>
                <div id="progress-container">
                    <svg id='progress' percent='0' viewport='0 0 140 140'>
                        <circle cx='70' cy='70' r='64'></circle>
                        <circle cx='70' cy='70' r='64'></circle>
                    </svg>
                </div>

                <div className={weather.type}></div>
                <div className="temp">
                    {(unit) ? `${Math.round(weather.temp * 10) / 10}°C` : `${Math.round((weather.temp * 9/5 + 32) * 10) / 10}°F`}
                </div>
                <div className="weather">
                    {weather.type}
                </div>
                <div className="date">{new Date().toDateString()}</div>
                <div className="flex">
                    <div className="date mr-2"></div>
                    {(unit) ? `${weather.wind} m/s` : `${Math.round(weather.wind * 2.2369362920544 * 100) / 100} mph`}
                    <div className="date ml-2">{weather.humid} %</div>
                </div>

                <div>
                    {weather.sundata?.sunrise}
                    {weather.sundata?.sunset}
                </div>  
            </div>
        </div>
    )
}
