import React, {useState, useEffect } from 'react'

export default function CurrentWeatherHours({weather, weatherData, currentTime, getWeatherData, unit}) {

    return (
        <div className="w-screen select-none overflow-x-scroll slider pl-10 flex md:justify-center">
            <div className="flex">
                { weather.map((weather, idx) => {
                    return <div key={idx} className="slider-content">
                                <div onClick={() => getWeatherData(weather)} className={currentTime(weather) ? 'small-card-container day' : 'small-card-container night'}>
                                    <div className={parseInt(weather.date.substring(10).slice(0, -3)) == parseInt(weatherData.date.substring(10).slice(0, -3)) ? 'small-card active' : 'small-card'}>
                                        <div className="mt-5 text-2xl font-semibold shadow-text">{`${weather.date.substring(10).slice(0, -3)}`}</div>

                                        <div className={(currentTime(weather)) ? 'small-card-image day' : 'small-card-image night'}>
                                            <div className={`${weather.type} small-card-image`}/>
                                        </div>

                                        <div className="text-2xl font-semibold mt-1 shadow-text">
                                            {(unit) ? `${Math.round(weather.temp * 10) / 10}°C` : `${Math.round((weather.temp * 9/5 + 32) * 10) / 10}°F`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                })}
            </div >
        </div>
    )
}
