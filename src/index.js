import React,{ Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
import './App.scss';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import LoadingShow from './components/admin/components/LoadingShow';

ReactDOM.render(
    <BrowserRouter>
        <React.Suspense fallback={
            <LoadingShow show={true}/>
            // <span className='loader'></span>
            }>
            <App />
        </React.Suspense>
    </BrowserRouter>,
    document.getElementById("root")
);
