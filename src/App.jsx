import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import axios from "axios";
import WEATHER_API_KEY from "./apikey";

const WeatherPage = lazy(() =>
  wait(1000).then(() => import("./Components/WeatherContainer"))
);

const ForecastPage = lazy(() =>
  wait(1000).then(() => import("./Components/ForecastContainer"))
);

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

function App() {
  const [data, setData] = useState({});
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [weatherorforecast, setWeatherOrForecast] = useState("");
  const [requests, setRequests] = useState(0);

  const inputRef = useRef(null);

  function resetState() {
    setLatitude("");
    setLongitude("");
    setWeatherOrForecast("");
  }

  const url = `https://api.openweathermap.org/data/2.5/${weatherorforecast}?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`;

  useEffect(() => {
    if (latitude && longitude) {
      searchLocation();
    }
  }, [requests]);

  const handleWeatherClick = () => {
    resetState();
    setWeatherOrForecast("weather");
    searchCity();
    console.log("---Weather Button Clicked");
  };

  const handleForecastClick = () => {
    resetState();
    setWeatherOrForecast("forecast");
    searchCity();
    console.log("---Forecast Button Clicked");
  };

  const searchLocation = () => {
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        console.log("API Weather Data from searchLocation:");
        console.log(response.data);
        console.log("Using this URL:");
        console.log(url);
      })
      .catch((error) => {
        console.error("Error fetching the weather data:", error);
      });
  };

  const searchCity = () => {
    const value = inputRef.current.value;
    if (value === "") return;
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${WEATHER_API_KEY}`
      )
      .then((response) => {
        if (response.data.length > 0) {
          const cityData = response.data[0];
          setLatitude(cityData.lat);
          setLongitude(cityData.lon);
          console.log("City Coordinate API Data from searchCity:");
          console.log(cityData);
          setRequests(requests + 1);
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
        <br></br>
        <button onClick={handleWeatherClick} className="border-4">
          Current Weather
        </button>
        <br></br>
        <button onClick={handleForecastClick} className="border-4">
          5-Day Forecast
        </button>
      </div>
      {weatherorforecast === "weather" && (
        <Suspense fallback={<h1>Loading Weather...</h1>}>
          <WeatherPage data={data} />
        </Suspense>
      )}
      {weatherorforecast === "forecast" && (
        <Suspense fallback={<h1>Loading Forecast...</h1>}>
          <ForecastPage data={data} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
