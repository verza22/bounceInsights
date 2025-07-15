import React from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";
import { useTranslation } from "react-i18next";
const Highcharts = require('highcharts');

interface GstProps {
  id: number,
  setLoading: (val: boolean) => void,
  changeDateFrom: (dateFrom: string) => void,
  setError: (msg: string) => void
}

const Cme: React.FC<GstProps> = ({id, setLoading, changeDateFrom, setError}) => {

  const { dateFrom, dateTo } = useDateStore();
  const { t } = useTranslation();

  React.useEffect(() => {

    setLoading(true);
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
      const error = err?.response?.data?.error ? err.response.data.error : err.message;
      setError(error);
    })
    .finally(() => {
      setLoading(false);
    });

  }, [dateFrom, dateTo]);

  const loadChart = (data : any) => {
    const categories = data.map((d: any) => d.date);
    const values = data.map((d: any) => d.kp);

    Highcharts.chart("container-gst-"+id, {
        chart: {
          type: 'column'
        },
        title: {
          text: t('gstDaily')
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        xAxis: {
          categories: categories,
          title: { text: '' },
          labels: {
            rotation: -45
          }
        },
        yAxis: {
          min: 0,
          max: 9,
          title: { text: t('kpIndex') }
        },
        series: [{
          name: t('kpIndex'),
          data: values
        }],
        plotOptions: {
          series: {
            point: {
              events: {
                click: function (this: any) {
                  changeDateFrom(this.category);
                }
              }
            }
          }
      }
      });
  };

  return <div id={"container-gst-"+id} className="w-full h-full m-0"></div>;
};

export default Cme;