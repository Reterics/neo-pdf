import {PageViewport} from "pdfjs-dist";
import {TextContent} from "pdfjs-dist/types/src/display/api";
import {EventBus} from "pdfjs-dist/types/web/event_utils";
import {GenericL10n} from "pdfjs-dist/types/web/genericl10n";
import {PDFHistory} from "pdfjs-dist/types/web/pdf_history";
import {PDFLinkService} from "pdfjs-dist/types/web/pdf_link_service";
import {PDFViewer} from "pdfjs-dist/types/web/pdf_viewer";

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

export interface WebViewerData {
    eventBus: EventBus,
    pdfLinkService: PDFLinkService,
    l10n: GenericL10n,
    pdfViewer: PDFViewer,
    pdfHistory: PDFHistory
}
