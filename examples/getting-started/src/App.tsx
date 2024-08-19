import React, {useState} from 'react';
import {WebViewer} from 'neo-pdf';
import './App.css';

const App: React.FC = () => {
    const defaultFile = './text.pdf';

    const [file, setFile] = useState<string|URL|null>(defaultFile);

    const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileURL = URL.createObjectURL(e.target.files[0]);
            setFile(fileURL);
        }
    };

    return (
        <div>
            <h1>Neo-PDF</h1>
            <input type="file" onChange={(e) => onFileChanged(e)}/>
            <WebViewer src={file} pagination={true}/>
        </div>
    );
};

export default App;
