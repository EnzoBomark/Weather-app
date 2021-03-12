# Weather-app
## [Deployed app](https://enzobomark.github.io/Weather-app/)

### Built With

* [Sass](https://sass-lang.com)
* [React](https://reactjs.org/)

## Goals and Context
My goal is to create a competent and simple react website that works hand in hand with an api.

### Installation
<!--Insert Installation example. ex, npm install... -->
Open your terminal and then type
```
$ git clone https://github.com/EnzoBomark/Weather-app.git
```
This clones the repo

cd into the new folder and type
```
$ npm install
```
This installs the required dependencies

To run the React project.
```
$ npm start
```

*You are done!* 

### Code Example
<!--Insert small code example-->
```JavaScript
 // fetch weather and forecast data
    fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
    .then(res => res.json())
    .then(result => {
        setQuery('');

        if(result.cod === "404") return setCountry(false);
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

        setWeather(weather[0]);
        setForecast(weather.filter((e,i) => i % 8 === 7));
        setCountry(country);
    });
```

## License

Distributed under the MIT License. 
