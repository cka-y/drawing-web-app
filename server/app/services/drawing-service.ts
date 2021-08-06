import { Drawing } from '@common/communication/drawing';
import {
    DRAWING_NAME_VALIDATOR,
    ENCODING_VALIDATOR,
    MAX_ALLOWED_STRING_LENGTH,
    MIN_ALLOWED_STRING_LENGTH,
} from '@common/constants/drawing-properties.constants';
import {
    DELETE_DRAWING_REQ_EROOR,
    INVALID_CONTENT_ERROR,
    INVALID_DRAWING_ERROR,
    INVALID_NAME_ERROR,
    INVALID_TAGS_ERROR,
    SAVE_DRAWING_REQ_ERROR,
} from '@common/constants/server-message-error.constants';
import * as fs from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';

const DRAWINGS_FOLDER = './drawings/';
const ENCODING_TYPE = '.base64';
@injectable()
export class DrawingService {
    clientDrawings: Drawing[];

    private static validateDrawingName(name: string): void {
        if (name && name.length < MAX_ALLOWED_STRING_LENGTH && name.length > MIN_ALLOWED_STRING_LENGTH) return;
        throw new Error(INVALID_NAME_ERROR);
    }

    private static validateDrawingContent(content: string): void {
        // validates that content is defined and encoding is base64
        if (content && ENCODING_VALIDATOR.test(content)) return;
        throw new Error(INVALID_CONTENT_ERROR);
    }

    private static validateDrawingTags(tags: string[]): void {
        // validates that each tag does not contain whitespace character and the maximal and minimal string length are respected
        if (
            tags &&
            tags.every((value) => {
                return !DRAWING_NAME_VALIDATOR.test(value) && value.length > MIN_ALLOWED_STRING_LENGTH && value.length <= MAX_ALLOWED_STRING_LENGTH;
            })
        )
            return;
        throw new Error(INVALID_TAGS_ERROR);
    }
    async getDrawingContent(drawings: Drawing[]): Promise<Drawing[]> {
        this.clientDrawings = [];
        const promiseArray: void[] = drawings.map((drawing) => {
            try {
                const data = fs.readFileSync(DRAWINGS_FOLDER + drawing._id + ENCODING_TYPE);
                drawing.content = data.toString();
                this.clientDrawings.push(drawing);
            } catch (e) {
                // the drawing is not being pushed to the clientDrawings array
            }
        });
        return new Promise<Drawing[]>(async (resolve, _) => {
            await Promise.all(promiseArray);
            resolve(this.clientDrawings);
        });
    }
    createFile(drawing: Drawing): void {
        fs.writeFile(DRAWINGS_FOLDER + drawing._id + ENCODING_TYPE, drawing.content, (err) => {
            if (err) throw new Error(SAVE_DRAWING_REQ_ERROR);
        });
    }

    deleteDrawing(drawingId: string): void {
        const path: string = DRAWINGS_FOLDER + drawingId + ENCODING_TYPE;
        if (!fs.existsSync(path)) throw new Error(INVALID_DRAWING_ERROR);
        fs.unlink(path, (err) => {
            if (err) throw new Error(DELETE_DRAWING_REQ_EROOR);
        });
    }

    validateDrawing(drawing: Drawing): void {
        DrawingService.validateDrawingName(drawing.name);
        DrawingService.validateDrawingTags(drawing.tags);
        DrawingService.validateDrawingContent(drawing.content);
    }
}
