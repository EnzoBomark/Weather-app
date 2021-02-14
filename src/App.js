import React, { useState } from "react";
const api = {
    key: "c8cde683f491660dd70e5ceef4f25741",
    base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    let isDay;


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
                // console.log(result);
                
                let d = new Date();
                let n = d.getUTCHours();
                let timezone = result.city.timezone/3600
                let currentTime = n + timezone;
                let sunrise = new Date(result.city.sunrise * 1000);
                let sunriseUtc = sunrise.getUTCHours() + timezone;
                
                let sunset = new Date(result.city.sunset * 1000);
                let sunsetUtc = sunset.getUTCHours() + timezone;

                console.log(currentTime, sunriseUtc, sunsetUtc)

                if(currentTime >= sunriseUtc && currentTime <= sunsetUtc){
                    isDay = true;
                } else {
                    isDay = false;
                }
            });
        }
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
        <div className='app'>
                
            <main>
                <div className="search-box">
                    <input type="text"
                    className="search-bar" 
                    placeholder="search..." 
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
                                <div className="date">{dateBuilder(new Date())}</div>
                            </div>
                        </div>

                        <div className="weather-box">
                            <div className="temp">
                                {Math.round(weather.main.temp)}°C
                            </div>
                            <div className="weather">
                                {weather.weather[0].main}
                            </div>
                        </div>
                        
                        {/* <div>
                            <div className="forecast-box">
                                <div className="temp">
                                    {Math.round(weather.main.temp)}°C
                                </div>
                                <div className="weather">
                                    {weather.weather[0].main}
                                </div>
                            </div>
                        </div> */}
                    </div>
                    
                ) : ('')};
                
            </main>
        </div>
    );
}

export default App;
