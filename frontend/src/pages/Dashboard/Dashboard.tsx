import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import "./Dashboard.css";
import { mockData } from './mockData';
import { usePDF } from 'react-to-pdf';

import loadingAnimation from "../../assets/loading.gif";
import aiSurfing from "../../assets/ai_surfing.png";

import { getAnalysis, getFeedback } from '../../services/api';

import { Button } from '../../components/Button/Button';
import { FilePicker } from '../../components/FilePicker/FilePicker';
import { ChartContainer } from '../../components/ChartContainer/ChartContainer';

import { TricksMean } from '../../components/Charts/TricksMean/TricksMean';
import { WaveTypeTricks } from '../../components/Charts/WaveTypeTricks/WaveTypeTricks';
import { TrickMetrics } from '../../components/Charts/TrickMetrics/TrickMetrics';
import { TricksCount } from '../../components/Charts/TricksCount/TricksCount';


export const Dashboard = ({ }) => {
    const aiFeedbackPlaceholder = "Feedback gerado por IA a partir das análises feitas em cima dos dados do treinamento";

    const [analysisData, setAnalysisData] = useState(mockData);
    const [aiFeedback, setAiFeedback] = useState(aiFeedbackPlaceholder);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const { toPDF, targetRef } = usePDF({filename: `${analysisData["tricks_mean_scores"]["athlete"]}.pdf`});

    const sendCSV = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        setLoadingFeedback(true);
        getAnalysis(formData).then((response) => {
            setAnalysisData(response);

            getFeedback(response).then((feedback) => {
                setAiFeedback(feedback);
            });
        }).finally(() => setLoadingFeedback(false) );
    };

    return (
        <div className='mx-[4vw]'>
            <header className='flex justify-between items-center mb-6 px-6 pb-6 border-b border-b-[#CECECE]'>
                <h1 className='text-[28px] text-[#1a1a1a] font-medium'>Relatório do atleta</h1>

                <div className='flex flex-col md:flex-row gap-2 w-[40vw]'>
                    <FilePicker onFileSelected={sendCSV} />

                    <Button
                        variant='outlined'
                        callToAction={isDownloading ? 'Preparando PDF...' : 'Baixar Análise'}
                        icon='download'
                        onClick={() => {
                            setIsDownloading(true);
                            toPDF();
                            setTimeout(() => {
                                setIsDownloading(false);
                            }, 1500);
                        }}
                    />
                </div>
            </header>

            {/* Charts Grid */} 
            <div className='h-full w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4' ref={targetRef}>
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
                <div className="flex flex-col items-center justify-center col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-lg">
                    <ChartContainer
                        title="Feedback do treinamento"
                        description=""
                    >
                        <div className='flex flex-col items-center gap-16'>
                            {loadingFeedback ? (<img src={loadingAnimation} alt="carregando..." />) : (
                                <p className="text-[#464646] text-[15px]">
                                    <ReactMarkdown >
                                        {aiFeedback}
                                    </ReactMarkdown>
                                </p>
                            )}
                            { aiFeedback === aiFeedbackPlaceholder && !loadingFeedback && (
                                <img src={aiSurfing} alt='robô surfando' className='w-[20vw]' />)
                            }
                        </div>
                    </ChartContainer>
                </div>

                {/* Desempenho por manobra */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-lg">
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
                <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-3 rounded-lg">
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