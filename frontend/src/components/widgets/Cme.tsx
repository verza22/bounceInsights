import React, { useEffect } from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../../store/useDateStore";
import { useTranslation } from "react-i18next";

const Highcharts = require('highcharts');

interface CmeProps {
  id: number,
  setLoading: (val: boolean) => void,
  setError: (msg: string) => void
}

const Cme: React.FC<CmeProps> = ({id, setLoading, setError}) => {

  const { dateFrom, dateTo } = useDateStore();
  const { t } = useTranslation();

  useEffect(() => {

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
        setError("error.400-001");
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

  const loadChart = (pieData: { name: string; y: number }[]) => {
    const localizedData = pieData.map(item => ({
      name: t(`cmeRegions.${item.name}`),
      y: item.y
    }));
    Highcharts.chart('container-cme-'+id, {
      chart: {
        type: 'pie'
      },
      title: {
        text: t('cmeDistribution'),
        align: 'center'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y} '+t('events')+')'
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
        name: t('cmeEvents'),
        colorByPoint: true,
        data: localizedData
      }]
    });
  };

  return <div id={"container-cme-"+id} className="w-full h-full m-0"></div>;
};

export default Cme;