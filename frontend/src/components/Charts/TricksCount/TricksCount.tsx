import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';


interface TricksCountProps {
    tricksCount: number[];
};

export const TricksCount = ({ tricksCount }: TricksCountProps) => {
    const [chartData, setChartData] = useState({
        options: {
            legend: {
                show: true,
                position: 'bottom' as 'bottom',
            },
            labels: ['Frontside', 'Backside'],
            plotOptions: {
                pie: {
                    donut: {
                        size: '80%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                fontSize: '16px',
                                fontWeight: 600,
                                formatter: (w: any) => w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0).toString(),
                            },
                        },
                    },
                },
            },
        },
        series: tricksCount,
    });

    useEffect(() => {
        if (tricksCount) {
            setChartData(prevChartData => ({
                ...prevChartData,
                series: tricksCount
            }));
        };
    }, [tricksCount])

    return (
        <div className="bar-chart">
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="donut"
                width={260} //370
                height={210} //350
            />
        </div>
    );
};