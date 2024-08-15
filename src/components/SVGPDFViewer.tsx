import {PageViewport, getDocument, TextLayer} from "pdfjs-dist";
import * as pdfjs from "pdfjs-dist";
import {useEffect, useRef, useState} from "react";
import {PDFOperatorList, TextContent, TextItem} from "pdfjs-dist/types/src/display/api";
import 'pdfjs-dist/webpack.mjs';

interface PDFImageLike {
    bitmap?: ImageBitmap,
    data?: unknown,
    dataLen: number,
    height: number,
    interpolate?: boolean,
    ref: string,
    width: number,
    transform: number[],
}

const SVGPDFViewer = ({src}:{src:string}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageScale, setPageScale] = useState(1);
    const [pageData, setPageData] = useState<{
        viewPort: PageViewport|null,
        textContent: TextContent|null,
        operators: PDFOperatorList|null
        images: PDFImageLike[]
    }>({
        viewPort: null,
        textContent: null,
        operators: null,
        images: []
    });

    async function loadPage () {
        const loadingTask = getDocument({ url: src });
        const pdfDocument = await loadingTask.promise;
        const page = await pdfDocument.getPage(pageNumber);
        const viewPort = page.getViewport({ scale: pageScale });
        const textContent = await page.getTextContent({
            disableNormalization: true
        });
        const operators = await page.getOperatorList();

        const validImageTypes = new Set([
            pdfjs.OPS.paintImageXObject, // 85
            pdfjs.OPS.paintImageXObjectRepeat, // 88
        ]);
        const transformType = pdfjs.OPS.transform; // 12

        const images: PDFImageLike[] = [];
        for (let i = 0; i < operators.fnArray.length; i++) {
            const element = operators.fnArray[i];
            if (validImageTypes.has(element)) {
                const arg = operators.argsArray[i];

                const imgIndex = arg[0];
                const img = await new Promise(resolve => page.objs.get(imgIndex, resolve)) as PDFImageLike;

                let imgMeta;
                for (let ind2 = i - 1; ind2 > i - 5; ind2--) {
                    if (operators.fnArray[ind2] == transformType) {
                        let tf = operators.argsArray[ind2];
                        if (
                            operators.fnArray?.[0] == transformType &&
                            operators.fnArray?.[1] == pdfjs.OPS.save
                        ) {
                            // tf = combineTransform(tf, operatorList.argsArray[0]);
                        }
                        imgMeta = {
                            width: tf[0],
                            height: tf[3],
                            transform: tf
                        }

                        break;
                    }
                }

                if (img) {
                    images.push({
                        transform: imgMeta ? imgMeta.transform : null,
                        bitmap: img.bitmap,
                        data: img.data,
                        dataLen: img.dataLen,
                        height: imgMeta ? imgMeta.height : img.height,
                        interpolate: img.interpolate,
                        ref: img.ref,
                        width: imgMeta ? imgMeta.width : img.width,
                    });
                }
            }
        }
        // building SVG and adding that to the DOM

        setPageData({viewPort: viewPort, textContent, operators, images})

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                images.forEach((image, i) => {
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
        // Release page resources.
        page.cleanup();
    }

    useEffect(()=>{
        void loadPage();
    }, []);

    return (
        <>
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
        </>
    )
};

export default SVGPDFViewer;
