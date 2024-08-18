import ContainerComponent from "./components/ContainerComponent";
import SVGPDFViewer from "./components/SVGPDFViewer";
import WebPDFViewer from "./components/WebPDFViewer";

export const textPackage = () => {
    return "Hello, World!";
}

export const NeoPDF = ContainerComponent;
export const SVGViewer = SVGPDFViewer
export const WebViewer = WebPDFViewer
