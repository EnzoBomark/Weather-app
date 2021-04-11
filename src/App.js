import React, { useState, useEffect } from 'react'
import Forecast from "./components/Forecast"
import Weather from "./components/Weather"
import Country from "./components/Country"
import StartComp from "./components/StartComp"

const api = {
    key: "c8cde683f491660dd70e5ceef4f25741",
    base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
    const [query, setQuery] = useState('');
    const [country, setCountry] = useState(false);
    const [weather, setWeather] = useState(false);
    const [forecast, setForecast] = useState(false);
    
    useEffect(() => {
        // Add when deploying//
        // fetch("https://api.ip2loc.com/Bn8PS400MySWNFH8JQ3G2gtHLwsrZdAB/detect")
        // .then(response => response.json())
        // .then(response => this.setState({query: `${response.location.country.subdivision}, ${response.location.country.alpha_2}`}))
        
        setQuery('Stockholm County, SE');
    }, []);

    const search = e => {
        if(e.key === "Enter" && query !== ''){
            
            // fetch weather and forecast data
            fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
                setQuery('');

            const country = {
                name: result.city.name,
                country: result.city.country,
                sunset: result.city.sunset,
                sunrise: result.city.sunrise,
                timezone: result.city.timezone,
                lng: result.city.coord.lon,
                lat: result.city.coord.lat,
            };
            const weather = result.list.map(item => ({
                date: item.dt_txt,
                type: item.weather[0].main,
                temp: item.main.temp,
                humid: item.main.humidity,
                wind: item.wind.speed,
            }));

            weather.filter((e,i) => new Date(e.date).getHours() == 0).forEach(weather => {
                fetch(`https://api.sunrise-sunset.org/json?lat=${country.lat}&lng=${country.lng}&date=${new Date(weather.date).toLocaleDateString()}`)
                .then(res => res.json())
                .then(result => weather.sunHours = result.results)
            })

            console.log(weather)

            const output = weather.reduce((acc, curr, idx, arr) => {
                if(new Date(arr[--idx]?.date).toLocaleDateString() != new Date(arr[++idx]?.date).toLocaleDateString()) acc.push([]);
                acc[acc.length - 1].push(curr);
                return acc;
            }, []);

            output.pop();
            output.shift();

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

                {   country &&
                    <>
                        <Country country={country}/>

                        <Weather weather={weather}/>

                        <Forecast forecast={forecast}/>
                    </>
                }

                {   country == false && 
                    <>
                        <StartComp/>
                    </>
                }
            </main>
        </div>
    )
}

export default App;