import React, { useRef, useState } from 'react';
import { Button } from '../Button/Button';

interface FilePickerProps {
    onFileSelected: (file: File) => Promise<void>;
}

export const FilePicker: React.FC<FilePickerProps> = ({ onFileSelected }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleButtonClick = () => {
        setError(null);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files || files.length === 0) return;
        if (files.length > 1) return;


        const file = files[0];

        // Validate file type
        if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
            setError('Please select a CSV file');
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        onFileSelected(file);
        setError(null);
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv, text/csv"
                style={{ display: 'none' }}
            />
            <Button
                variant='contained'
                callToAction={selectedFile ? `Selected: ${selectedFile.name}` : 'Nova Análise'}
                onClick={handleButtonClick}
            />
        </>
    );
};