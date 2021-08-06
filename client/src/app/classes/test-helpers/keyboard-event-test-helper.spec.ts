import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { BASIC_KEYBOARD_EVENT, KeyboardEventTestHelper } from './keyboard-event-test-helper';
describe('KeyboardEventTestHelper', () => {
    it('should create an instance', () => {
        expect(new KeyboardEventTestHelper()).toBeTruthy();
    });
    it('getKeyboardEvent should return a KeyboardEvent', () => {
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.ArrowDown);
        BASIC_KEYBOARD_EVENT.preventDefault();
        expect(keyboardEvent).toBeDefined();
    });
});
