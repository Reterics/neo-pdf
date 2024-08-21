import {
    FaA,
    FaArrowLeft,
    FaArrowRight, FaFileImage, FaFloppyDisk, FaFolderOpen, FaHighlighter,
    FaMagnifyingGlass,
    FaMagnifyingGlassMinus,
    FaMagnifyingGlassPlus, FaPencil, FaPrint
} from "react-icons/fa6";
import './Toolbar.less';
import {useContext} from "react";
import {PDFContext} from "../../PDFProvider";

const Toolbar = () => {

    const context = useContext(PDFContext);

    const openPDFFile = () => {
        if (!context || !context.emit) {
            console.warn('Context is not ready');
            return;
        }

        const fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'application/pdf');

        fileInput.onchange = async function (): Promise<void> {
            const files = fileInput.files as FileList;
            if (files && files.length && context) {
                const fileURL = URL.createObjectURL(files[0]);

                context.emit("open", fileURL)
            }
            fileInput.outerHTML = "";
        };
        document.body.appendChild(fileInput);
        fileInput.click();
    }

    return (
        <div className="toolbar">
            <div id="svg-viewer-container" className="toolbar-container">
                <div className="toolbar-container-left">
                    <button id="viewFind" className="toolbar-button" type="button" title="Find in Document"
                            tabIndex={12}>
                        <FaMagnifyingGlass/>

                    </button>
                    <button className="toolbar-button" title="Previous Page" id="previous" type="button"
                            tabIndex={13}>
                        <FaArrowLeft/>
                    </button>

                    <button className="toolbar-button" title="Next Page" id="next" type="button" tabIndex={14}>
                        <FaArrowRight/>
                    </button>
                    <input type="number" id="pageNumber" className="toolbar-field w-40px" title="Page" defaultValue="1"
                           min="1"
                           tabIndex={15} autoComplete="off"/>

                    <span id="numPages" className="toolbarLabel"></span>
                </div>

                <div className="toolbar-container-middle">
                    <button id="zoomOut" className="toolbar-button" type="button" title="Zoom Out" tabIndex={21}>
                        <FaMagnifyingGlassMinus/>
                    </button>
                    <div className="vertical-toolbar-separator"></div>
                    <button id="zoomIn" className="toolbar-button" type="button" title="Zoom In" tabIndex={22}
                            data-l10n-id="pdfjs-zoom-in-button">
                        <FaMagnifyingGlassPlus />
                    </button>
                </div>

                <div className="toolbar-container-rigth">
                    <div className="editor-buttons">
                        <button id="editorHighlight" className="toolbar-button" type="button" disabled={true}
                                title="Highlight" role="radio" tabIndex={31}>
                            <FaHighlighter/>

                        </button>
                        <button id="editorFreeText" className="toolbar-button" type="button" disabled={true}
                                title="Text" role="radio"
                                aria-controls="editorFreeTextParamsToolbar" tabIndex={32}>
                            <FaA/>
                        </button>
                        <button id="editorInk" className="toolbar-button" type="button" disabled={true} title="Draw"
                                role="radio" tabIndex={33}>
                            <FaPencil/>
                        </button>
                        <button id="editorStamp" className="toolbar-button" type="button" disabled={true}
                                title="Add or edit images" role="radio"
                                tabIndex={34}>
                            <FaFileImage/>
                        </button>

                    </div>

                    <div className="vertical-toolbar-separator"></div>

                    <button id="print" className="toolbar-button" type="button" title="Print"
                            tabIndex={41}>
                        <FaPrint/>
                    </button>

                    <button id="open" className="toolbar-button" type="button" title="Open"
                            tabIndex={42} onClick={()=>openPDFFile()}>
                        <FaFolderOpen />
                    </button>

                    <button id="download" className="toolbar-button" type="button" title="Save"
                            tabIndex={42}>
                        <FaFloppyDisk/>
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Toolbar;
