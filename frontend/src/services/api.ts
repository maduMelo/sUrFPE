import axios from 'axios';


const API_URL = 'https://meom.pythonanywhere.com';
// const API_URL = 'http://127.0.0.1:5000';

export const getApi = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        console.info(response.data.message);
    } catch (err) { console.log(err) };
};

export const getAnalysis = async (formData: FormData) => {
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
        return response.data;
    } catch (err) { console.log(err) };
};

export const getFeedback = async (data: any) => {
    try {
        const response = await axios.post(
            `${API_URL}/feedback`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.feedback;
    } catch (err) { console.log(err) };
};