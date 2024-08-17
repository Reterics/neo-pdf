import {PDFImageLike} from "../types";
import * as pdfjs from "pdfjs-dist";
import {PDFPageProxy} from "pdfjs-dist";

export const getImagesFromOperators = async (page: PDFPageProxy) => {
    const validImageTypes = new Set([
        pdfjs.OPS.paintImageXObject, // 85
        pdfjs.OPS.paintImageXObjectRepeat, // 88
    ]);
    const transformType = pdfjs.OPS.transform; // 12

    const operators = await page.getOperatorList();
    const images: PDFImageLike[] = [];

    for (let i = 0; i < operators.fnArray.length; i++) {
        const element = operators.fnArray[i];
        if (validImageTypes.has(element)) {
            const arg = operators.argsArray[i];

            const imgIndex = arg[0];
            const img = await new Promise(resolve => page.objs.get(imgIndex, resolve)) as PDFImageLike;

            if (img) {
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
    return images;
}
