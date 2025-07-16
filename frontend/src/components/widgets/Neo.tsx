import React, { useEffect } from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";
import { useTranslation } from "react-i18next";
import { formatLocalizedDate } from "../../utils/utils";
const Highcharts = require('highcharts');

interface NeoProps {
  id: number,
  setLoading: (val: boolean) => void,
  changeDateFrom: (dateFrom: string) => void,
  setError: (msg: string) => void
}

const Neo: React.FC<NeoProps> = ({ id, setLoading, changeDateFrom, setError }) => {
  const { dateFrom, dateTo } = useDateStore();
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    axios.get("nasa/neo", {
      params: {
        dateFrom,
        dateTo
      }
    })
    .then(res => {
      if (res.data.near_earth_objects) {
        const nearEarthObjects = res.data.near_earth_objects;
        loadChart(nearEarthObjects);
      }
    })
    .catch(err => {
      const error = err?.response?.data?.error ? err.response.data.error : err.message;
      setError(error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [dateFrom, dateTo]);

  const loadChart = (nearEarthObjects: Record<string, any[]>) => {
    const dates = Object.keys(nearEarthObjects).sort();
    const data = dates.map(date => ({
      date,
      localized: formatLocalizedDate(date),
      count: nearEarthObjects[date].length
    }));

    const localizedToOriginal: Record<string, string> = {};
    data.forEach(item => {
      localizedToOriginal[item.localized] = item.date;
    });

    Highcharts.chart('container-neo-' + id, {
      chart: {
        type: 'line'
      },
      title: {
        text: t('asteroidsTitle'),
        align: 'center'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: data.map(item => item.localized),
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          text: t('asteroidsCount')
        },
        allowDecimals: false
      },
      series: [{
        name: t('asteroidsLabel'),
        data: data.map(item => item.count)
      }],
      plotOptions: {
        series: {
          point: {
            events: {
              click: function (this: any) {
                const clickedLocalized = this.category;
                const originalDate = localizedToOriginal[clickedLocalized];
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

  return <div id={"container-neo-" + id} className="w-full h-full m-0"></div>;
};

export default Neo;