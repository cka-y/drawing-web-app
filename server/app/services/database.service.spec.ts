import { fail } from 'assert';
import { expect } from 'chai';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Drawing } from '../../../common/communication/drawing';
import { testingContainer } from '../../test/test-utils';
import { TYPES } from '../types';
import { DatabaseService } from './database.service';

// tslint:disable:no-empty
// tslint:disable:no-string-literal
// tslint:disable: no-unused-expression
// tslint:disable: no-magic-numbers

describe('DatabaseService', () => {
    let service: DatabaseService = new DatabaseService();
    let mongoServer: MongoMemoryServer;
    let sandbox: sinon.SinonSandbox;

    beforeEach(async () => {
        const [container] = await testingContainer();
        service = container.get<DatabaseService>(TYPES.DatabaseService);
        service = new DatabaseService();
        mongoServer = new MongoMemoryServer();
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterEach(async () => {
        if (service['client'] && service['client'].isConnected()) {
            await service['client'].close();
        }
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        // Try to reconnect to local server
        try {
            await service.start('WRONG URL');
            fail();
        } catch {
            expect(service['client']).to.be.undefined;
        }
    });

    it('should connect to the database when start is called', async () => {
        // Reconnect to local server
        const mongoUri = await mongoServer.getUri();
        await service.start(mongoUri);
        expect(service['client']).not.to.be.undefined;
        expect(service['db'].databaseName).to.equal('DrawingApp');
    });
    it('should connect to the database when URL is undefined', async () => {
        try {
            await service.start();
            expect(service['client']).not.to.be.undefined;
        } catch {
            fail();
        }
    });

    it('should return an appropriate error for delete', async () => {
        try {
            await service.deleteDrawing('23');
            fail('Method should have thrown');
        } catch (error) {
            expect(error).not.to.be.undefined;
        }
    });

    it('should populate the database with a helper function', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const drawing: Drawing = { name: 'valid name', tags: ['valid'] } as Drawing;

        service['db'] = client.db('database');
        await service.sendDataToDb(drawing);
        const courses = await service['db'].collection('drawings').find({}).toArray();
        expect(courses.length).to.equal(1);
    });

    it('should get all drawings returns correct value', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const drawing: Drawing = { name: 'valid name', tags: ['valid'] } as Drawing;

        service['db'] = client.db('database');
        await service.sendDataToDb(drawing);
        const drawings = await service.getAllDrawings();
        expect(drawings.length).to.equal(1);
    });
    it('should get all drawings throws error if database unreachable', async () => {
        let drawings;
        try {
            drawings = await service.getAllDrawings();
        } catch (e) {
            // pass
        }
        expect(drawings).to.be.undefined;
    });
});
