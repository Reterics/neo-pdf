import {PageViewport, getDocument, TextLayer} from "pdfjs-dist";
import * as pdfjs from "pdfjs-dist";
import {useEffect, useState} from "react";
import {TextContent, TextItem} from "pdfjs-dist/types/src/display/api";
import 'pdfjs-dist/webpack.mjs';



const SVGPDFViewer = ({src}:{src:string}) => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageScale, setPageScale] = useState(1);
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
        const textContent = await page.getTextContent({
            disableNormalization: true
        });
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
        <svg xmlns="http://www.w3.org/2000/svg" className='svg-viewer'
            viewBox={pageData.viewPort ? pageData.viewPort.viewBox.join(' ') : undefined}
            style={{
                width: pageData.viewPort ? pageData.viewPort.width + 'px' : '100%',
                height: pageData.viewPort ? pageData.viewPort.height + 'px' : '100%',
            }}>
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

                        const fontSize = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
                        return (
                            <text
                                x={tx[4]}
                                y={tx[5]}
                                /*transform={"matrix(" + tx.join(" ") + ")"}*/
                                fontFamily={style.fontFamily}
                                fontSize={fontSize-1 + 'px '}
                                textLength={text.width+'px'}

                            >{text.str}</text>)
                    }
                })
               }
        </svg>
    )
};

export default SVGPDFViewer;
