import React, { useState, useEffect } from "react";

export default function Weather({ weather, unit, country }) {

    useEffect(() => {
        setDayNightCycle();
    }, [country]);

    const setDayNightCycle = () => {
        const progress = document.getElementById('progress');
        const progressContainer = document.getElementById('progress-container');

        let preDay = parseInt(weather.sundata?.sunrise);
        let postDay = 24 - parseInt(weather.sundata?.sunset);
        const dayLength = 1 - (preDay + postDay) / 24;

        // console.log({
        //     preDay, 
        //     postDay, 
        //     percent: Math.floor(dayLength * 100), 
        //     circle: `rotate(${(preDay) * 15}deg)`, 
        //     container: `rotate(${((24 - (new Date().getUTCHours() + country.timezone/3600)) * 15) - 90}deg)`
        // });

        progress.setAttribute('percent', `${Math.floor(dayLength * 100)}`);
        progress.style.transform = `rotate(${preDay * 15}deg)`;
        progressContainer.style.transform = `rotate(${((24 - (new Date().getUTCHours() + country.timezone/3600)) * 15) - 90}deg)`;
    }

    return (
        <div className="weather-box">
            <div className="container">
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

                <div className="w-2/5 flex justify-between">
                    <div>{weather.sundata?.sunrise}</div>
                    <div>{weather.sundata?.sunset}</div>
                </div>  

                <div className="progress-dot"></div>
                <div id="progress-container">
                    <svg id='progress' percent='0' viewport='0 0 140 140'>
                        <circle cx='70' cy='70' r='64'></circle>
                        <circle cx='70' cy='70' r='64'></circle>
                    </svg>
                </div>
            </div>
        </div>
    )
}
