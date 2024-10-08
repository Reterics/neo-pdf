import {SVGPDFViewerProperties} from "../types";
import Toolbar from "./toolbar/Toolbar";
import {PDFProvider} from "../PDFProvider";


const WebPDFViewer = ({defaultSrc}: SVGPDFViewerProperties) => {
    return (
        <div className="web-viewer-outer">
            <div className="web-viewer-main">
                <PDFProvider defaultSrc={defaultSrc}>
                    <Toolbar />
                </PDFProvider>
            </div>
        </div>
    )
}

export default WebPDFViewer;
