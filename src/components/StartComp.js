import React from 'react'

export default function StartComp() {
    return (
        <div className="appContainer">
            <div className="date">{new Date().toDateString()}</div>
            <h1 className="title">Weather App</h1>
            <h2>Enter a country, city or state</h2>
            <p>The app will display the current weather, 5 day forecast and day/night cycle</p>
        </div>
    )
}
