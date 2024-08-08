import React, { useEffect } from "react";
import * as icons from "../Assets/icons.js";

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

  function getHumidity(data, day) {
    return data.list[day].main.humidity;
  }

  function getWindSpeed(data, day) {
    return data.list[day].wind.speed;
  }

  function getWindSpeedDescription(data, day) {
    const windSpeed = getWindSpeed(data, day);
    if (windSpeed < 1) {
      return "No wind";
    } else if (windSpeed < 5) {
      return "No wind";
    } else if (windSpeed < 11) {
      return "Light Breeze";
    } else if (windSpeed < 19) {
      return "Gentle Breeze";
    } else if (windSpeed < 28) {
      return "Moderate Breeze";
    } else if (windSpeed < 38) {
      return "Fresh Breeze";
    } else if (windSpeed < 49) {
      return "Strong Breeze";
    } else if (windSpeed < 61) {
      return "High Wind";
    } else if (windSpeed < 74) {
      return "Gale";
    } else if (windSpeed < 88) {
      return "Strong Gale";
    } else if (windSpeed < 102) {
      return "Storm";
    } else if (windSpeed < 117) {
      return "Violent Storm";
    } else {
      return "Hurricane";
    }
    //Beaufort scale
  }

  function getTime(data, day) {
    return data.list[day].dt_txt.slice(11, 16);
  }

  function getDay(data, day) {
    return data.list[day].dt_txt.slice(8, 10);
  }

  function getMonth(data, day) {
    const monthNumber = data.list[day].dt_txt.slice(5, 7);
    const month = new Date(0, parseInt(monthNumber) - 1).toLocaleString(
      "default",
      { month: "long" }
    );
    return month;
  }

  function findArrayItemsTillTomorrow(data) {
    let k = 0;
    for (let i = 0; i < 8; i++) {
      if (getDay(data, i) != getDay(data, 0)) {
        k++;
      }
    }
    return k;
  }

  function findArrayItemsForDay(day) {
    let itemsTillTomorrow = findArrayItemsTillTomorrow(data);
    const k = (day * 8) + itemsTillTomorrow;
    let items = [];
    for (let i = 0; i < 9; i++) {
      if (i === 3 || i === 5 || i === 7) {
        items.push(k + i);
      }
    }
    return items;
    // 0=6AM , 1=12PM , 2=6PM
  }

  function getOuterScale(feelsLike) {
    if (feelsLike <= 5) {
      return "Winter coat";
    } else if (feelsLike <= 15) {
      return "Jacket";
    } else if (feelsLike <= 23) {
      return "Jumper";
    } else if (feelsLike <= 27) {
      return "🚫";
    } else {
      return "🚫";
    }
  }

  function getOuterTimePackingReccomendation(data, timeIndex) {
    const feelsLike = getFeelsLike(data, timeIndex);
    const recomendation = getOuterScale(feelsLike);
    return recomendation;
  }

  function getBottomTimePackingReccomendation(data, timeIndex) {
    const feelsLike = getFeelsLike(data, timeIndex);
    if (feelsLike <= 0) {
      return "Thermal leggings";
    } else if (feelsLike <= 25) {
      return "Trousers";
    } else {
      return "Shorts";
    }
  }

  function getInnerScale(feelsLike) {
    if (feelsLike <= 0) {
      return "Thermal wear";
    } else if (feelsLike <= 10) {
      return "Long sleeves";
    } else if (feelsLike <= 23) {
      return "T-shirt";
    } else if (feelsLike <= 27) {
      return "tank top";
    } else return "tank top";
  }

  function getInnerTimePackingReccomendation(data, timeIndex) {
    const temperature = getFeelsLike(data, timeIndex);
    const recomendation = getInnerScale(temperature);
    return recomendation;
  }

  function calculateHeatIndex(t, rh) {
    var tRounded = Math.floor(t + 0.5);

    if (tRounded < 76 || tRounded > 126) return null;
    if (rh < 0 || rh > 100) return null;

    // according to the NWS, we try this first, and use it if we can
    var tHeatEasy = 0.5 * (t + 61.0 + (t - 68.0) * 1.2 + rh * 0.094);
    if (tHeatEasy + t < 160.0) return tHeatEasy;

    // need to use the hard form, and possibly adjust.
    var t2 = t * t; // t squared
    var rh2 = rh * rh; // rh squared
    var tResult =
      -42.379 +
      2.04901523 * t +
      10.14333127 * rh +
      -0.22475541 * t * rh +
      -0.00683783 * t2 +
      -0.05481717 * rh2 +
      0.00122874 * t2 * rh +
      0.00085282 * t * rh2 +
      -0.00000199 * t2 * rh2;

    // these adjustments come from the NWA page, and are needed to
    // match the reference table.
    var tAdjust;
    if (rh < 13.0 && 80.0 <= t && t <= 112.0)
      tAdjust =
        -((13.0 - rh) / 4.0) * Math.sqrt((17.0 - Math.abs(t - 95.0)) / 17.0);
    else if (rh > 85.0 && 80.0 <= t && t <= 87.0)
      tAdjust = ((rh - 85.0) / 10.0) * ((87.0 - t) / 5.0);
    else tAdjust = 0;

    tResult += tAdjust;

    // finally, the reference tables have no data above 183 (rounded),
    // so filter out answers that we have no way to vouch for.
    if (tResult >= 183.5) return null;
    else return tResult;
  }

  function calculateWindChill(temperature, windSpeed) {
    return Math.round(
      13.12 +
        0.6215 * temperature -
        11.37 * windSpeed ** 0.16 +
        0.3965 * temperature * windSpeed ** 0.16
    );
  }

  function getFeelsLike(data, timeIndex) {
    if (data.list[timeIndex].main.temp - 273.15 > 26.6) {
      const HIScore = calculateHeatIndex(
        data.list[timeIndex].main.temp * 1.8 - 459.67,
        getHumidity(data, timeIndex)
      );
      const HIScoreToC = ((HIScore - 32) * 5) / 9;
      return HIScoreToC;
    } else if (data.list[timeIndex].main.temp - 273.15 < 5) {
      const windChillScore = calculateWindChill(
        data.list[timeIndex].main.temp - 273.15,
        getWindSpeed(data, timeIndex)
      );
      return windChillScore;
    } else return data.list[timeIndex].main.temp - 273.15;
  }

  ///
  const getAllDayFeelsLike = (day) => {
    const items = findArrayItemsForDay(day);
    const FeelsLikeTemps = [];
    for (let item of items) {
      FeelsLikeTemps.push(getFeelsLike(data, item));
    }
    return FeelsLikeTemps;
  };

  const renderInnerClothing = (allDayTemps) => {
    const base = getInnerScale(Math.max(...allDayTemps));
    if (base === "tank top") {
      return <img src={icons.sleevelessShirt} alt="Sleeveless Shirt" />;
    } else if (base === "T-shirt") {
      return <img src={icons.tshirt} alt="T-shirt" />;
    } else if (base === "Long sleeves") {
      return <img src={icons.longSleeve} alt="Long Sleeve" />;
    } else return "error;";
  };

  const renderOuterClothing = (allDayTemps) => {
    const outer = getOuterScale(Math.min(...allDayTemps));
    if (outer === "🚫") {
      return "🚫";
    } else if (outer === "Jumper") {
      return <img src={icons.jumper} alt="Jumper" />;
    } else if (outer === "Jacket") {
      return <img src={icons.sweatshirt} alt="Jacket" />;
    } else if (outer === "Winter coat") {
      return <img src={icons.coat} alt="Coat" />;
    } else return "error";
  };

