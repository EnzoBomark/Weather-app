import React, { useState, useEffect } from "react";

export default function Weather({ weather, unit, country }) {
    const [dayNightCycle, setDayNightCycle] = useState(true);
    const [weatherData, setWeatherData] = useState(weather[0]);

    useEffect(() => {
        currentTime(weatherData);
    }, [country]);
    
    // Set progress bar
    // Return true when the sun is up
    const currentTime = (weatherData = weather[0]) => {
        const progress = document.getElementById('progress');
        const progressContainer = document.getElementById('progress-container');

        const preDay = parseInt(weatherData.sundata?.sunrise);
        const postDay = parseInt(weatherData.sundata?.sunset);
        const curr = parseInt(weatherData.date.split(' ').pop())
        const dayLength = 1 - (preDay + (24 - postDay)) / 24;
        const isDay = (curr >= preDay && curr <= postDay)

        progress.setAttribute('percent', `${Math.floor(dayLength * 100)}`);
        progress.style.transform = `rotate(${preDay * 15}deg)`;
        progressContainer.style.transform = `rotate(${((24 - curr) * 15) - 90}deg)`;

        setDayNightCycle(isDay)
    }

    return (
        <div className="w-10/12 mt-3 cursor-pointer transform scale-95 hover:scale-100 transition">
            <div className="flex flex-col items-center ">
                <div className="text-2xl font-semibold mb-1 ml-16 z-50">{country.name}, {country.country}</div>
                <div className={(dayNightCycle) ? 'card day' : 'card night'}>
                    <div className={`${weatherData.type} card-image`}/>
                    
                    <div className="text-white mt-20 ml-8">
                        
                        <div className="text-7xl font-semibold mt-1">
                            {(unit) ? `${Math.round(weatherData.temp * 10) / 10}°C` : `${Math.round((weatherData.temp * 9/5 + 32) * 10) / 10}°F`}
                        </div>
                        
                        <div className="text-5xl font-semibold mt-1">
                            {weatherData.type}
                        </div>
                        
                        <div className="mt-1">
                            {`${new Date().toDateString().substring(4).slice(0, -5)} ${weatherData.date.substring(10).slice(0, -3)}`}
                        </div>
                        
                        <div className="text-2xl font-semibold mt-1">
                            <div className=""></div>
                            {(unit) ? `${weatherData.wind} m/s` : `${Math.round(weatherData.wind * 2.2369362920544 * 100) / 100} mph`}
                            <div className="">{weatherData.humid} %</div>
                        </div>

                        {/* <div className="absolute bottom-11 right-32">
                            <div>{weather.sundata?.sunrise}</div>
                            <div>{weather.sundata?.sunset}</div>
                        </div>   */}

                        <div className="progress-dot absolute right-20"></div>
                        <div id="progress-container" className="absolute bottom-5 right-5">
                            <svg id='progress' percent='0'>
                                <circle cx='50' cy='50' r='35'></circle>
                                <circle cx='50' cy='50' r='35'></circle>
                            </svg>
                        </div>
                    </div>
                </div>

                { weather.map((elem, idx) => {
                    return <div key={idx} className="bg-red-600 mt-10 w-28 h-40 rounded-3xl"></div>
                })}
                
            </div>
        </div>
    )
}
