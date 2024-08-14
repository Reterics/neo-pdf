import {PageViewport, getDocument, TextLayer} from "pdfjs-dist";
import * as pdfjs from "pdfjs-dist";
import {useEffect, useState} from "react";
import {TextContent, TextItem} from "pdfjs-dist/types/src/display/api";
import 'pdfjs-dist/webpack.mjs';



const SVGPDFViewer = ({src}:{src:string}) => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageScale, setPageScale] = useState(0.5);
    const [pageData, setPageData] = useState<{
        viewPort: PageViewport|null,
        textContent: TextContent|null,
    }>({
        viewPort: null,
        textContent: null,
    });

    async function loadPage () {
        const loadingTask = getDocument({ url: src });
        const pdfDocument = await loadingTask.promise;
        const page = await pdfDocument.getPage(pageNumber);
        const viewPort = page.getViewport({ scale: pageScale });
        const textContent = await page.getTextContent();
        // building SVG and adding that to the DOM

        setPageData({viewPort: viewPort, textContent})
        //const svg = buildSVG(viewPort, textContent);

        // Release page resources.
        page.cleanup();
    }

    useEffect(()=>{
        void loadPage();
    }, []);

    return (
        <svg xmlns="http://www.w3.org/2000/svg">
            {pageData.textContent && pageData.viewPort &&
                pageData.textContent.items.map(textItem => {
                    const viewPort = pageData.viewPort;
                    const textContent = pageData.textContent
                    if (viewPort && textContent) {
                        const text = textItem as TextItem;
                        const tx = pdfjs.Util.transform(
                            pdfjs.Util.transform(viewPort.transform, text.transform),
                            [1, 0, 0, -1, 0, 0]
                        );
                        const style = textContent.styles[text.fontName];
                        return (
                            <text transform={"matrix(" + tx.join(" ") + ")"} fontFamily={style.fontFamily}>{text.str}</text>)
                    }
                })
               }
        </svg>
    )
};

export default SVGPDFViewer;
