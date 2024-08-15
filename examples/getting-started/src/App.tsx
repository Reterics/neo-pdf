import React from 'react';
import {SVGViewer} from '../../../dist';
import './App.css';

const App: React.FC = () => {
    const src = './text.pdf';
    return (
        <div>
            <h1>TypeScript Example of MyComponent</h1>
            <SVGViewer src={src}/>
        </div>
    );
};

export default App;
