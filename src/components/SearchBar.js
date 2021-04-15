import React, { useState, useEffect } from 'react';
import Star from '../images/icons/star.svg';
import Loupe from '../images/icons/loupe.svg';

const openweathermap_api = {
    key: `${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`,
    base: "https://api.openweathermap.org/data/2.5/",
};

const positionstack_api = {
    key: `${process.env.REACT_APP_POSITIONSTACK_API_KEY}`,
    base: "http://api.positionstack.com/v1/reverse",
};

export default function SearchBar({getWeather, getForecast, getCountry}) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        // Add when deploying//
        // navigator.geolocation.getCurrentPosition((position) => {
        //     fetch(`${positionstack_api.base}?access_key=${positionstack_api.key}&query=${position.coords.latitude},${position.coords.longitude}`)
        //     .then(response => response.json())
        //     .then(response => setQuery(`${response.data[0].county}, ${response.data[0].country_code}`))
        //});

        setQuery('Stockholm, SWE');
    }, []);

    const search = e => {
        if(query !== ''){
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
            .forEach(weather =>  weather.sundata = solar_events(new Date(weather.date), country.lat, country.lng, country.timezone/3600));
            
            const output = weather.reduce((acc, curr, idx, arr) => {
                if(new Date(arr[--idx]?.date).toLocaleDateString() != new Date(arr[++idx]?.date).toLocaleDateString()) acc.push([]);
                acc[acc.length - 1].push(curr);
                return acc;
            }, []);
            
            getWeather(output[0]);
            getForecast(output);
            getCountry(country);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    };   

    const sunrise = (date, latitude, longitude, timezone) =>  solar_event(date, latitude, longitude, true, 90.833333, timezone);
    
    const sunset = (date, latitude, longitude, timezone) => solar_event(date, latitude, longitude, false, 90.833333, timezone);
    
    const solar_events = (date, latitude, longitude, timezone) => ({
        'sunrise': `${sunrise(date, latitude, longitude, timezone)}`,
        'sunset': `${sunset(date, latitude, longitude, timezone)}`,
    });

    const solar_event = (date, latitude, longitude, rising, zenith, timezone) => {
        const year = date.getUTCFullYear(),
            month = date.getUTCMonth() + 1,
            day = date.getUTCDate();

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
    
        const N1 = floor(275 * month / 9),
            N2 = floor((month + 9) / 12),
            N3 = (1 + floor((year - 4 * floor(year / 4) + 2) / 3)),
            N = N1 - (N2 * N3) + day - 30;

        const lngHour = longitude / 15,
            t = N + (((rising ? 6 : 18) - lngHour) / 24);
    
        const M = (0.9856 * t) - 3.289;
    
        let L = M + (1.916 * sin(M)) + (0.020 * sin(2 * M)) + 282.634;
        L = modpos(L, 360); 
        
        let RA = atan(0.91764 * tan(L));
        RA = modpos(RA, 360); 
        
        const Lquadrant = (floor(L / 90)) * 90,
            RAquadrant = (floor(RA / 90)) * 90;
        RA = RA + (Lquadrant - RAquadrant);
    
        RA = RA / 15;
    
        const sinDec = 0.39782 * sin(L),
            cosDec = cos(asin(sinDec));
    
        const cosH = (cos(zenith) - (sinDec * sin(latitude))) / (cosDec * cos(latitude));
        let H;
    
        if (cosH > 1) return undefined; 
        if (cosH < -1) return undefined; 
    
        if (rising) H = 360 - acos(cosH);
        else H = acos(cosH);
        H = H / 15;
    
        const T = H + RA - (0.06571 * t) - 6.622;
    
        let UT = T - lngHour;
        UT = modpos(UT, 24);

        const hours = floor(UT),
            minutes = Math.round(60 * (UT - hours));

        const result = new Date(Date.UTC(year, month - 1, day, hours + timezone, minutes)).toUTCString().split(' ')[4];
        return result;
    };

    return (
        <nav className="p-5 w-screen max-w-screen-lg">
            <div className="rounded-xl h-16 w-full px-6 bg-white shadow-box flex">
                <img src={Star} alt='Star' className="w-10 mr-2"/>
                <input type="text"
                className="w-full ml-3 focus:outline-none"
                placeholder="Search..."
                onChange={e => setQuery(e.target.value)}
                value={query}
                />
                <img onClick={search} src={Loupe} alt='Loupe' className="w-10 mt-1"/>
            </div>
        </nav>
    )
}
