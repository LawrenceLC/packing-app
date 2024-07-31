import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import WEATHER_API_KEY from "./apikey";


function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState({});
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState(""); 

  const inputRef = useRef(null);

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`;

  useEffect(() => {
    if(latitude && longitude)  {
      searchLocation();
    }
  }, [latitude,longitude]);

  const searchLocation = () => {
    axios.get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the weather data:", error);
      });
  };

  const searchCity = () => {
    const value = inputRef.current.value;
    if (value === "") return;
    axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${WEATHER_API_KEY}`)
      .then((response) => {
        if (response.data.length > 0) {
          const cityData = response.data[0];
          setCity(value);
          setLatitude(cityData.lat);
          setLongitude(cityData.lon)
          console.log(cityData);
        } else {
          console.error("City not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching the city data:", error);
      });
  };

  <head>
    <html lang="en"></html>
    <link href="./output.css" rel="stylesheet"></link>
    <link href="./index.css" rel="stylesheet"></link>
  </head>;

  return (
    <div
      className="app"
      class="w-full h-full absolute text-white bg-gradient-to-r from-cyan-500 to-blue-700"
    >
      <div className="search">
        <p>Location Search:</p>
        
        <input
        type="text"
        ref={inputRef}
        placeholder="Enter city name"
        class="text-black"
      />
      <button onClick={searchCity}>Search City</button>



      </div>
      <div
        className="container"
        class="max-w-md max-h-full m-auto pl-4 pr-4 relative top-10 flex flex-col justify-between"
      >
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? (
              <h1>{(data.main.temp - 273.15).toFixed(1)}°C</h1>
            ) : (
              <h1>~°C</h1>
            )}
          </div>
          <div className="description" class="relative right--3/4">
            {data.weather ? <p>{data.weather[0].main}</p> : <p>~</p>}
          </div>
        </div>
        <div className="bottom">
          <div className="feels">
            {data.main ? (
              <p> Feels like {(data.main.feels_like - 273.15).toFixed()}°C</p>
            ) : (
              <p>Feels Like: ~°C</p>
            )}
          </div>
          <div className="humidity">
            {data.main ? <p>{data.main.humidity.toFixed()}%</p> : <p>~%</p>}
          </div>
          <div className="wind">
            {data.wind ? <p>{data.wind.speed.toFixed()}mph</p> : <p>~ mph</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
