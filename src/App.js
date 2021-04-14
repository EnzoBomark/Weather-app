import React, { useState, useEffect } from 'react'
import Forecast from "./components/Forecast"
import SearchBar from './components/SearchBar';
import Weather from "./components/Weather"

function App() {
    const [country, setCountry] = useState(false);
    const [weather, setWeather] = useState(false);
    const [forecast, setForecast] = useState(false);
    const [unit, setUnit] = useState(true);

    const getWeather = (e) => setWeather(e);

    const getForecast = (e) => setForecast(e);

    const getCountry = (e) => setCountry(e);

    const units = () => setUnit(!unit); 

    return (
        <div className='app overflow-x-hidden'>
            <main className="flex flex-col items-center">
                <SearchBar getWeather={getWeather} getForecast={getForecast} getCountry={getCountry}></SearchBar>

                {   country &&
                    <>
                        <Weather  weather={weather} country={country} units={units} unit={unit}/>

                        {/* <Forecast forecast={forecast} unit={unit} country={country}/> */}
                    </>
                }

            </main>
        </div>
    )
}

export default App;