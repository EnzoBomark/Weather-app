import React, { useState, useEffect } from 'react'
import Forecast from "./components/Forecast"
import Weather from "./components/Weather"
import Country from "./components/Country"
import StartComp from "./components/StartComp"

const openweathermap_api = {
    key: `${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`,
    base: "https://api.openweathermap.org/data/2.5/",
};

const positionstack_api = {
    key: `${process.env.REACT_APP_POSITIONSTACK_API_KEY}`,
    base: "http://api.positionstack.com/v1/reverse",
};

function App() {
    const [query, setQuery] = useState('');
    const [country, setCountry] = useState(false);
    const [weather, setWeather] = useState(false);
    const [forecast, setForecast] = useState(false);
    
    useEffect(() => {
        // Add when deploying//
        // navigator.geolocation.getCurrentPosition((position) => {
        //     fetch(`${positionstack_api.base}?access_key=${positionstack_api.key}&query=${position.coords.latitude},${position.coords.longitude}`)
        //     .then(response => response.json())
        //     .then(response => setQuery(`${response.data[0].county}, ${response.data[0].country_code}`))
        //   });

        setQuery('Stockholm, SWE');
    }, []);

    const search = e => {
        if(e.key === "Enter" && query !== ''){
            // fetch weather and forecast data
            fetch(`${openweathermap_api.base}forecast?q=${query}&units=metric&APPID=${openweathermap_api.key}`)
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

            weather.filter((e,i) => new Date(e.date).getHours() == 0 || i == 0)
            .forEach(weather => weather.sundata = solar_events(new Date(weather.date), country.lat, country.lng, country.timezone/3600));
            
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

    const solar_event = (date, latitude, longitude, rising, zenith, timezone) => {
        const year = date.getUTCFullYear(),
            month = date.getUTCMonth() + 1,
            day = date.getUTCDate() + 1;

        const floor = Math.floor,
            degtorad = (deg) => Math.PI * deg / 180,
            radtodeg = (rad) => 180 * rad / Math.PI,
            sin = (deg) => Math.sin(degtorad(deg)),
            cos = (deg) => Math.cos(degtorad(deg)),
            tan = (deg) => Math.tan(degtorad(deg)),
            asin = (x) => radtodeg(Math.asin(x)),
            acos = (x) => radtodeg(Math.acos(x)),
            atan = (x) => radtodeg(Math.atan(x)),
            modpos = (x, m) => ((x % m) + m) % m;
    
        // Calculate the day of the year
        const N1 = floor(275 * month / 9),
            N2 = floor((month + 9) / 12),
            N3 = (1 + floor((year - 4 * floor(year / 4) + 2) / 3)),
            N = N1 - (N2 * N3) + day - 30;
    
        // Convert the longitude to hour value and calculate an approximate time
        const lngHour = longitude / 15,
            t = N + (((rising ? 6 : 18) - lngHour) / 24);
    
        // Calculate the Sun's mean anomaly
        const M = (0.9856 * t) - 3.289;
    
        // Calculate the Sun's true longitude
        let L = M + (1.916 * sin(M)) + (0.020 * sin(2 * M)) + 282.634;
        L = modpos(L, 360); 
        
        // Calculate the Sun's right ascension
        let RA = atan(0.91764 * tan(L));
        RA = modpos(RA, 360); 
        
        // Right ascension value needs to be in the same quadrant as L
        const Lquadrant = (floor(L / 90)) * 90,
            RAquadrant = (floor(RA / 90)) * 90;
        RA = RA + (Lquadrant - RAquadrant);
    
        // Right ascension value needs to be converted into hours
        RA = RA / 15;
    
        // Calculate the Sun's declination
        const sinDec = 0.39782 * sin(L),
            cosDec = cos(asin(sinDec));
    
        // Calculate the Sun's local hour angle
        const cosH = (cos(zenith) - (sinDec * sin(latitude))) / (cosDec * cos(latitude));
        let H;
    
        if (cosH > 1) return undefined; // the sun never rises on this location (on the specified date)
        if (cosH < -1) return undefined; // the sun never sets on this location (on the specified date)
    
        // Finish calculating H and convert into hours
        if (rising) H = 360 - acos(cosH);
        else H = acos(cosH);
        H = H / 15;
    
        // Calculate local mean time of rising/setting
        const T = H + RA - (0.06571 * t) - 6.622;
    
        // Adjust back to UTC
        let UT = T - lngHour;
        UT = modpos(UT, 24);
    
        const hours = floor(UT),
            minutes = Math.round(60 * (UT - hours));
        const result = new Date(Date.UTC(year, month - 1, day, hours + timezone, minutes)).toGMTString()
        console.log(result);
        return result;
    }
    
    const zeniths = 90.833333 ;
    
    const sunrise = (date, latitude, longitude, timezone) =>  solar_event(date, latitude, longitude, true, zeniths, timezone);
    
    const sunset = (date, latitude, longitude, timezone) => solar_event(date, latitude, longitude, false, zeniths, timezone);
    
    const solar_events = (date, latitude, longitude, timezone) => ({
        'sunrise': `${new Date(sunrise(date, latitude, longitude, timezone)).getUTCHours()}:${new Date(sunrise(date, latitude, longitude, timezone)).getMinutes()}:00`,
        'sunset':`${new Date(sunset(date, latitude, longitude, timezone)).getUTCHours()}:${new Date(sunset(date, latitude, longitude, timezone)).getMinutes()}:00`,
    });

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