import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';


interface TrickMetricsProps {
    trickMetrics: {
        "metrics": string[];
        "frontside": GLfloat[];
        "backside": GLfloat[];
        "total": GLfloat[];
    }
};

export const TrickMetrics = ({ trickMetrics }: TrickMetricsProps) => {
    const [chartData, setChartData] = useState({
        options: {
            xaxis: {
                categories: trickMetrics["metrics"]
            },

            yaxis: {
                min: 0,
                max: 100,
            },

            grid: {
                padding: {
                    top: -110,
                    bottom: -90,
                    left: -20,
                    right: -20,
                },
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
                data: trickMetrics["frontside"]
            },
            {
                name: "Backside",
                data: trickMetrics["backside"]
            },
            {
                name: "Total",
                data: trickMetrics["total"]
            }
        ],
    });

    useEffect(() => {

        setChartData(prevChartData => ({
            ...prevChartData,
            options: {
                ...prevChartData.options,
                xaxis: {
                    ...prevChartData.options.xaxis,
                    categories: trickMetrics["metrics"]
                },
            },
            series: [
                {
                    name: "Frontside",
                    data: trickMetrics["frontside"]
                },
                {
                    name: "Backside",
                    data: trickMetrics["backside"]
                },
                {
                    name: "Total",
                    data: trickMetrics["total"]
                }
            ],
        }));
    }, [trickMetrics]);

    return (
        <div className="bar-chart">
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="radar"
                width={600}
                height={300}
            />
        </div>
    );
};