import React, { useState } from "react";
import ForecastCard from "./ForecastCard"

export default function Forecast({ forecast }) {
    return (
        <div className="forecast">
            <div className="container">
                {forecast.map((elem, idx) => {
                    return <ForecastCard key={idx} elem={elem} idx={idx}/>
                })}
            </div>
        </div>
    )
}

{/* <div className='date'>
{item.date} 
</div>
<div className={item.type}></div>
<div>
{item.type} 
</div>
<div className='temp'>
{Math.round(item.temp * 10) / 10}°C
</div>       */}