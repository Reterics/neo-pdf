import React from 'react';
import {WebViewer} from 'neo-pdf';
import './App.css';

const App: React.FC = () => {
    const defaultFile = './text.pdf';

    return (
        <div>
            <h1>Neo-PDF</h1>
            <WebViewer defaultSrc={defaultFile} pagination={true}/>
        </div>
    );
};

export default App;
