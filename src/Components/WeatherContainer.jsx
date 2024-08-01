import React from "react";

const WeatherPage = ({data}) => {
  return (
    <div
      className="container"
      class="max-w-md max-h-full m-auto pl-4 pr-4 relative top-10 flex flex-col justify-between"
    >
      <div className="top">
        <div className="timeframe">
        </div>
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
  );
};

export default WeatherPage;