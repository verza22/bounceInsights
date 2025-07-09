import React from "react";
import axios from "./../../utils/axios";
import { useDateStore } from "../store/useDateStore";
const Highcharts = require('highcharts');

const Neo: React.FC = () => {

    const { dateFrom, dateTo } = useDateStore();

    React.useEffect(()=>{

        axios.get("nasa/neo",{
            params: {
                dateFrom, 
                dateTo
            }
        })
        .then(res => {
            if(res.data.near_earth_objects){
                const nearEarthObjects = res.data.near_earth_objects;
                loadChart(nearEarthObjects);
            }
        })
        .catch(err => {
            console.error("Error al obtener datos de la NASA:", err);
        });

    }, [dateFrom, dateTo]);

    const loadChart = (nearEarthObjects: Record<string, any[]>) => {
        const dates = Object.keys(nearEarthObjects).sort();
        const data = dates.map(date => ({
            date,
            count: nearEarthObjects[date].length
        }));

        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Número de asteroides cercanos a la Tierra por día',
                align: 'left'
            },
            xAxis: {
                categories: data.map(item => item.date),
                title: {
                    text: 'Fecha'
                }
            },
            yAxis: {
                title: {
                    text: 'Cantidad de asteroides'
                },
                allowDecimals: false
            },
            series: [{
                name: 'Asteroides',
                data: data.map(item => item.count)
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 600
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    };

    return <div id="container">
    </div>
}

export default Neo;