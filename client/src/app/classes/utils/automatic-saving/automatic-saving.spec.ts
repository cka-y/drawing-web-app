import { AutomaticSaving } from './automatic-saving';

// tslint:disable:no-any
describe('AutomaticSaving', () => {
    it('should create an instance', () => {
        expect(new AutomaticSaving()).toBeTruthy();
    });
    it('clearDrawingStorage should call removeItem()', () => {
        const clearSpy = spyOn<any>(window.localStorage, 'removeItem');
        AutomaticSaving.clearDrawingStorage();
        expect(clearSpy).toHaveBeenCalledWith('drawing');
    });
});
