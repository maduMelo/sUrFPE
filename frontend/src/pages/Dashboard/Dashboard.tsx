import { useState } from 'react';
import axios from 'axios';

import { GeneralMean } from '../../components/GeneralMean/GeneralMean';
import { TricksMean } from '../../components/TricksMean/TricksMean';
import { WaveTypeTricks } from '../../components/WaveTypeTricks/WaveTypeTricks';
import { TricksMetrics } from '../../components/TricksMetrics/TricksMetrics';

import "./Dashboard.css";
import { Button } from '../../components/Button/Button';
import { FilePicker } from '../../components/FilePicker/FilePicker';


export const Dashboard = ({ }) => {
    const [analysisData, setAnalysisData] = useState({});

    const API_URL = 'https://meom.pythonanywhere.com';
    // const API_URL = 'http://127.0.0.1:5000';

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
        <div id='dashboard-view' className=''>
            <header className='flex justify-between items-center mx-6 px-6 pb-6 border-b border-b-[#CECECE]'>
                <h1 className='text-[28px] font-medium'>Relatório do atleta</h1>

                <div className='flex gap-2 w-[40vw]'>
                    <FilePicker onFileSelected={sendCSV}
                    />

                    <Button
                        variant='outlined'
                        callToAction='Baixar Análise'
                    />
                </div>
            </header>

            <div className='charts-wrapper'>
                <GeneralMean />
                <TricksMean />
                <WaveTypeTricks />
                <TricksMetrics />
            </div>
        </div>
    );
};