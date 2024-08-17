import {PageViewport} from "pdfjs-dist";
import {PDFOperatorList, TextContent} from "pdfjs-dist/types/src/display/api";

export interface PDFImageLike {
    bitmap?: ImageBitmap,
    data?: unknown,
    dataLen: number,
    height: number,
    interpolate?: boolean,
    ref: string,
    width: number,
    transform: number[],
}

export interface PDFPageData {
    viewPort: PageViewport|null,
    textContent: TextContent|null,
    images: PDFImageLike[]
}

export interface SVGPDFViewerProperties {
    src: string|URL|null,
    pagination?: boolean,
}
