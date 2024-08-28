import {
    FaA,
    FaArrowLeft,
    FaArrowRight, FaCirclePlus, FaFileImage, FaFloppyDisk, FaFolderOpen, FaHighlighter,
    FaMagnifyingGlass,
    FaMagnifyingGlassMinus,
    FaMagnifyingGlassPlus, FaPencil, FaPrint
} from "react-icons/fa6";
import './Toolbar.less';
import {useContext, useState} from "react";
import {PDFContext} from "../../PDFProvider";
import ToolbarDropdown from "./ToolbarDropdown";
import {AnnotationEditorType} from "pdfjs-dist";

const Toolbar = () => {

    const context = useContext(PDFContext);

    const [highlight, setHighlight] = useState(false);
    const [text, setText] = useState(false);
    const [draw, setDraw] = useState(false);
    const [image, setImage] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);

    const changePageNumber = (value: number) => {
        if (context?.viewerData?.pdfViewer?.pagesCount &&
            value > 0 && value < context?.viewerData?.pdfViewer?.pagesCount) {
            setPageNumber(value);

            const currentPageNumber = context?.emit('page', value);
            console.error('Set Page number to ', currentPageNumber)
        }
    };

    const toggleMenu = (type: number) => {
        setHighlight(type === AnnotationEditorType.HIGHLIGHT ? !highlight : false);
        setText(type === AnnotationEditorType.FREETEXT ? !text : false);
        setDraw(type === AnnotationEditorType.INK ? !draw : false);
        setImage(type === AnnotationEditorType.STAMP ? !image : false);

        if (!highlight && !text && !draw && !image) {
            context?.emit('switchannotationeditormode', AnnotationEditorType.NONE);
        } else {
            context?.emit('switchannotationeditormode', type);
        }
    };

    const zoom = (step: 1|-1) => {
        context?.emit('zoom', step);
    };

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
            <div className="toolbar-container">
                <div className="toolbar-container-left">
                    <button id="viewFind" className="toolbar-button" type="button" title="Find in Document"
                            tabIndex={12}>
                        <FaMagnifyingGlass/>
                    </button>
                    <button className="toolbar-button" title="Previous Page" id="previous" type="button"
                            tabIndex={13} onClick={()=>changePageNumber(Math.max(1, pageNumber - 1))}>
                        <FaArrowLeft/>
                    </button>
                    <button className="toolbar-button" title="Next Page" id="next" type="button" tabIndex={14}
                            onClick={()=>changePageNumber(pageNumber + 1)}>
                        <FaArrowRight/>
                    </button>
                    <input type="number" className="toolbar-field w-40px" title="Page"
                           value={pageNumber || 1}
                           onChange={(e) => changePageNumber(Number(e.target.value))}
                           tabIndex={15} autoComplete="off"/>

                    <span id="numPages" className="toolbarLabel"></span>
                </div>

                <div className="toolbar-container-middle">
                    <button id="zoomOut" className="toolbar-button" type="button" title="Zoom Out" tabIndex={21}
                        onClick={() => zoom(-1)}>
                        <FaMagnifyingGlassMinus/>
                    </button>
                    <div className="vertical-toolbar-separator"></div>
                    <button id="zoomIn" className="toolbar-button" type="button" title="Zoom In" tabIndex={22}
                            onClick={() => zoom(1)}
                            data-l10n-id="pdfjs-zoom-in-button">
                        <FaMagnifyingGlassPlus />
                    </button>
                </div>

                <div className="toolbar-container-rigth">
                    <div className="editor-buttons">
                        <button id="editorHighlight" className="toolbar-button" type="button" disabled={!context?.pdfDocument}
                                title="Highlight" role="radio" tabIndex={31} onClick={() => toggleMenu(AnnotationEditorType.HIGHLIGHT)}>
                            <FaHighlighter/>
                        </button>
                        <ToolbarDropdown isActive={highlight}>
                            <div className="flex-row content-40-60">
                                <span>Color:</span>
                                <input type="color"/>
                            </div>
                            <div className="flex-row content-40-60">
                                <span>Thickness:</span>
                                <input type="range" min="8" max="24"/>
                            </div>
                        </ToolbarDropdown>


                        <button id="editorFreeText" className="toolbar-button" type="button" disabled={!context?.pdfDocument}
                                title="Text" role="radio" aria-controls="editorFreeTextParamsToolbar"
                                tabIndex={32} onClick={() => toggleMenu(AnnotationEditorType.FREETEXT)}>
                            <FaA/>
                        </button>
                        <ToolbarDropdown isActive={text}>
                            <div className="flex-row content-40-60">
                                <span>Color:</span>
                                <input type="color"/>
                            </div>
                            <div className="flex-row content-40-60">
                                <span>Size:</span>
                                <input type="range" min="8" max="24"/>
                            </div>
                        </ToolbarDropdown>

                        <button id="editorInk" className="toolbar-button" type="button" disabled={!context?.pdfDocument} title="Draw"
                                role="radio" tabIndex={33} onClick={() => toggleMenu(AnnotationEditorType.INK)}>
                            <FaPencil/>
                        </button>
                        <ToolbarDropdown isActive={draw}>
                            <div className="flex-row content-40-60">
                                <span>Color:</span>
                                <input type="color"/>
                            </div>
                            <div className="flex-row content-40-60">
                                <span>Thickness:</span>
                                <input type="range" min="1" max="20"/>
                            </div>
                            <div className="flex-row content-40-60">
                                <span>Opacity:</span>
                                <input type="range" min="1" max="100"/>
                            </div>
                        </ToolbarDropdown>

                        <button id="editorStamp" className="toolbar-button" type="button" disabled={!context?.pdfDocument}
                                title="Add or edit images" role="radio"
                                tabIndex={34} onClick={() => toggleMenu(AnnotationEditorType.STAMP)}>
                            <FaFileImage/>
                        </button>
                        <ToolbarDropdown isActive={image}>
                            <div className="flex-row content-40-60">
                            </div>
                            <div className="flex-row">
                                <button className="image-button">
                                    <FaCirclePlus />
                                    Add Image</button>
                            </div>
                        </ToolbarDropdown>
                    </div>

                    <div className="vertical-toolbar-separator"></div>

                    <button id="print" className="toolbar-button" type="button" title="Print"
                            tabIndex={41} onClick={() => context?.emit('print', null)}>
                        <FaPrint/>
                    </button>

                    <button id="open" className="toolbar-button" type="button" title="Open"
                            tabIndex={42} onClick={()=>openPDFFile()}>
                        <FaFolderOpen />
                    </button>

                    <button id="download" className="toolbar-button" type="button" title="Save"
                            tabIndex={42} onClick={()=> context?.emit('download', null)}>
                        <FaFloppyDisk/>
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Toolbar;
