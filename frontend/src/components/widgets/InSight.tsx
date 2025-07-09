import React from "react";
import axios from "./../../utils/axios";
const Highcharts = require("highcharts");

const Insight: React.FC = () => {
  React.useEffect(() => {
    axios
      .get("nasa/insight")
      .then((res) => {
        if (Array.isArray(res.data)) {
          loadChart(res.data);
        } else {
          console.error("Datos inesperados del backend:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos de InSight:", err);
      });
  }, []);

  const loadChart = (
    data: { sol: string; minTemp: number; maxTemp: number }[]
  ) => {
    const categories = data.map((entry) => `Sol ${entry.sol}`);
    const minTemps = data.map((entry) => entry.minTemp);
    const maxTemps = data.map((entry) => entry.maxTemp);

    Highcharts.chart("container-insight", {
      chart: {
        type: "area"
      },
      title: {
        text: "Temperaturas mínimas y máximas en Marte (por sol)",
        align: "left"
      },
      xAxis: {
        categories,
        title: { text: "Sol (día marciano)" }
      },
      yAxis: {
        title: { text: "Temperatura (°C)" },
        labels: { format: "{value}°" }
      },
      tooltip: {
        shared: true,
        valueSuffix: "°C"
      },
      plotOptions: {
        area: {
          stacking: null,
          marker: {
            enabled: false
          }
        }
      },
      series: [
        {
          name: "Temperatura máxima",
          data: maxTemps,
          color: "#FF5733",
          type: "area"
        },
        {
          name: "Temperatura mínima",
          data: minTemps,
          color: "#1E90FF",
          type: "line"
        }
      ]
    });
  };

  return (
    <div
      id="container-insight"
      style={{ width: "100%", maxWidth: 700, height: 400, margin: "0 auto" }}
    ></div>
  );
};

export default Insight;