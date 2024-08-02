import React, { useEffect } from "react";
//import useGetYear from "./Logic/useGetYear.jsx";

const ForecastPage = ({ data }) => {
  useEffect(() => {
    console.log("Forecast Data:");
    console.log(data);
  }, [data]);

  function getTemperature(data, day) {
    return (data.list[day].main.temp - 273.15).toFixed(1);
  }

  function getWeatherCondition(data, day) {
    return data.list[day].weather[0].description;
  }

  function getTime(data, day) {
    return data.list[day].dt_txt.slice(11, 16);
  }

  function getDay(data, day) {
    return data.list[day].dt_txt.slice(8, 10);
  }

  function findArrayItemsTillTomorrow(data){
    let k = 0;
    for (let i = 0; i < 8; i++) {
      let k = 0;
      if (getDay(data, i) === getDay(data, 0)) {
        k++
      }
    }
    return k;
  }

  let itemsTillTomorrow = findArrayItemsTillTomorrow(data);

  function findArrayItemsForDay(day, time) {
    const k = (day * 8) + itemsTillTomorrow;
    let items= [];
    for(let i = 0; i < 10; i++) {
      if(i == 5 || i == 7 || i == 9) {
        items.push(i + k);
      }
    }
    console.log(items);
    return items[time];
    // 0=6AM , 1=12PM , 2=6PM
  }


  const renderForecast = (day, dayLabel, time) => {
    const items = findArrayItemsForDay(day, time);
    return (
      <div>
        <h2>{dayLabel}:</h2>
        <p>The day is: {getDay(data, items)}</p>
        <p>The temperature is: {getTemperature(data,items)}°C</p>
        <p>The time is: {getTime(data, items)}</p>
        <p>The weather condition is: {getWeatherCondition(data, items)}</p>
      </div>
    );
  };

  if (!data || !data.list) {
    return <div>Loading...</div>;
  }


  

    return (
      <div>
        <h1>5 Day Forecast</h1>
        {renderForecast(0, 'Tomorrow', 1)}
        {renderForecast(1, 'The day after tomorrow', 2)}
      </div>
  );
};

export default ForecastPage;
