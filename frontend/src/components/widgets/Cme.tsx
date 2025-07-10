import React from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";

const Highcharts = require('highcharts');

interface CmeProps {
  id: number,
  setLoading: (val: boolean) => void
}

const Cme: React.FC<CmeProps> = ({id, setLoading}) => {

  const { dateFrom, dateTo } = useDateStore();

  React.useEffect(() => {

    setLoading(true);
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
    })
    .finally(() => {
      setLoading(false);
    });

  }, [dateFrom, dateTo]);

  const loadChart = (pieData: { name: string; y: number }[]) => {
    Highcharts.chart('container-cme-'+id, {
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
      credits: {
        enabled: false
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

  return <div id={"container-cme-"+id} style={{ width: '100%', maxWidth: 600, height: 400, margin: '0 auto' }}></div>;
};

export default Cme;