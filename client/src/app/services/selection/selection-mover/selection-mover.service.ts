import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/utils/vec2';
import { ARROW_MOVE_OFFSET, MOVE_INTERVAL, MOVE_START_TIMEOUT } from '@app/constants/selection.constants';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { SelectionService } from '@app/services/selection/selection.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionMoverService {
    private readonly pressedKeys: Set<KeyboardCode>;
    private arrowAction: Map<KeyboardCode, Vec2>;
    private movingIntervalRef: number;
    private movingTimeoutRef: number;

    constructor(private selectionService: SelectionService) {
        this.arrowAction = new Map<KeyboardCode, Vec2>();
        this.pressedKeys = new Set<KeyboardCode>();
        this.setKeyboardActions();
    }

    moveBox(offset: Vec2): void {
        this.selectionService.box.left += offset.x;
        this.selectionService.box.top += offset.y;
        this.selectionService.updateControlPoints();
    }

    private setKeyboardActions(): void {
        this.arrowAction.set(KeyboardCode.ArrowRight, new Vec2(ARROW_MOVE_OFFSET, 0));
        this.arrowAction.set(KeyboardCode.ArrowLeft, new Vec2(-ARROW_MOVE_OFFSET, 0));
        this.arrowAction.set(KeyboardCode.ArrowUp, new Vec2(0, -ARROW_MOVE_OFFSET));
        this.arrowAction.set(KeyboardCode.ArrowDown, new Vec2(0, ARROW_MOVE_OFFSET));
    }

    private computeOffset(): Vec2 {
        const offset = new Vec2(0, 0);
        for (const pressedKey of this.pressedKeys) {
            const arrowOffset = this.arrowAction.get(pressedKey) || new Vec2(0, 0);
            offset.x += arrowOffset.x;
            offset.y += arrowOffset.y;
        }
        return offset;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.arrowAction.has(event.code as KeyboardCode)) return;
        if (this.pressedKeys.size === 0) this.setMovingInterval();
        this.pressedKeys.add(event.code as KeyboardCode);
    }

    onKeyRelease(event: KeyboardEvent): void {
        if (!this.arrowAction.has(event.code as KeyboardCode)) return;
        this.pressedKeys.delete(event.code as KeyboardCode);
        this.setMovingInterval();
    }

    private setMovingInterval(): void {
        this.stopMovement();
        if (this.pressedKeys.size === 0) return;
        this.movingTimeoutRef = window.setTimeout(() => {
            this.movingIntervalRef = window.setInterval(() => {
                const offset = this.computeOffset();
                this.moveBox(offset);
            }, MOVE_INTERVAL);
        }, MOVE_START_TIMEOUT);
    }

    onSelectionEnd(): void {
        this.stopMovement();
    }

    private stopMovement(): void {
        window.clearInterval(this.movingIntervalRef);
        window.clearTimeout(this.movingTimeoutRef);
    }
}
