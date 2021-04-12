import React, { useState } from "react";

export default function ForecastCard({elem, idx}) {
    const [toggleState, setToggleState] = useState(elem[0].date);
    const active = (date) => setToggleState(date);

    return (
        <>
            <div className="day flex flex-col">
                <div className="flex justify-between w-full">
                    {elem.map((elem,idx)=>
                        <div 
                            key={idx} 
                            className={toggleState === elem.date ? "cursor-pointer" : "opacity-50 cursor-pointer"} 
                            onClick={() => active(elem.date)}>
                            {new Date(elem.date).getHours() >= 10 ? new Date(elem.date).getHours() : '0' + new Date(elem.date).getHours()}
                        </div>           
                    )}
                </div>

                {elem.map((elem,idx)=>
                    <div key={idx} className={toggleState === elem.date ? "flex flex-col items-center" : "hidden"}>
                        <div className='date'>
                        {elem.date} 
                        </div>
                        <div className={elem.type}></div>
                        <div>
                        {elem.type} 
                        </div>
                        <div className='temp'>
                        {Math.round(elem.temp * 10) / 10}°C
                        </div>    
                      
                    </div>
                )}

                {/* Add extra info box*/}
                <div>
                    {elem[0].sundata?.sunrise}
                    {elem[0].sundata?.sunset}
                </div>  
            </div>
        </>
    )
}
