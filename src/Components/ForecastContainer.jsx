import React from "react";
import useGetYear from "./Logic/useGetYear.jsx";

const ForecastPage = (data) => {
  {
    console.log("Forecast Data:");
    console.log(data);
    
  }
  return (
    <div>
      <h1>{data.data.list[0].main.temp}</h1>
      <h1>The year is :{useGetYear(data.data.list[0])}</h1>
    </div>
  );
};

export default ForecastPage;
