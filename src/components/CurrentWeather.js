import React, { useState, useEffect } from "react";
import StarColor from '../images/icons/star-color.svg';
import Star from '../images/icons/star-white.svg';
import Left from '../images/icons/left.svg';
import Right from '../images/icons/right.svg';
import CurrentWeatherHours from "./CurrentWeatherHours"

let currentDay = 0;

export default function Weather({ weather, forecast, country }) {
    const [forecastData, setForecastData] =  useState(forecast[0]);
    const [weatherData, setWeatherData] = useState(forecastData[0]);
    const [unit, setUnit] = useState(true);

    useEffect(() =>  setForecastData(forecast[0]), [forecast])
    useEffect(() =>  setWeatherData(forecastData[0]), [forecast])
    useEffect(() => setWeatherData(forecastData[0]),[forecastData])

    const units = () => setUnit(!unit); 

    const getWeatherData = (e) => setWeatherData(e);

    const currentTime = (data) => (parseInt(data.date.split(' ').pop()) >= parseInt( forecastData[0].sundata?.sunrise) 
                                && parseInt(data.date.split(' ').pop()) <= parseInt(forecastData[0].sundata?.sunset));

    const nextDay = () => (currentDay >= 5) ? console.log(false) : setForecastData(forecast[++currentDay]),
          prevDay = () => (currentDay <= 0) ? console.log(false) : setForecastData(forecast[--currentDay]);

    return (
        <>  
            <div className="w-full flex justify-center items-center mt-3">
                
                <img src={Left} alt="Left" onClick={prevDay}/>

                <div className="w-10/12 flex justify-center">
                    <div className="w-full max-w-screen-sm flex flex-col items-center transform scale-95">
                        <div className="text-2xl font-semibold mb-2 ml-4 z-50 shadow-text">{country.name}, {country.country}</div>
                        <div className={currentTime(weatherData) ? 'card day' : 'card night'}>

                            <div className={`${weatherData.type} card-image`}/>
                            <div className="text-white mt-20 ml-8 shadow-text-large">
                                
                                {/* <img src={StarColor} alt="Star" className="absolute right-5 top-5 "/> */}
                                <img src={Star} alt="Star" className="absolute right-5 top-5 opacity-60"/>

                                <p className="w-56 text-7xl font-semibold mt-1">
                                    {(unit) ? `${Math.round(weatherData.temp * 10) / 10}°C` : `${Math.round((weatherData.temp * 9/5 + 32) * 10) / 10}°F`}
                                </p>
                                
                                <p className="text-5xl font-semibold mt-1 ">{weatherData.type}</p>
                                
                                <p className="mt-1">{`${weatherData.date.substring(5).slice(0, -3)}`}</p>
                                
                                <p className="text-2xl font-semibold mt-1">{(unit) ? `${weatherData.wind} m/s` : `${Math.round(weatherData.wind * 2.23 * 100) / 100} mph`}</p>
                                
                                <p className="text-2xl font-semibold">{weatherData.humid} %</p>

                                <p className="mt-3">Sunrise {forecastData[0].sundata?.sunrise}</p>
                                
                                <p>Sunset {forecastData[0].sundata?.sunset}</p>

                            </div>
                        </div>
                    </div>
                </div>

                <img src={Right} alt="Right" onClick={nextDay}/>

            </div>


            <div className="w-screen max-w-screen-sm flex justify-between mt-4 px-12">
                <p className="text-2xl font-semibold shadow-text">Hourly</p>
            </div>

            <CurrentWeatherHours weather={forecastData} weatherData={weatherData} currentTime={currentTime} getWeatherData={getWeatherData} unit={unit}/>
        </>
    )
}

    // useEffect(() => {
    //     currentTime(weatherData)
    // }, [weatherData]);

    // Set progress bar
    // Return true when the sun is up
        // const currentTime = (weatherData) => {
        //     const progress = document.getElementById('progress');
        //     const progressContainer = document.getElementById('progress-container');
            
        //     const curr = parseInt(weatherData.date.split(' ').pop())
        //     const dayLength = 1 - (parseInt(preDay) + (24 - parseInt(postDay))) / 24;

        //     progress.setAttribute('percent', `${Math.floor(dayLength * 100)}`);
        //     progress.style.transform = `rotate(${preDay * 15}deg)`;
        //     progressContainer.style.transform = `rotate(${((24 - curr) * 15) - 90}deg)`;
        // }

    // <div onClick={() => setShowClock(!showClock)} className={showClock ? 'hidden'  : 'cursor-pointer'}>
    //     <div className="progress-dot"></div>
    //     <div onClick={() => setShowClock(!showClock)} id="progress-container" className="absolute bottom-3 right-3">
    //         <svg id='progress' percent='0'>
    //             <circle cx='50' cy='50' r='30'></circle>
    //             <circle cx='50' cy='50' r='30'></circle>
    //         </svg>
    //     </div>
    // </div>   