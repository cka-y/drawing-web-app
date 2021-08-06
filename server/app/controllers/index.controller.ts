import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/communication/drawing';
import { DATABASE_UNAVAIBLE, UNDEFINED_ID_ERROR, UNSUPPORTED_REG_ERROR } from '@common/constants/server-message-error.constants';
import { DELETE_DRAWING_URL, GET_DRAWINGS_URL, SEND_DRAWING_URL } from '@common/constants/server-request-url.constants';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DrawingService } from '../services/drawing-service';

@injectable()
export class IndexController {
    router: Router;

    constructor(
        @inject(TYPES.DrawingService) private drawingService: DrawingService,
        @inject(TYPES.DatabaseService) private databaseService: DatabaseService,
    ) {
        this.configureRouter();
        try {
            (async () => {
                await this.databaseService.start();
            })();
        } catch (e) {
            console.log(DATABASE_UNAVAIBLE);
        }
    }

    private configureRouter(): void {
        this.router = Router();
        /**
         * @swagger
         *
         * definitions:
         *   Message:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       body:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Index
         *     description: Default cadriciel endpoint
         *   - name: Message
         *     description: Messages functions
         */

        /**
         * @swagger
         *
         * /api/index:
         *   get:
         *     description: Return error because request is unknown
         *     tags:
         *       - Index
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         *
         */
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            next(new Error(UNSUPPORTED_REG_ERROR));
        });
        /**
         * @swagger
         *
         * /api/index:
         *   get:
         *     description: Return all drawings
         *     tags:
         *       - Drawing
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Drawing'
         *
         */
        this.router.get(GET_DRAWINGS_URL, async (req: Request, res: Response, next: NextFunction) => {
            try {
                let drawings: Drawing[] = await this.databaseService.getAllDrawings();
                drawings = await this.drawingService.getDrawingContent(drawings);
                res.send(drawings);
            } catch (e) {
                next(e);
            }
        });

        /**
         * @swagger
         *
         * /api/index/send-drawing:
         *   post:
         *     description: Send a drawing
         *     tags:
         *       - Drawing
         *     requestBody:
         *         description: drawing object
         *         required: true
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/Drawing'
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Sent
         */
        this.router.post(SEND_DRAWING_URL, async (req: Request, res: Response, next: NextFunction) => {
            const drawing: Drawing = req.body;
            try {
                this.drawingService.validateDrawing(drawing);
                const drawingId: string | undefined = await this.databaseService.sendDataToDb(drawing);
                if (drawingId) {
                    res.send({ id: drawingId });
                }
                drawing._id = drawingId;
                this.drawingService.createFile(drawing);
            } catch (e) {
                next(e);
            }
        });

        /**
         * @swagger
         *
         * /api/index/delete-drawing:
         *   post:
         *     description: Delete a drawing
         *     tags:
         *       - Drawing
         *     requestBody:
         *         description: drawing id
         *         required: false
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/Drawing'
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Deleted
         */
        this.router.delete(DELETE_DRAWING_URL + ':id', async (req: Request, res: Response, next: NextFunction) => {
            const drawingId: string | undefined = req.params.id;
            if (drawingId) {
                try {
                    await this.databaseService.deleteDrawing(drawingId);
                    this.drawingService.deleteDrawing(drawingId);
                    res.send(true);
                } catch (e) {
                    next(e);
                }
            } else next(new Error(UNDEFINED_ID_ERROR));
        });
    }
}
