import { KeyboardCode } from '@app/enums/keyboard-code.enum';

export const BASIC_KEYBOARD_EVENT = ({
    code: '',
    ctrlKey: false,
    shiftKey: false,
    // preventDefault is empty in the keyboardEvent to simplify testing
    // tslint:disable-next-line:no-empty
    preventDefault: () => {},
    target: undefined,
} as unknown) as KeyboardEvent;
export class KeyboardEventTestHelper {
    static getKeyboardEvent(expectedCode: KeyboardCode, shiftKeyValue: boolean = false, ctrlKeyValue: boolean = false): KeyboardEvent {
        // tslint:disable-next-line:no-empty preventDefault is empty in the keyboardEvent to simplify testing
        return { code: expectedCode, ctrlKey: ctrlKeyValue, shiftKey: shiftKeyValue, preventDefault: () => {} } as KeyboardEvent;
    }
}
