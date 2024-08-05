import React, { useEffect } from "react";
//import useGetYear from "./Logic/useGetYear.jsx";

const ForecastPage = ({ data }) => {
  useEffect(() => {
    console.log("Forecast Data:");
    console.log(data);
  }, [data]);

  function getTemperature(data, day) {
    return (data.list[day].main.temp - 273.15).toFixed(0);
  }

  function getWeatherCondition(data, day) {
    return data.list[day].weather[0].description;
  }

  function getTime(data, day) {
    return data.list[day].dt_txt.slice(11, 16);
  }

  function getDay(data, day) {
    return data.list[day].dt_txt.slice(5, 10);
  }

  function findArrayItemsTillTomorrow(data) {
    let k = 0;
    for (let i = 0; i < 8; i++) {
      let k = 0;
      if (getDay(data, i) === getDay(data, 0)) {
        k++;
      }
    }
    return k;
  }

  function findArrayItemsForDay(day) {
    let itemsTillTomorrow = findArrayItemsTillTomorrow(data);
    const k = day * 8 + itemsTillTomorrow;
    let items = [];
    for (let i = 0; i < 10; i++) {
      if (i === 4 || i === 6 || i === 8) {
        items.push(i + k);
      }
    }
    console.log(items);
    return items;
    // 0=6AM , 1=12PM , 2=6PM
  }

  const renderForecast = (day, dayLabel, time) => {
    const items = findArrayItemsForDay(day, time);
    return (
      <div className="outline-dotted max-w-5xl w-4/5 m-auto">
        <h2>
          {dayLabel} ({getDay(data, items[0])}):
        </h2>
        <div className=" outline-dotted w-4/5 flex mr-auto">
          {renderForecastTimes(items)}
        </div>
      </div>
    );
  };

  const renderForecastTimes = (items) => {
    return (
      <div className="flex  gap-7 max-w-5xl">
        <div className="outline-dashed">
          <p>{getTime(data, items[0])}</p>
          <p>{getTemperature(data, items[0])}°C</p>
          <p>{getWeatherCondition(data, items[0])}</p>
        </div>
        <div className="outline-dashed">
          <p> {getTime(data, items[1])}</p>
          <p>{getTemperature(data, items[1])}°C</p>
          <p>{getWeatherCondition(data, items[1])}</p>
        </div>
        <div className="outline-dashed">
          <p> {getTime(data, items[2])}</p>
          <p>{getTemperature(data, items[2])}°C</p>
          <p>{getWeatherCondition(data, items[2])}</p>
        </div>
      </div>
    );
  };

  if (!data || !data.list) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-auto max-w-5xl w-4/5">
      <h1 className="m-auto w-4/5">5 Day Forecast</h1>
      {renderForecast(0, "Tomorrow", 2)}
    </div>
  );
};

export default ForecastPage;
