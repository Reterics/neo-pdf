import {createContext, ReactNode, useEffect, useRef, useState} from "react";
import {PDFContextAPI, WebViewerData} from "./types";
import {AnnotationEditorType, getDocument, PDFDocumentLoadingTask, PDFDocumentProxy} from "pdfjs-dist";
import {
    DownloadManager,
    EventBus,
    GenericL10n,
    PDFFindController, PDFHistory,
    PDFLinkService,
    PDFScriptingManager, PDFViewer
} from "pdfjs-dist/web/pdf_viewer.mjs";

const MAX_IMAGE_SIZE = 1024 * 1024;
const MAX_CANVAS_PIXELS = 0; // CSS-only zooming.
const TEXT_LAYER_MODE = 1; // DISABLE
const DEFAULT_SCALE_VALUE = "auto";

export const PDFContext = createContext<PDFContextAPI | null>(null);

export const PDFProvider = ( {children, defaultSrc}: {children: ReactNode, defaultSrc?: string|URL|null} ) => {
    const container = useRef<HTMLDivElement>(null);
    const viewerContainer = useRef<HTMLDivElement>(null);
    const [src, setSrc] = useState<string|URL|null>(defaultSrc||null);
    const [viewerData, setViewerData] = useState<WebViewerData|null>(null);


    useEffect(()=>{
        console.log('Src: ', src);
        if (!src || !container.current) {
            return;
        }

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
            annotationEditorMode: AnnotationEditorType.NONE,
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


        console.log('Get new document');
        const loadingTask = getDocument({
            url: src,
            maxImageSize: MAX_IMAGE_SIZE
        });

        loadingTask.promise.then((pdf: PDFDocumentProxy) => {
            pdfViewer.setDocument(pdf);
            pdfLinkService.setDocument(pdf);
            pdfHistory.initialize({
                fingerprint: pdf.fingerprints[0]
            });

            setViewerData({
                pdfViewer: pdfViewer,
                pdfLinkService: pdfLinkService,
                pdfHistory: pdfHistory,
                l10n: l10n,
                eventBus: eventBus
            });
        }).catch(e=>{
            console.error(e);
        })

        return () => {
            pdfViewer.setDocument(null as unknown as PDFDocumentProxy);
            pdfLinkService.setDocument(null, null);
            pdfHistory.reset();
        };
    }, [src]);

    const eventMgr = (type: 'open', value: unknown)=> {
        switch (type) {
            case "open":
                setSrc(value as string | URL | null);
                break;
            default:
                console.warn('Invalid event: ', type);
        }
    }

    return (
        <PDFContext.Provider value={{
            viewerData,
            pdfDocument: viewerData ? viewerData.pdfViewer.pdfDocument : undefined,
            emit: eventMgr
        }}>
            {children}

            <div ref={container} className="viewer-container" tabIndex={0} style={{position: 'absolute'}}>
                <div ref={viewerContainer} id="viewer" className="pdfViewer"></div>
            </div>
        </PDFContext.Provider>
    )
}
