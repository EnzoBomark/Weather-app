import React, { useState } from "react";
const api = {
    key: "c8cde683f491660dd70e5ceef4f25741",
    base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [forecast, setForecast] = useState({});

    const search = evt => {
        if(evt.key === "Enter"){
            
            // fetch weather data
            fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
                setWeather(result);
                setQuery('');
                // console.log(result);
            });

            // fetch forecast data
            fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
                setQuery('');
                let forecastDay = [];

                if(result.cod == 200){
                    for(let i = 0; i < result.list.length; i+=8){
                        const forecastDate = (result.list[i].dt_txt).split(" ")[0];
                        const forecastType = result.list[i].weather[0].main;
                        const forecastMax = Math.ceil(result.list[i].main.temp_max);
                        const forecastMin = result.list[i].main.temp_min;
    
                        forecastDay.push({
                            date: forecastDate, 
                            type: forecastType, 
                            max: forecastMax, 
                            min: forecastMin
                        });
                    }

                    setForecast(forecastDay);
                }
            });
        }
    }

    const newCurrentTime = (result) => {
        let d = new Date();
        let n = d.getUTCHours();
        let timezone = result.timezone/3600
        let currentTime = n + timezone;
        let sunrise = new Date(result.sys.sunrise * 1000);
        let sunriseUtc = sunrise.getUTCHours() + timezone; 
        let sunset = new Date(result.sys.sunset * 1000);
        let sunsetUtc = sunset.getUTCHours() + timezone;

        return (currentTime >= sunriseUtc && currentTime <= sunsetUtc) ? true : false;
    }

    const dateBuilder = (d) =>{
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day} ${date} ${month} ${year}`;
    }

    return (
        <div className={(typeof weather.main != "undefined") ? (newCurrentTime(weather) ? 'app day': 'app night') : 'app'}>
                
            <main>
                <div className="search-box">
                    <input type="text"
                    className="search-bar" 
                    placeholder="Search..."
                    onChange={e => setQuery(e.target.value)}
                    value={query}
                    onKeyPress={search}
                    />
                </div>

                {(typeof weather.main != 'undefined') ? (
                    <div>
                        <div>
                            <div className="location-box">
                                <div className="location">{weather.name}, {weather.sys.country}</div>
                            </div>
                        </div>

                        <div className="weather-box">
                            <div className="container">
                                <div className={weather.weather[0].main}></div>
                                <div className="temp">
                                    {Math.round(weather.main.temp)}°C
                                </div>
                                <div className="weather">
                                    {weather.weather[0].main}
                                </div>
                                <div className="date">{dateBuilder(new Date())}</div>
                            </div>
                        </div>
                                {(typeof forecast[0] != 'undefined') ? (
                                    <div>
                                        <div className="forecast">
                                            <div className="container">
                                                <div className="day one">
                                                    <div className='date'>
                                                    {forecast[1].date} 
                                                    </div>
                                                    <div className={forecast[1].type}></div>
                                                    <div>
                                                    {forecast[1].type} 
                                                    </div>
                                                    <div className='temp'>
                                                    {forecast[1].max}°C
                                                    </div>      
                                                </div>

                                                <div className="day two">
                                                    <div className='date'>
                                                    {forecast[2].date} 
                                                    </div>
                                                    <div className={forecast[2].type}></div>
                                                    <div>
                                                    {forecast[2].type} 
                                                    </div>
                                                    <div className='temp'>
                                                    {forecast[2].max}°C
                                                    </div>      
                                                </div>

                                                <div className="day three">
                                                    <div className='date'>
                                                    {forecast[3].date} 
                                                    </div>
                                                    <div className={forecast[3].type}></div>
                                                    <div>
                                                    {forecast[3].type} 
                                                    </div>
                                                    <div className='temp'>
                                                    {forecast[3].max}°C
                                                    </div>      
                                                </div>

                                                <div className="day four">
                                                    <div className='date'>
                                                    {forecast[4].date} 
                                                    </div>
                                                    <div className={forecast[4].type}></div>
                                                    <div>
                                                    {forecast[4].type} 
                                                    </div>
                                                    <div className='temp'>
                                                    {forecast[4].max}°C
                                                    </div>      
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : ('')}
                    </div>
                    
                ) : ('')}
                
            </main>
        </div>
    )
}

export default App;
