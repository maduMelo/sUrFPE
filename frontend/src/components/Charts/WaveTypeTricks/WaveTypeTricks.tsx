import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';


interface WaveTypeTricksProps {
    tricks: string[];
    frontsideScores: GLfloat[];
    backsideScores: GLfloat[];
};

export const WaveTypeTricks = ({ tricks, frontsideScores, backsideScores }: WaveTypeTricksProps) => {
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: "basic-bar",
                stacked: true,
            },
            xaxis: {
                categories: tricks
            },
            yaxis: {
                min: 0,
                max: 200,
                labels: {
                    formatter: function (val: number) {
                        return val + '%';
                    },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val: number) {
                    return val + '%';
                },
            },
        },
        series: [
            {
                name: "Frontside",
                data: frontsideScores
            },
            {
                name: "Backside",
                data: backsideScores
            }
        ]
    });

    useEffect(() => {
        setChartData(prevChartData => ({
            ...prevChartData,
            options: {
                ...prevChartData.options,
                xaxis: {
                    ...prevChartData.options.xaxis,
                    categories: tricks
                }
            },
            series: [
                { name: "Frontside", data: frontsideScores },
                { name: "Backside", data: backsideScores }
            ]
        }))
    }, [tricks, frontsideScores, backsideScores]);

    return (
        <div className="bar-chart">
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                width={580}
                height={220}
            />
        </div>
    );
};