import React, { useState } from 'react';
import Chart from 'react-apexcharts';


interface GeneralMeanProps {
    generalMeanScore: GLfloat;
};

export const GeneralMean = ({ generalMeanScore }: GeneralMeanProps ) => {
    const [chartData, setChartData] = useState({
        options: {
            colors: ["#20E647"],
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: '#C8D2D9',
                        startAngle: -90,
                        endAngle: 90,
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            fontSize: "30px",
                            show: true,
                            offsetY: -10
                        }
                    }
                }
            },
        },
        series: [generalMeanScore]

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