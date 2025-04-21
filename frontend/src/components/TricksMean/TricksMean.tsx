import React, { useState } from 'react';
import Chart from 'react-apexcharts';


export const TricksMean = ({ }) => {
    const [chartData, setChartData] = useState({
        options: {
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: '#333',
                        startAngle: -90,
                        endAngle: 90,
                    },
                    dataLabels: {
                        name: {
                            show: true,
                            offsetY: -40
                        },
                        value: {
                            fontSize: "30px",
                            show: true,
                            offsetY: -20
                        },
                        total: {
                            show: true,
                            label: 'TOTAL'
                        }
                    }
                }
            },
            labels: ['Drop', 'Bottom Turn BS', 'Carve FS', 'Bottom Turn FS'],
        },
        series: [85, 59, 91, 68],

    });

    return (
        <div className="bar-chart">
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="radialBar"
                width="500"
            />
        </div>
    );
};