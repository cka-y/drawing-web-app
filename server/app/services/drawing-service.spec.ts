import * as assert from 'assert';
import { expect } from 'chai';
import * as fs from 'fs';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Drawing } from '../../../common/communication/drawing';
import { testingContainer } from '../../test/test-utils';
import { TYPES } from '../types';
import { DrawingService } from './drawing-service';
// tslint:disable:no-empty
// tslint:disable:no-any
describe('DrawingService', () => {
    let service: DrawingService = new DrawingService();
    let sandbox: sinon.SinonSandbox;
    beforeEach(async () => {
        const [container] = await testingContainer();
        service = container.get<DrawingService>(TYPES.DrawingService);
        sandbox = sinon.createSandbox();
        sandbox.restore();
    });

    it('getDrawingContent should clear clientDrawings', () => {
        const expectedContent = 'drawingContent';
        sandbox.stub(fs, 'readFileSync').callsFake(() => {
            return {
                toString: () => {
                    return expectedContent;
                },
            } as Buffer;
        });
        const drawing = {
            name: 'drawing',
            tags: ['', ''],
            content: '',
            id: '',
        } as Drawing;
        service.getDrawingContent([drawing]);
        expect(service.clientDrawings[0].content).eq(expectedContent);
        sandbox.restore();
    });
    it('createFile should call writeFile', () => {
        const writeSpy = sandbox.stub(fs, 'writeFile').returns();
        const drawing = {
            name: 'drawing',
            tags: ['', ''],
            content: 'id',
            id: 'id',
        } as Drawing;
        service.createFile(drawing);
        sinon.assert.called(writeSpy);
        sandbox.restore();
    });

    it('createFile should throw an error', () => {
        sandbox.stub(fs, 'writeFile').yields(new Error('This is an error'));
        const createFileSpy = sandbox.spy(service, 'createFile');
        const drawing = {
            name: 'drawing',
            tags: ['', ''],
            content: 'id',
            id: 'id',
        } as Drawing;
        try {
            service.createFile(drawing);
        } catch (e) {
            // pass
        }
        assert(createFileSpy.threw());
        sandbox.restore();
    });

    it('deleteDrawing should throw an error if fs is empty', () => {
        sandbox.stub(fs, 'existsSync').yields(new Error('This is an error'));
        const deleteDrawingSpy = sandbox.spy(service, 'deleteDrawing');
        try {
            service.deleteDrawing('drawing');
        } catch (_) {
            // pass
        }
        assert(deleteDrawingSpy.threw());
        sandbox.restore();
    });

    it('deleteDrawing should call unlink', () => {
        const unlinkSpy = sandbox.stub(fs, 'unlink').callsFake((_, __: any = undefined) => {});
        try {
            sandbox.stub(fs, 'existsSync').returns(true);
            service.deleteDrawing('id');
        } catch (e) {
            // tslint:disable-next-line:no-unused-expression
            assert.fail();
        }
        assert(unlinkSpy.called === true);
        sandbox.restore();
    });

    it('deleteDrawing should throw an error if unlink fails', () => {
        sandbox.stub(fs, 'unlink').callsFake((_, callback: any = 'AnError') => {
            return callback(new Error('This is an error'));
        });
        const deleteDrawingSpy = sandbox.spy(service, 'deleteDrawing');
        try {
            service.deleteDrawing('' as string);
        } catch (_) {
            // pass
        }
        assert(deleteDrawingSpy.threw());
        sandbox.restore();
    });

    it('validateDrawing should throw an error if name is undefined', () => {
        const validateDrawingSpy = sandbox.spy(service, 'validateDrawing');
        try {
            service.validateDrawing({} as Drawing);
        } catch (e) {
            // pass
        }
        assert(validateDrawingSpy.threw());
        sandbox.restore();
    });
    it('validateDrawing should throw an error if name is too long', () => {
        const validateDrawingSpy = sandbox.spy(service, 'validateDrawing');
        try {
            service.validateDrawing({ name: 'thisIsALongLongLongName' } as Drawing);
        } catch (e) {
            // pass
        }
        assert(validateDrawingSpy.threw());
        sandbox.restore();
    });
    it('validateDrawing should throw an error if tags are undefined', () => {
        const validateDrawingSpy = sandbox.spy(service, 'validateDrawing');
        try {
            service.validateDrawing({ name: 'valid name' } as Drawing);
        } catch (e) {
            // pass
        }
        assert(validateDrawingSpy.threw());
        sandbox.restore();
    });
    it('validateDrawing should throw an error if tags contain spaces', () => {
        const validateDrawingSpy = sandbox.spy(service, 'validateDrawing');
        try {
            service.validateDrawing({ name: 'valid name', tags: ['invalid tag'] } as Drawing);
        } catch (e) {
            // pass
        }
        assert(validateDrawingSpy.threw());
        sandbox.restore();
    });
    it('validateDrawing should throw an error if tags are too long or too short', () => {
        const validateDrawingSpy = sandbox.spy(service, 'validateDrawing');
        try {
            service.validateDrawing({ name: 'valid name', tags: ['invalidBecauseLongLong'] } as Drawing);
        } catch (e) {
            // pass
        }
        assert(validateDrawingSpy.threw());
        try {
            service.validateDrawing({ name: 'valid name', tags: [''] } as Drawing);
        } catch (e) {
            // pass
        }
        assert(validateDrawingSpy.threw());
        sandbox.restore();
    });
    it('validateDrawing should throw an error if content is undefined', () => {
        const validateDrawingSpy = sandbox.spy(service, 'validateDrawing');
        const drawing: Drawing = { name: 'valid name', tags: ['valid'] } as Drawing;
        try {
            service.validateDrawing(drawing);
        } catch (e) {
            // pass
        }
        assert(validateDrawingSpy.threw());
        sandbox.restore();
    });
    it('validateDrawing should throw an error if content is not base64 encoded', () => {
        const validateDrawingSpy = sandbox.spy(service, 'validateDrawing');
        try {
            service.validateDrawing({ name: 'validName', tags: ['valid'], content: '?@%#%' } as Drawing);
        } catch (e) {
            // pass
        }
        assert(validateDrawingSpy.threw());
        sandbox.restore();
    });
    it('validateDrawing should not throw an error if drawing is valid', () => {
        try {
            service.validateDrawing({ name: 'validName', tags: ['valid'], content: 'valid' } as Drawing);
        } catch (_) {
            assert(false);
        }
        sandbox.restore();
    });
});
