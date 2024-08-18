import {EventBus} from "pdfjs-dist/types/web/event_utils";
import { AnnotationEditorParamsType } from "pdfjs-dist";

/* Copyright 2022 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @typedef {import("./event_utils.js").EventBus} EventBus */


interface AnnotationEditorParamsOptions {
    editorFreeTextFontSize: HTMLInputElement,
    editorFreeTextColor: HTMLInputElement,
    editorInkColor: HTMLInputElement,
    editorInkThickness: HTMLInputElement,
    editorInkOpacity: HTMLInputElement,
    editorStampAddImage: HTMLButtonElement,
    editorFreeHighlightThickness: HTMLInputElement,
    editorHighlightShowAll: HTMLButtonElement,
}

type AnnotationEditorParamKey = 'RESIZE'|'CREATE'|'FREETEXT_SIZE'|'FREETEXT_COLOR'|'FREETEXT_OPACITY'|'INK_COLOR'|
    'INK_THICKNESS'|'INK_OPACITY'|'HIGHLIGHT_COLOR'|'HIGHLIGHT_THICKNESS'|'HIGHLIGHT_DEFAULT_COLOR'|'HIGHLIGHT_FREE'|
    'HIGHLIGHT_SHOW_ALL';



class AnnotationEditorParams {
    private eventBus: EventBus;
    /**
     * @param {AnnotationEditorParamsOptions} options
     * @param {EventBus} eventBus
     */
    constructor(options: AnnotationEditorParamsOptions, eventBus: EventBus) {
        this.eventBus = eventBus;
        this.#bindListeners(options);
    }

    /**
     * @param {AnnotationEditorParamsOptions} options
     */
    #bindListeners({
                       editorFreeTextFontSize,
                       editorFreeTextColor,
                       editorInkColor,
                       editorInkThickness,
                       editorInkOpacity,
                       editorStampAddImage,
                       editorFreeHighlightThickness,
                       editorHighlightShowAll,
                   }: AnnotationEditorParamsOptions) {
        const dispatchEvent = (typeStr: AnnotationEditorParamKey, value?: unknown) => {
            this.eventBus.dispatch("switchannotationeditorparams", {
                source: this,
                type: AnnotationEditorParamsType[typeStr],
                value,
            });
        };
        editorFreeTextFontSize.addEventListener("input", function () {
            dispatchEvent("FREETEXT_SIZE", this.valueAsNumber);
        });
        editorFreeTextColor.addEventListener("input", function () {
            dispatchEvent("FREETEXT_COLOR", this.value);
        });
        editorInkColor.addEventListener("input", function () {
            dispatchEvent("INK_COLOR", this.value);
        });
        editorInkThickness.addEventListener("input", function () {
            dispatchEvent("INK_THICKNESS", this.valueAsNumber);
        });
        editorInkOpacity.addEventListener("input", function () {
            dispatchEvent("INK_OPACITY", this.valueAsNumber);
        });
        editorStampAddImage.addEventListener("click", () => {
            this.eventBus.dispatch("reporttelemetry", {
                source: this,
                details: {
                    type: "editing",
                    data: { action: "pdfjs.image.add_image_click" },
                },
            });
            dispatchEvent("CREATE");
        });
        editorFreeHighlightThickness.addEventListener("input", function () {
            dispatchEvent("HIGHLIGHT_THICKNESS", this.valueAsNumber);
        });
        editorHighlightShowAll.addEventListener("click", function () {
            const checked = this.getAttribute("aria-pressed") === "true";
            // @ts-ignore
            this.setAttribute("aria-pressed", !checked);
            dispatchEvent("HIGHLIGHT_SHOW_ALL", !checked);
        });

        // @ts-ignore
        this.eventBus._on("annotationeditorparamschanged", evt => {
            for (const [type, value] of evt.details) {
                switch (type) {
                    case AnnotationEditorParamsType.FREETEXT_SIZE:
                        editorFreeTextFontSize.value = value;
                        break;
                    case AnnotationEditorParamsType.FREETEXT_COLOR:
                        editorFreeTextColor.value = value;
                        break;
                    case AnnotationEditorParamsType.INK_COLOR:
                        editorInkColor.value = value;
                        break;
                    case AnnotationEditorParamsType.INK_THICKNESS:
                        editorInkThickness.value = value;
                        break;
                    case AnnotationEditorParamsType.INK_OPACITY:
                        editorInkOpacity.value = value;
                        break;
                    case AnnotationEditorParamsType.HIGHLIGHT_THICKNESS:
                        editorFreeHighlightThickness.value = value;
                        break;
                    case AnnotationEditorParamsType.HIGHLIGHT_FREE:
                        editorFreeHighlightThickness.disabled = !value;
                        break;
                    case AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL:
                        editorHighlightShowAll.setAttribute("aria-pressed", value);
                        break;
                }
            }
        });
    }
}

export { AnnotationEditorParams };
