import React, { useState } from 'react';
import Chart from 'react-apexcharts';


export const TricksMetrics = ({ }) => {
    const [chartData, setChartData] = useState({
        options: {
            xaxis: {
                categories: ['Angulo de ataque', 'Braço da frente tocando a água', 'Centro de gravidade', 'Direção do olhar', 'Distribuição de peso', 'Projeção do Quadril à água', 'Rotação de tronco']
            },

            yaxis: {
                min: 0,
                max: 100,
            },

            markers: {
                size: 3,
                hover: {
                    size: 6
                }
            }
        },
        series: [
            {
                name: "Frontside",
                data: [30, 40, 45, 50, 23, 24, 67]
            },
            {
                name: "Backside",
                data: [60, 20, 75, 70, 17, 90, 46]
            },
            {
                name: "Total",
                data: [45, 30, 55, 60, 20, 56, 56.5]
            }
        ],

    });

    return (
        <div className="bar-chart border-2 border-amber-300">
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="radar"
                width={650}
                height={550}
            />
        </div>
    );
};