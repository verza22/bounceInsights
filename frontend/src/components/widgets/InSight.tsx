import React from "react";
import axios from "./../../utils/axios";
import { useTranslation } from "react-i18next";
const Highcharts = require("highcharts");

interface InsightProps {
  id: number,
  setLoading: (val: boolean) => void
}

const Insight: React.FC<InsightProps> = ({id, setLoading}) => {

  const { t } = useTranslation();
  
  React.useEffect(() => {

    setLoading(true);
    axios.get("nasa/insight")
    .then((res) => {
      if (Array.isArray(res.data)) {
        loadChart(res.data);
      } else {
        // TO DO show error with toast
      }
    })
    .catch((err) => {
      // TO DO show error with toast
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
    <div id={"container-insight-"+id} style={{ width: "100%", maxWidth: 700, height: 400, margin: "0 auto" }}></div>
  );
};

export default Insight;