import React, { useState } from "react";
import ForecastCard from "./ForecastCard"

export default function Forecast({ forecast, unit }) {

    return (
        <div className="forecast">
            <div className="container">
                {forecast.map((elem, idx) => {
                    return <ForecastCard key={idx} elem={elem} unit={unit}/>
                })}
            </div>
        </div>
    )
}
