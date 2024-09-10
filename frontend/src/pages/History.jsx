import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/appLayout/Layout';
import './styles.css';

function HistoryPage() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${apiHost}/api/history`);
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    return (
        <div className="history-container">
            UNDER DEVELOPMENT...
        </div>
    );
}

export default HistoryPage;
