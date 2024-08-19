import './Toolbar.less';

const Toolbar = () => {

    return (
        <div className="toolbar">
            <div id="svg-viewer-container" className="toolbar-container">
                <div className="toolbar-container-left">
                    <button id="viewFind" className="toolbarButton" type="button" title="Find in Document" tabIndex={12}>
                        Find
                    </button>
                    <div className="splitToolbarButton hiddenSmallView">
                        <button className="toolbarButton" title="Previous Page" id="previous" type="button"
                                tabIndex={13}>
                            Previous
                        </button>

                        <button className="toolbarButton" title="Next Page" id="next" type="button" tabIndex={14}>
                            Next
                        </button>
                    </div>
                    <span className="loadingInput start">
                        <input type="number" id="pageNumber" className="toolbarField" title="Page" defaultValue="1" min="1"
                         tabIndex={15} autoComplete="off"/>
                    </span>
                    <span id="numPages" className="toolbarLabel"></span>
                </div>

                <div className="toolbar-container-middle">
                    <button id="zoomOut" className="toolbarButton" type="button" title="Zoom Out" tabIndex={21}>
                        Zoom Out
                    </button>
                    <div className="vertical-toolbar-separator"></div>
                    <button id="zoomIn" className="toolbarButton" type="button" title="Zoom In" tabIndex={22}
                            data-l10n-id="pdfjs-zoom-in-button">
                        Zoom In
                    </button>
                </div>

                <div className="toolbar-container-rigth">
                    <div className="editor-buttons">
                        <button id="editorHighlight" className="toolbarButton" type="button" disabled={true}
                                title="Highlight" role="radio" tabIndex={31}>
                            Highlight
                        </button>
                        <button id="editorFreeText" className="toolbarButton" type="button" disabled={true}
                                title="Text" role="radio"
                                aria-controls="editorFreeTextParamsToolbar" tabIndex={32}>
                            Text
                        </button>
                        <button id="editorInk" className="toolbarButton" type="button" disabled={true} title="Draw"
                                role="radio" tabIndex={33}>
                            Draw
                        </button>
                        <button id="editorStamp" className="toolbarButton" type="button" disabled={true}
                                title="Add or edit images" role="radio"
                                tabIndex={34}>
                            Add or edit images
                        </button>

                    </div>

                    <div className="vertical-toolbar-separator"></div>

                    <button id="print" className="toolbarButton" type="button" title="Print"
                            tabIndex={41}>
                        Print
                    </button>

                    <button id="download" className="toolbarButton" type="button" title="Save"
                            tabIndex={42}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Toolbar;
