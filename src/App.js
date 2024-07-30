import React, { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState ("")
  const [data, setData] = useState({});
  const [latitude, setLatitude] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=-0.1276474&appid=7d1e61ed1b7e4eda1868452f1eca7abb`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setLatitude("");
    }
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
        <p>Latitude Search:</p>
        <input
          value={latitude}
          onChange={(event) => setLatitude(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter latitude"
          type="text"
          class="text-black"
        />
        <p>Location Search:</p>
        <input
          value={city}
          onChange={(event) => setLatitude(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter City"
          type="text"
          class="text-black"
        >
        </input>
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
