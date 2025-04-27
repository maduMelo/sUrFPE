import { useState } from 'react';
import axios from 'axios';
import "./Dashboard.css";
import { mockData } from './mockData';

import { Button } from '../../components/Button/Button';
import { FilePicker } from '../../components/FilePicker/FilePicker';
import { ChartContainer } from '../../components/ChartContainer/ChartContainer';

import { TricksMean } from '../../components/Charts/TricksMean/TricksMean';
import { WaveTypeTricks } from '../../components/Charts/WaveTypeTricks/WaveTypeTricks';
import { TrickMetrics } from '../../components/Charts/TrickMetrics/TrickMetrics';
import { TricksCount } from '../../components/Charts/TricksCount/TricksCount';


export const Dashboard = ({ }) => {
    const [analysisData, setAnalysisData] = useState(mockData);

    // const API_URL = 'https://meom.pythonanywhere.com';
    const API_URL = 'http://127.0.0.1:5000';

    const sendCSV = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${API_URL}/analyze`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setAnalysisData(response.data);
        } catch (err) { console.log(err) };
    };

    return (
        <div className='mx-[4vw]'>
            <header className='flex justify-between items-center mx-6 mb-6 px-6 pb-6 border-b border-b-[#CECECE]'>
                <h1 className='text-[28px] text-[#1E1E1E] font-medium'>Relatório do atleta</h1>

                <div className='flex gap-2 w-[40vw]'>
                    <FilePicker onFileSelected={sendCSV}
                    />

                    <Button
                        variant='outlined'
                        callToAction='Baixar Análise'
                    />
                </div>
            </header>

            {/* Charts Grid */}
            <div className='h-full w-full grid grid-cols-4 grid-rows-5 gap-4'>
                {/* Desempenho geral */}
                <div className="col-span-1 row-span-1 rounded-lg">
                    <ChartContainer
                        title="Desempenho geral"
                        description="Média geral das manobras praticadas pelo atleta"
                    >
                        <TricksMean
                            tricks={analysisData["tricks_mean_scores"]["tricks"]}
                            tricksScores={analysisData["tricks_mean_scores"]["scores"]}
                        />
                    </ChartContainer>
                </div>

                {/* Total de manobras */}
                <div className="col-span-1 row-span-1 rounded-lg">
                    <ChartContainer
                        title="Total de manobras"
                        description="Número total de manobras praticadas detalhadas por lado da onda"
                    >
                        <TricksCount
                            tricksCount={analysisData["wave_type_tricks_count"]["counts"]}
                        />
                    </ChartContainer>
                </div>

                {/* Feedback do treinamento */}
                <div className="col-span-2 row-span-2 rounded-lg">
                    <ChartContainer
                        title="Feedback do treinamento"
                        description="Feedback gerado por IA a partir das análises feitas em cima dos dados do treinamento"
                    >
                        <WaveTypeTricks
                            tricks={analysisData["tricks_performance_by_wave_type"]["tricks"]}
                            frontsideScores={analysisData["tricks_performance_by_wave_type"]["frontside"]}
                            backsideScores={analysisData["tricks_performance_by_wave_type"]["backside"]}
                        />
                    </ChartContainer>
                </div>

                {/* Desempenho por manobra */}
                <div className="col-span-2 row-span-1 rounded-lg">
                    <ChartContainer
                        title="Desempenho por manobra"
                        description="Média geral de cada manobra detalhando o lado da onda"
                    >
                        <WaveTypeTricks
                            tricks={analysisData["tricks_performance_by_wave_type"]["tricks"]}
                            frontsideScores={analysisData["tricks_performance_by_wave_type"]["frontside"]}
                            backsideScores={analysisData["tricks_performance_by_wave_type"]["backside"]}
                        />
                    </ChartContainer>
                </div>

                {/* Desempenho por indicador */}
                <div className="col-span-4 row-span-3 rounded-lg">
                    <ChartContainer
                        title="Desempenho por indicador"
                        description="Média geral de cada indicador das manobras detalhados por lado da onda"
                    >
                        <>
                            {analysisData["indicator_trick_means_scores"]["tricks"].map((trick, index) => (
                                <div className='flex flex-col mt-10 items-center gap-4' key={index}>
                                    <h1 className='text-[15px] text-[#224A68] font-medium'>
                                        {trick}
                                    </h1>
                                    <TrickMetrics
                                        trickMetrics={analysisData["indicator_trick_means_scores"]["chartsInfo"][index]}
                                    />
                                </div>
                            ))}
                        </>
                    </ChartContainer>
                </div>

            </div>
        </div>
    );
};