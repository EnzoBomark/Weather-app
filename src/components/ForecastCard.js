import React, { useState } from "react";

export default function ForecastCard({elem, unit}) {
    const [toggleState, setToggleState] = useState(elem[0].date);
    const active = (date) => setToggleState(date);

    return (
        <>
            <div className="">
                <div className="">
                    {elem.map((elem,idx)=>
                        <div 
                            key={idx} 
                            className={toggleState === elem.date ? "" : ""} 
                            onClick={() => active(elem.date)}>
                            {new Date(elem.date).getHours() >= 10 ? new Date(elem.date).getHours() : '0' + new Date(elem.date).getHours()}
                        </div>           
                    )}
                </div>

                {elem.map((elem,idx)=>
                    <div key={idx} className={toggleState === elem.date ? "" : "hidden"}>
                        <div className=''>
                        {elem.date} 
                        </div>
                        <div className={elem.type}></div>
                        <div>
                        {elem.type} 
                        </div>
                        <div className=''>
                        {(unit) ? `${Math.round(elem.temp * 10) / 10}°C` : `${Math.round((elem.temp * 9/5 + 32) * 10) / 10}°F`}
                        </div>    

                        <div>
                            {(unit) ? `${elem.wind} m/s` : `${Math.round(elem.wind * 2.2369362920544 * 100) / 100} mph`}
                        </div>  
                        
                        <div>{elem.humid} %</div>
                      
                    </div>
                )}

                {/* Add extra info box*/}
                <div className="">
                    <div>{elem[0].sundata?.sunrise}</div>
                    <div>{elem[0].sundata?.sunset}</div>
                </div>  
            </div>
        </>
    )
}
