import React, { useState, useEffect } from "react";

export default function Weather({ weather, country, units, unit }) {
    const [weatherData, setWeatherData] = useState(weather[0]);
    const [showClock, setShowClock] = useState(false);

    useEffect(() => {
        setWeatherData(weather[0])
    }, [weather])

    useEffect(() => {
        currentTime(weatherData)
    }, [weatherData]);
    // Set progress bar
    // Return true when the sun is up
    const currentTime = (weatherData) => {
        const progress = document.getElementById('progress');
        const progressContainer = document.getElementById('progress-container');

        const preDay = parseInt(weather[0].sundata?.sunrise);
        const postDay = parseInt(weather[0].sundata?.sunset);
        const curr = parseInt(weatherData.date.split(' ').pop())
        const dayLength = 1 - (preDay + (24 - postDay)) / 24;

        progress.setAttribute('percent', `${Math.floor(dayLength * 100)}`);
        progress.style.transform = `rotate(${preDay * 15}deg)`;
        progressContainer.style.transform = `rotate(${((24 - curr) * 15) - 90}deg)`;
    }

    const dayNightCycle = (data) => {
        const preDay = parseInt(weather[0].sundata?.sunrise);
        const postDay = parseInt(weather[0].sundata?.sunset);
        const curr = parseInt(data.date.split(' ').pop())

        return (curr >= preDay && curr <= postDay);
    }


    return (
        <>  
            <div className="w-10/12 mt-2">
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-screen-sm flex flex-col items-center transform scale-95">
                        <div className="text-2xl font-semibold mb-2 ml-4 z-50 shadow-text">{country.name}, {country.country}</div>
                        <div className={dayNightCycle(weatherData) ? 'card day' : 'card night'}>
                            <div className={`${weatherData.type} card-image`}/>
                            
                            <div className="text-white mt-20 ml-8">
                                
                                <div onClick={units} className="w-56 text-7xl font-semibold mt-1 cursor-pointer transform hover:scale-105 transition ease-in-out shadow-text">
                                    {(unit) ? `${Math.round(weatherData.temp * 10) / 10}°C` : `${Math.round((weatherData.temp * 9/5 + 32) * 10) / 10}°F`}
                                </div>
                                
                                <div className="text-5xl font-semibold mt-1 shadow-text">
                                    {weatherData.type}
                                </div>
                                
                                <div className="mt-1 shadow-text">
                                    {`${weatherData.date.substring(5).slice(0, -3).replace('-', ' ')}`}
                                </div>
                                
                                <div className="text-2xl font-semibold mt-1 shadow-text">
                                    <div className=""></div>
                                    {(unit) ? `${weatherData.wind} m/s` : `${Math.round(weatherData.wind * 2.2369362920544 * 100) / 100} mph`}
                                    <div className="">{weatherData.humid} %</div>
                                </div>

                                <div onClick={() => setShowClock(!showClock)} className={!showClock ? 'hidden'  : 'cursor-pointer'}>
                                    <div className="absolute bottom-11 right-10">
                                        <div>{weather[0].sundata?.sunrise}</div>
                                        <div>{weather[0].sundata?.sunset}</div>
                                    </div>  
                                </div>

                                <div onClick={() => setShowClock(!showClock)} className={showClock ? 'hidden'  : 'cursor-pointer'}>
                                    <div className="progress-dot absolute right-20"></div>
                                    <div onClick={() => setShowClock(!showClock)} id="progress-container" className="absolute bottom-5 right-5">
                                        <svg id='progress' percent='0'>
                                            <circle cx='50' cy='50' r='35'></circle>
                                            <circle cx='50' cy='50' r='35'></circle>
                                        </svg>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="w-screen max-w-screen-sm flex justify-between mt-4 px-12">
                <div className="text-2xl font-semibold shadow-text">Today</div>
                <div className={dayNightCycle(weatherData) ? 'text-xl font-semibold text-blue-400' : 'text-xl font-semibold text-indigo-600'}>Next 5 Days</div>
            </div>

            <div className="w-screen select-none overflow-x-scroll slider max-w-screen-md pl-10">
                <div className="flex">
                    { weather.map((weather, idx) => {
                        return <div key={idx} className="bg-white">
                                    <div onClick={() => setWeatherData(weather)}className={dayNightCycle(weather) ? 'small-card-container day' : 'small-card-container night'}>
                                        <div className={parseInt(weather.date.substring(10).slice(0, -3)) == parseInt(weatherData.date.substring(10).slice(0, -3)) ? 'small-card active' : 'small-card'}>
                                            <div className="mt-4 text-xl font-semibold shadow-text">{`${weather.date.substring(10).slice(0, -3)}`}</div>

                                            <div className={(dayNightCycle) ? 'small-card-image day' : 'small-card-image night'}>
                                                <div className={`${weather.type} small-card-image`}/>
                                            </div>

                                            <div className="text-xl font-semibold mt-1 shadow-text">
                                                {(unit) ? `${Math.round(weather.temp * 10) / 10}°C` : `${Math.round((weather.temp * 9/5 + 32) * 10) / 10}°F`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                    })}
                </div >
            </div>
        </>
    )
}
