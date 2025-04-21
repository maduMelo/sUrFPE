import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';


interface TricksMeanProps {
    tricks: string[];
    tricksScores: GLfloat[];
};

export const TricksMean = ({ tricks, tricksScores }: TricksMeanProps) => {
    const [chartData, setChartData] = useState({
        options: {
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
            labels: tricks,
        },
        series: tricksScores,
    });

    useEffect(() => {
        if (tricks && tricksScores) {
            setChartData(prevChartData => ({
                ...prevChartData,
                options: {
                    ...prevChartData.options,
                    labels: tricks
                },
                series: tricksScores
            }));
        };
    }, [tricks, tricksScores])


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