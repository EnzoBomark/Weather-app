import React, { useState } from "react";
const api = {
    key: "c8cde683f491660dd70e5ceef4f25741",
    base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
    const [query, setQuery] = useState('Sweden');
    const [country, setCountry] = useState(false);
    const [weather, setWeather] = useState(false);
    const [forecast, setForecast] = useState(false);

    const search = e => {
        if(e.key === "Enter" && query !== ''){
            
            // fetch weather and forecast data
            fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
                setQuery('');

                // if(result.cod === "404") return setCountry(false);
                const country = {
                    name: result.city.name,
                    country: result.city.country,
                    sunset: result.city.sunset,
                    sunrise: result.city.sunrise,
                    timezone: result.city.timezone,
                };
                const weather = result.list.map(item => ({
                    date: item.dt_txt,
                    type: item.weather[0].main,
                    temp: item.main.temp_max
                }));

                const output = weather.reduce((acc, curr, idx, arr) => {
                    if(new Date(arr[--idx]?.date).toLocaleDateString() != new Date(arr[++idx]?.date).toLocaleDateString()) acc.push([]);
                    acc[acc.length - 1].push(curr);
                    return acc;
                }, []);

                output.shift();
                output.pop();
                console.log(output);

                setWeather(weather.shift());
                setForecast(output);
                setCountry(country);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            
        }
    }

    // Return true when the sun is up
    const newCurrentTime = (result) => {
        const timezone = result.timezone/3600, 
              sunrise = result.sunrise * 1000, 
              sunset = result.sunset * 1000;

        const currentTime = new Date().getUTCHours() + timezone;
        const sunriseUtc =  new Date(sunrise).getUTCHours() + timezone; 
        const sunsetUtc = new Date(sunset).getUTCHours() + timezone;
        return (currentTime >= sunriseUtc && currentTime <= sunsetUtc);
    }

    return (
        <div className={(country) ? (newCurrentTime(country) ? 'app day': 'app night') : 'app'}>
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

                { country &&
                    <div>
                        <div>
                            <div className="location-box">
                                <div className="location">{country.name}, {country.country}</div>
                            </div>
                        </div>

                        <div className="weather-box">
                            <div className="container">
                                <div className={weather.type}></div>
                                <div className="temp">
                                    {Math.round(weather.temp * 10) / 10}°C
                                </div>
                                <div className="weather">
                                    {weather.type}
                                </div>
                                <div className="date">{new Date().toDateString()}</div>
                            </div>
                        </div>

                        <div className="forecast">
                            <div className="container">
                                {forecast.map((item, index) => {
                                    return  <div className="day one" key={index}> 
                                                {item.map(elem => {
                                                    return elem.date
                                                })}
                                            </div>
                                })}
                            </div>
                        </div>
                    </div>
                }

                { country == false && 
                    <div className="appContainer">
                        <div className="date">{new Date().toDateString()}</div>
                        <h1 className="title">Weather App</h1>
                        <h2>Enter a country, city or state</h2>
                        <p>The app will display the current weather, 5 day forecast and day/night cycle</p>
                    </div>
                }
            </main>
        </div>
    )
}

export default App;

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


// let z = data.timezone/3600
// let tzArr = z.toString().split('');
// tzArr.push(':00')
// if(tzArr.indexOf(':')<3){
// tzArr.splice(tzArr[0] === '-' ? 1 : 0, 0, '0')
// } 
// if (tzArr.indexOf('-')=== -1){
// tzArr.unshift('+')
// }
// setTimezone(tzArr.join(''))