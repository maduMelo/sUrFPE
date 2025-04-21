import React, { useState } from 'react';
import Chart from 'react-apexcharts';


export const WaveTypeTricks = ({ }) => {
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: "basic-bar",
                stacked: true,
            },
            xaxis: {
                categories: ['Drop', 'Bottom Turn BS', 'Carve FS', 'Bottom Turn FS']
            }
        },
        series: [
            {
                name: "Frontside",
                data: [30, 40, 45, 50]
            },
            {
                name: "Backside",
                data: [60, 20, 75, 70]
            }
        ]

    });

    return (
        <div className="bar-chart">
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                width="500"
            />
        </div>
    );
};