import React from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../store/useDateStore";
const Highcharts = require('highcharts');

const Cme: React.FC = () => {

  const { dateFrom, dateTo } = useDateStore();

  React.useEffect(() => {
    axios.get("nasa/gst",{
        params: {
            dateFrom, 
            dateTo
        }
    })
    .then(res => {
      loadChart(res.data);
    })
    .catch(err => {
      console.error("Error al obtener datos de la NASA:", err);
    });
  }, [dateFrom, dateTo]);

  const loadChart = (data : any) => {
    const categories = data.map((d: any) => d.date);
    const values = data.map((d: any) => d.kp);

    Highcharts.chart('container-gst', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Índice Kp diario (Tormentas Geomagnéticas)'
        },
        xAxis: {
          categories: categories,
          title: { text: 'Fecha' },
          labels: {
            rotation: -45
          }
        },
        yAxis: {
          min: 0,
          max: 9,
          title: { text: 'Kp Index' }
        },
        series: [{
          name: 'Kp Index',
          data: values
        }]
      });
  };

  return <div id="container-gst" style={{ width: '100%', maxWidth: 600, height: 400, margin: '0 auto' }}></div>;
};

export default Cme;