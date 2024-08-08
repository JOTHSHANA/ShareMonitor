import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from "../components/appLayout/Layout";
import apiHost from "../components/utils/api";
import './styles.css';

function History() {
    return <Layout rId={2} body={<Body />} />;
}

function Body() {
    
    return (
        <>
        History
        </>
    );
}

export default History;
