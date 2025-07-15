import React from "react";
import axios from "./../../utils/axios";
import { useTranslation } from "react-i18next";
const Highcharts = require("highcharts");

interface InsightProps {
  id: number,
  setLoading: (val: boolean) => void,
  setError: (msg: string) => void
}

const Insight: React.FC<InsightProps> = ({id, setLoading, setError}) => {

  const { t } = useTranslation();
  
  React.useEffect(() => {

    setLoading(true);
    axios.get("nasa/insight")
    .then((res) => {
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

  }, []);

  const loadChart = (
    data: { sol: string; minTemp: number; maxTemp: number }[]
  ) => {
    const categories = data.map((entry) => `Sol ${entry.sol}`);
    const minTemps = data.map((entry) => entry.minTemp);
    const maxTemps = data.map((entry) => entry.maxTemp);

    Highcharts.chart("container-insight-"+id, {
      chart: {
        type: "area"
      },
      title: {
        text: t('marsTitle'),
        align: "center"
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories,
        title: { text: t('marsSol') }
      },
      yAxis: {
        title: { text: t('marsTemperature') },
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
          name: t('marsMax'),
          data: maxTemps,
          color: "#FF5733",
          type: "area"
        },
        {
          name: t('marsMin'),
          data: minTemps,
          color: "#1E90FF",
          type: "line"
        }
      ]
    });
  };

  return (
    <div id={"container-insight-"+id} className="w-full h-full m-0"></div>
  );
};

export default Insight;