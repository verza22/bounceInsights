import React from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";
import { useTranslation } from "react-i18next";
import { formatLocalizedDate } from "../../utils/utils";
const Highcharts = require('highcharts');

interface GstProps {
  id: number,
  setLoading: (val: boolean) => void,
  changeDateFrom: (dateFrom: string) => void,
  setError: (msg: string) => void
}

const Gst: React.FC<GstProps> = ({ id, setLoading, changeDateFrom, setError }) => {
  const { dateFrom, dateTo } = useDateStore();
  const { t } = useTranslation();

  React.useEffect(() => {
    setLoading(true);
    axios.get("nasa/gst", {
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

  const loadChart = (data: { date: string; kp: number }[]) => {
    const localizedToOriginal: Record<string, string> = {};
    const categories = data.map(d => {
      const localized = formatLocalizedDate(d.date);
      localizedToOriginal[localized] = d.date;
      return localized;
    });

    const values = data.map(d => d.kp);

    Highcharts.chart("container-gst-" + id, {
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
                const originalDate = localizedToOriginal[this.category];
                if (originalDate) {
                  changeDateFrom(originalDate);
                }
              }
            }
          }
        }
      }
    });
  };

  return <div id={"container-gst-" + id} className="w-full h-full m-0"></div>;
};

export default Gst;