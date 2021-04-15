import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from "./components/CurrentWeather";

function App() {
    const [country, setCountry] = useState(false);
    const [weather, setWeather] = useState(false);
    const [forecast, setForecast] = useState(false);

    const getWeather = (e) => setWeather(e);

    const getForecast = (e) => setForecast(e);

    const getCountry = (e) => setCountry(e);
    
    return (
        <div className='app overflow-x-hidden'>
            <main className="flex flex-col items-center">
                <SearchBar getWeather={getWeather} getForecast={getForecast} getCountry={getCountry}/>

                { country && <CurrentWeather  weather={weather} forecast={forecast} country={country}/> }
                { country == false && <div>Hej</div> }
            </main>
        </div>
    )
}

export default App;