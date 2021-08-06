import { KeyboardEventHandler } from './keyboard-event-handler';
// tslint:disable:no-any
// tslint:disable:no-empty
describe('KeyboardEventHandler', () => {
    let keyboardEvent: KeyboardEvent;
    it('should create an instance', () => {
        expect(new KeyboardEventHandler()).toBeTruthy();
    });

    it('handleEvent should not call preventDefault if event does not requires to prevent default', () => {
        keyboardEvent = {
            shiftKey: true,
            ctrlKey: true,
            code: 'ArrowDown',
            preventDefault: () => {},
        } as KeyboardEvent;
        const preventDefaultSpy = spyOn<any>(keyboardEvent, 'preventDefault');
        KeyboardEventHandler.handleEvent(keyboardEvent);
        expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('handleEvent should call preventDefault if event requires to prevent default', () => {
        keyboardEvent = {
            shiftKey: false,
            ctrlKey: false,
            code: 'ctrl+KeyA',
            preventDefault: () => {},
        } as KeyboardEvent;
        const preventDefaultSpy = spyOn<any>(keyboardEvent, 'preventDefault');
        KeyboardEventHandler.handleEvent(keyboardEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });
});
