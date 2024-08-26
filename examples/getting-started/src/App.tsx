import React from 'react';
import {WebViewer} from 'neo-pdf';
import './App.css';

const App: React.FC = () => {
    const defaultFile = './text.pdf';

    return (
        <div>
            <WebViewer defaultSrc={defaultFile}/>
        </div>
    );
};

export default App;
