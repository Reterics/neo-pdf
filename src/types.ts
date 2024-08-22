import {PageViewport, PDFDocumentProxy} from "pdfjs-dist";
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
    defaultSrc: string|URL|null,
    pagination?: boolean,
}

export interface WebViewerData {
    eventBus: EventBus,
    pdfLinkService: PDFLinkService,
    l10n: GenericL10n,
    pdfViewer: PDFViewer,
    pdfHistory: PDFHistory
}

export interface PDFContextAPI {
    viewerData: WebViewerData|null,
    pdfDocument?: PDFDocumentProxy,
    emit: (type: 'open'|'annotation', value: unknown)=>void
}