///
  const timePackingReccomendation = (data, timeIndex) => {
    const feelsLike = getFeelsLike(data, timeIndex);
    return (
      <div>
        <p>{feelsLike.toFixed(1)}°C</p>
        <p>{getInnerTimePackingReccomendation(data, timeIndex)}</p>
        <p>{getOuterTimePackingReccomendation(data, timeIndex)}</p>
        <p>{getBottomTimePackingReccomendation(data, timeIndex)}</p>
        <p></p>
      </div>
    );
  };

  const renderForecast = (day) => {
    const items = findArrayItemsForDay(day);
    return (
      <div className="max-w-5xl  m-auto">
        <h2>
          {getMonth(data, items[0])} {getDay(data, items[0])}
        </h2>
        <div className="flex ">
          <div className="flex">{renderForecastTimes(items, day)}</div>
        </div>
      </div>
    );
  };

  const renderForecastTimes = (items, day) => {
    const allDayTemps = getAllDayFeelsLike(day);
    return (
      <div className="flex flex-row items-start">
        <div className="w-fit">
          {items.map((item, index) => (
            <div
              className="inline-flex [&_*]:outline flex-row mr-3 mb-2"
              key={index}
            >
              <div className="">
                <p className="min-w-20">{getTime(data, item)}</p>
                <p>{getTemperature(data, item)}°C </p>
                <p>{getHumidity(data, item)}% </p>
                <p>{getWindSpeedDescription(data, item)}</p>
              </div>
              <div>
                <p className="w-24">{timePackingReccomendation(data, item)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="min-w-32 max-w-36 h-full flex">
          <div className="grid grid-rows-2 grid-cols-2 items-center">
            <div>{renderInnerClothing(allDayTemps)}</div>
            <div>{renderOuterClothing(allDayTemps)}</div>
            <div>Bottom</div>
            <div>
              <div className="items-center">
                <div>Umbrella?</div>
                <div>Sunglasses?</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!data || !data.list) {
    return <div>City not found</div>;
  }

  return (
    <div className="m-auto max-w-5xl w-4/5">
      <h1>5 Day Forecast</h1>
      {renderForecast(0)}
      {renderForecast(1)}
      {renderForecast(2)}
      {renderForecast(3)}
    </div>
  );
};

export default ForecastPage;
