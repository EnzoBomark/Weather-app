import React, { useState } from "react";
const api = {
    key: "c8cde683f491660dd70e5ceef4f25741",
    base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [forecast, setForecast] = useState(false);

    const search = evt => {
        if(evt.key === "Enter"){
            
            // fetch weather data
            fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
                setWeather(result);
                setQuery('');
            });

            // fetch forecast data
            fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
                if(result.cod == 404) return setForecast(false);
                let forecastDay = result.list.map(item => ({
                    date: item.dt_txt,
                    type: item.weather[0].main,
                    max: item.main.temp_max
                }));
                setForecast(forecastDay.filter((e,i) => i % 8 === 7));
            });
        }
    }

    const newCurrentTime = (result) => {
        const currentTime = new Date().getUTCHours() + result.timezone/3600;
        const sunriseUtc =  new Date(result.sys.sunrise * 1000).getUTCHours() + result.timezone/3600; 
        const sunsetUtc = new Date(result.sys.sunset * 1000).getUTCHours() + result.timezone/3600;
        return (currentTime >= sunriseUtc && currentTime <= sunsetUtc);
    }

    const dateBuilder = (newDate) =>{
        
        const months = [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July", 
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
        ];
        
        const days = [
        "Sunday", 
        "Monday", 
        "Tuesday", 
        "Wednesday", 
        "Thursday", 
        "Friday", 
        "Saturday"
        ];

        const day = days[newDate.getDay()];
        const date = newDate.getDate();
        const month = months[newDate.getMonth()];
        const year = newDate.getFullYear();

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
                        
                        { forecast && 
                            <div className="forecast">
                                <div className="container">
                                    {forecast.map((item, index) => {
                                        return  <div className="day one" key={index}> 
                                                    <div className='date'>
                                                    {item.date} 
                                                    </div>
                                                    <div className={item.type}></div>
                                                    <div>
                                                    {item.type} 
                                                    </div>
                                                    <div className='temp'>
                                                    {item.max}°C
                                                    </div>      
                                                </div>
                                    })}
                                </div>
                            </div>
                        }
                    </div>
                    
                ) : (
                <div className="appContainer">
                    <div className="date">{dateBuilder(new Date())}</div>
                    <h1 className="title">Weather App</h1>
                    <h2>Enter a country, city or state</h2>
                    <p>The app will display the current weather, 4 day forecast and day/night cycle</p>
                </div>
                )}
                
            </main>
        </div>
    )
}

export default App;
