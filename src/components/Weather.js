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
                <div className="date">{weather.humid} %</div>
                <div className="date">{weather.wind} m/s</div>
            </div>
        </div>
    )
}
