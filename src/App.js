import React, { useState, Component } from "react";
import Forecast from "./components/Forecast"
import Weather from "./components/Weather"
import Country from "./components/Country"
import StartComp from "./components/StartComp"

const api = {
    key: "c8cde683f491660dd70e5ceef4f25741",
    base: "https://api.openweathermap.org/data/2.5/",
};
    
// const getPos = () => {
//     fetch("https://api.ip2loc.com/Bn8PS400MySWNFH8JQ3G2gtHLwsrZdAB/detect")
//     .then(response => response.json())
//     .then(response => { 
//         console.log(response);
//         if (response.success) return `${response.location.country.subdivision}, ${response.location.country.alpha_2}`
//     });
// }
class App extends Component {

    // const [query, setQuery] = useState('');
    // const [country, setCountry] = useState(false);
    // const [weather, setWeather] = useState(false);
    // const [forecast, setForecast] = useState(false);

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            country: false,
            weather: false,
            forecast: false,
        };

    search(e){
        if(e.key === "Enter" && query !== ''){
            
            // fetch weather and forecast data
            fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
                setQuery('');

                console.log(result);

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
                    temp: item.main.temp,
                    humid: item.main.humidity,
                    wind: item.wind.speed
                }));

                const output = weather.reduce((acc, curr, idx, arr) => {
                    if(new Date(arr[--idx]?.date).toLocaleDateString() != new Date(arr[++idx]?.date).toLocaleDateString()) acc.push([]);
                    acc[acc.length - 1].push(curr);
                    return acc;
                }, []);

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
    newCurrentTime(result){
        const timezone = result.timezone/3600, 
            sunrise = result.sunrise * 1000, 
            sunset = result.sunset * 1000;

        const currentTime = new Date().getUTCHours() + timezone;
        const sunriseUtc =  new Date(sunrise).getUTCHours() + timezone; 
        const sunsetUtc = new Date(sunset).getUTCHours() + timezone;
        return (currentTime >= sunriseUtc && currentTime <= sunsetUtc);
    }
}
function App() {






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
                    <>
                        <Country country={country}/>

                        <Weather weather={weather}/>

                        <Forecast forecast={forecast}/>
                    </>
                }

                { country == false && 
                    <>
                        <StartComp/>
                    </>
                }
            </main>
        </div>
    )
}

export default App;

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