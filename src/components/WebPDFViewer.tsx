import {useEffect, useRef, useState} from "react";
import {
    EventBus,
    PDFLinkService,
    GenericL10n,
    PDFViewer,
    PDFHistory,
    DownloadManager, PDFFindController, PDFScriptingManager
} from "pdfjs-dist/web/pdf_viewer.mjs";
import 'pdfjs-dist/webpack.mjs';
import {SVGPDFViewerProperties, WebViewerData} from "../types";
import {AnnotationEditorType, getDocument, PDFDocumentLoadingTask, PDFDocumentProxy} from "pdfjs-dist";

const MAX_CANVAS_PIXELS = 0; // CSS-only zooming.
const TEXT_LAYER_MODE = 0; // DISABLE
const MAX_IMAGE_SIZE = 1024 * 1024;
const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.25;
const MAX_SCALE = 10.0;
const DEFAULT_SCALE_VALUE = "auto";


const WebPDFViewer = ({src}: SVGPDFViewerProperties) => {
    const container = useRef<HTMLDivElement>(null);
    const viewerContainer = useRef<HTMLDivElement>(null);
    const [viewerData, setViewerData] = useState<WebViewerData|null>(null);
    const [pdfLoadingTask, setPdfLoadingTask] = useState<PDFDocumentLoadingTask|null>(null);
    const [pdfDocument, setPDFDocument] = useState<PDFDocumentProxy|null>(null);

    const close = async () => {
        if (!pdfLoadingTask) {
            return;
        }

        const promise = pdfLoadingTask.destroy();
        setPdfLoadingTask(null);

        if (pdfDocument) {
            setPDFDocument(null);

            viewerData?.pdfViewer.setDocument(null as unknown as PDFDocumentProxy);
            viewerData?.pdfLinkService.setDocument(null, null);

            if (viewerData?.pdfHistory) {
                viewerData.pdfHistory.reset();
            }
        }

        return promise;
    };
    const open = async (params: {url: string}) => {
        if (pdfLoadingTask) {
            // We need to destroy already opened document
            return close()
                .then(() => {
                    open(params);
                });
        }

        const loadingTask = getDocument({
            url: params.url,
            maxImageSize: MAX_IMAGE_SIZE
        });
        setPdfLoadingTask(loadingTask);
    };

    useEffect(() => {
        if (pdfLoadingTask) {
            pdfLoadingTask.promise.then((pdf: PDFDocumentProxy) => {
                setPDFDocument(pdf);
                viewerData?.pdfViewer.setDocument(pdf);
                viewerData?.pdfLinkService.setDocument(pdf);
                viewerData?.pdfHistory.initialize({
                    fingerprint: pdf.fingerprints[0]
                })
            });
        }
    }, [pdfLoadingTask]);

    useEffect(() => {
        if (container.current) {
            console.log('Load Viewer data');
            const eventBus = new EventBus();
            const pdfLinkService = new PDFLinkService({
                eventBus
            });
            const l10n = new GenericL10n('en-US');
            const downloadManager = new DownloadManager();

            const findController = new PDFFindController({
                linkService: pdfLinkService,
                eventBus,
                // @ts-ignore
                updateMatchesCountOnProgress: !window.isGECKOVIEW
            });
            const pdfScriptingManager = new PDFScriptingManager({
                eventBus,
            });

            /*const annotationEditorParams = new AnnotationEditorParams(
                annotationEditorParams,
                eventBus
            );*/

            const viewer = viewerContainer.current as HTMLDivElement;
            const pdfViewer = new PDFViewer({
                container: container.current,
                viewer,
                eventBus,
                linkService: pdfLinkService,
                annotationEditorMode: AnnotationEditorType.HIGHLIGHT,
                findController: findController,
                scriptingManager: pdfScriptingManager,
                l10n: l10n,
                maxCanvasPixels: MAX_CANVAS_PIXELS,
                textLayerMode: TEXT_LAYER_MODE,

                downloadManager
            });

            pdfLinkService.setViewer(pdfViewer);

            const pdfHistory = new PDFHistory({
                eventBus, linkService: pdfLinkService
            });
            pdfLinkService.setHistory(pdfHistory);

            eventBus.on("pagesinit", function () {
                // We can use pdfViewer now, e.g. let's change default scale.
                pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE;
            });

            setViewerData({
                eventBus,
                pdfLinkService,
                l10n,
                pdfViewer,
                pdfHistory
            });
        }
    }, []);

    useEffect(() => {
        if (viewerData) {
            // UI is loaded
            void open({url: src as string});
        }
    }, [viewerData]);

    return (
        <div className="web-viewer-outer">
            <div className="web-viewer-main">
                <div className="toolbar">
                    <div id="svg-viewer-container">
                        <div></div>
                        <div></div>
                        <div>
                            <button id="editorFreeText" className="toolbar-button" type="button">Text</button>
                        </div>
                    </div>
                </div>

                <div ref={container} className="viewer-container" tabIndex={0} style={{position: 'absolute'}}>
                    <div ref={viewerContainer} id="viewer" className="pdfViewer"></div>
                </div>
            </div>
        </div>
    )
}

export default WebPDFViewer;
