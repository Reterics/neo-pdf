import {getDocument, PageViewport, PDFDocumentProxy} from "pdfjs-dist";
import * as pdfjs from "pdfjs-dist";
import {useEffect, useRef, useState} from "react";
import {TextItem} from "pdfjs-dist/types/src/display/api";
import 'pdfjs-dist/webpack.mjs';
import {PDFImageLike, PDFPageData, SVGPDFViewerProperties} from "../types";
import {getImagesFromOperators} from "../utils/pdf";



const SVGPDFViewer = ({defaultSrc, pagination}:SVGPDFViewerProperties) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pdfDocument, setPDFDocument] = useState<PDFDocumentProxy|null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageScale, setPageScale] = useState(1);
    const [pageData, setPageData] = useState<PDFPageData>({
        viewPort: null,
        textContent: null,
        images: []
    });

    const renderImages = (images: PDFImageLike[], canvas: HTMLCanvasElement | null, viewPort: PageViewport) => {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                images.forEach((image) => {
                    if (image.bitmap) {
                        const tx = pdfjs.Util.transform(
                            pdfjs.Util.transform(viewPort.transform, image.transform),
                            [1, 0, 0, -1, 0, 0]
                        );
                        ctx.drawImage(image.bitmap, tx[4], tx[5] - tx[3],
                            tx[0], tx[3]);

                    }

                })

            }
        }
    }

    const loadPage = async (pdfDocument: PDFDocumentProxy) => {
        const page = await pdfDocument.getPage(pageNumber);
        const viewPort = page.getViewport({ scale: pageScale });
        const textContent = await page.getTextContent({
            disableNormalization: true
        });

        const images = await getImagesFromOperators(page);

        // building SVG and adding that to the DOM

        setPageData({viewPort: viewPort, textContent, images})

        renderImages(images, canvasRef.current, viewPort);

        // Release page resources.
        page.cleanup();
    };

    const loadDocument = async (src: string | URL | null) => {
        const loadingTask = getDocument({ url: src || undefined });
        const pdfDocument = await loadingTask.promise;

        setPDFDocument(pdfDocument);
    };

    useEffect(()=>{
        void loadDocument(defaultSrc);
    }, [defaultSrc]);

    useEffect(()=>{
        if (pdfDocument) {
            void loadPage(pdfDocument)
        }
    }, [pdfDocument, pageNumber]);

    const changePage = (operator: '-'|'+'|'set', value?: undefined|number) => {
        if (pdfDocument) {
            let target = pageNumber;
            if (operator === '-') {
                target = Math.max(1, pageNumber-1);
            } else if (operator === '+') {
                target = Math.min(pageNumber+1, pdfDocument.numPages);
            } else if (operator === 'set' && typeof value === 'number') {
                target = Math.min(Math.max(1, value), pdfDocument.numPages);
            } else {
                return;
            }

            setPageNumber(target);
        }

    }
    return (
        <>
            {pagination &&
                <div className='svg-viewer-controls'>
                    <input type="button" value='<<' onClick={()=>changePage('-')}/>
                    <input type="number"
                           value={pageNumber}
                           onChange={(e) => changePage('set', Number(e.target.value))}
                    /> / {pdfDocument ? pdfDocument.numPages : 0}
                    <input type="button" value='>>' onClick={()=>changePage('+')}/>
                </div>
            }
            <div className='svg-viewer-container'>
                <canvas
                    ref={canvasRef}
                    width={pageData.viewPort ? pageData.viewPort.width : undefined}
                    height={pageData.viewPort ? pageData.viewPort.height + 'px' : undefined}
                    style={{position: 'absolute', pointerEvents: 'none'}}
                ></canvas>
                <svg xmlns="http://www.w3.org/2000/svg" className='svg-viewer'
                    viewBox={pageData.viewPort ? pageData.viewPort.viewBox.join(' ') : undefined}
                    style={{
                        width: pageData.viewPort ? pageData.viewPort.width + 'px' : '100%',
                        height: pageData.viewPort ? pageData.viewPort.height + 'px' : '100%',
                    }}>
                    {pageData.textContent && pageData.viewPort &&
                        pageData.textContent.items.map((textItem, index) => {
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
                                        key={'svg_text_' + index}
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
            </div>
        </>
    )
};

export default SVGPDFViewer;
