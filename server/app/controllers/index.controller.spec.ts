import { Application } from '@app/app';
import { TYPES } from '@app/types';
// import { Message } from '@common/communication/message';
import { expect } from 'chai';
import 'reflect-metadata';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { DatabaseService } from '../services/database.service';
import { DrawingService } from '../services/drawing-service';

// tslint:disable:no-unused-expression
// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
// const HTTP_STATUS_CREATED = 201;

describe('IndexController', () => {
    let drawingService: Stubbed<DrawingService>;
    let databaseService: Stubbed<DatabaseService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DrawingService).toConstantValue({
            getDrawingContent: sandbox.stub().resolves([]),
            createFile: sandbox.stub(),
            deleteDrawing: sandbox.stub(),
            validateDrawing: sandbox.stub().returns(true),
        });
        container.rebind(TYPES.DatabaseService).toConstantValue({
            getAllDrawings: sandbox.stub().resolves([]),
            sendDataToDb: sandbox.stub().resolves([]),
            deleteDrawing: sandbox.stub().resolves([]),
        });
        drawingService = container.get(TYPES.DrawingService);
        databaseService = container.get(TYPES.DatabaseService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return drawings from drawingService on valid get request to about route', async () => {
        drawingService.getDrawingContent.returns([]);
        databaseService.getAllDrawings.returns([]);
        return supertest(app)
            .get('/api/index/get-drawings')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal([]);
            });
    });

    it('should throw error from drawingService', async () => {
        drawingService.getDrawingContent.yields(new Error());
        databaseService.getAllDrawings.returns([]);
        return (
            supertest(app)
                .get('/api/index/get-drawings')
                // tslint:disable-next-line: no-magic-numbers
                .then((response: any) => {
                    // tslint:disable-next-line: no-unused-expression
                    expect(response.body.error).not.to.be.undefined;
                })
        );
    });
    it('should return error if the request isnt supported by the server', async () => {
        drawingService.getDrawingContent.returns([]);
        databaseService.getAllDrawings.returns([]);
        return supertest(app)
            .get('/api/index/')
            .then((response: any) => {
                expect(response.body.error).not.to.be.undefined;
            });
    });

    it('send-drawing should send the correct data to dataBase ', async () => {
        drawingService.validateDrawing.returns([]);
        databaseService.sendDataToDb.returns('id');
        return supertest(app)
            .post('/api/index/send-drawing')
            .then((response: any) => {
                expect(response.body).to.deep.equal({id: 'id'});
            });
    });
    it('send-drawing ', async () => {
        drawingService.validateDrawing.returns([]);
        databaseService.sendDataToDb.yields(new Error());
        return supertest(app)
            .post('/api/index/send-drawing')
            .then((response: any) => {
                expect(response.body.error).not.to.be.undefined;
            });
    });
    it('delete should send true if the request is successful', async () => {
        drawingService.validateDrawing.returns([]);
        databaseService.deleteDrawing.returns('id');
        return supertest(app)
            .delete('/api/index//delete-drawing/:id')
            .then((response: any) => {
                // tslint:disable-next-line:no-unused-expression
                expect(response.body).to.be.true;
            });
    });
});
