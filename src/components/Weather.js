import React from 'react'

export default function Weather({ weather }) {
    return (
        <div className="weather-box">
            <div className="container">
                <div className={weather.type}></div>
                <div className="temp">
                    {Math.round(weather.temp * 10) / 10}°C
                </div>
                <div className="weather">
                    {weather.type}
                </div>
                <div className="date">{new Date().toDateString()}</div>
                <div className="flex">
                    <div className="date mr-2">{weather.wind} m/s</div>
                    <div className="date ml-2">{weather.humid} %</div>
                </div>
            </div>
        </div>
    )
}
