import React from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../store/useDateStore";

const Highcharts = require('highcharts');

const Cme: React.FC = () => {

  const { dateFrom, dateTo } = useDateStore();

  React.useEffect(() => {

    axios.get("nasa/cme",{
      params: {
        dateFrom, 
        dateTo
      }
    })
    .then(res => {
      if (Array.isArray(res.data)) {
        loadChart(res.data);
      } else {
        console.error("Datos inesperados del backend:", res.data);
      }
    })
    .catch(err => {
      console.error("Error al obtener datos de la NASA:", err);
    });

  }, [dateFrom, dateTo]);

  const loadChart = (pieData: { name: string; y: number }[]) => {
    Highcharts.chart('container-cme', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Distribución de eventos CME por región solar',
        align: 'left'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y} eventos)'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Eventos CME',
        colorByPoint: true,
        data: pieData
      }]
    });
  };

  return <div id="container-cme" style={{ width: '100%', maxWidth: 600, height: 400, margin: '0 auto' }}></div>;
};

export default Cme;