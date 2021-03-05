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

*You are done!* Now you can start editing the React project in the new folder that's created.

### Code Example
<!--Insert small code example-->
```JavaScript
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
```

## License

Distributed under the MIT License. 
