import { KeyboardCode, PREVENT_DEFAULT_REQ_KEYS } from '@app/enums/keyboard-code.enum';

const CTRL_KEY_PREFIX = 'ctrl+';
const SHIFT_KEY_PREFIX = 'shift+';
export class KeyboardEventHandler {
    static handleEvent(event: KeyboardEvent): string {
        let eventAsString = '';
        if (event.ctrlKey) eventAsString += CTRL_KEY_PREFIX;
        if (event.shiftKey) eventAsString += SHIFT_KEY_PREFIX;
        eventAsString += event.code;
        if (KeyboardEventHandler.requiresPreventDefault(eventAsString)) event.preventDefault();
        return eventAsString;
    }

    private static requiresPreventDefault(eventAsString: string): boolean {
        return PREVENT_DEFAULT_REQ_KEYS.includes(eventAsString as KeyboardCode);
    }

    static shiftKey(event: string): boolean {
        return event.includes(SHIFT_KEY_PREFIX);
    }
}
