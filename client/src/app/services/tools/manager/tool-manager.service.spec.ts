import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ColorProperty } from '@app/classes/interface/color-property';
import { ToolStub } from '@app/components/drawing/drawing.component.spec';
import { ColorLevel } from '@app/enums/color-level.enum';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line-service/line.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil-service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

// tslint:disable:no-empty
// tslint:disable:max-classes-per-file
// tslint:disable:no-any
class PencilServiceStub extends PencilService {
    init(): void {}
    onKeyDown(): void {}
    onKeyRelease(): void {}
}

class LineServiceStub extends LineService {
    init(): void {}
}

class ColorServiceStub extends ColorService {
    updateColors(): void {}
}

describe('ToolManagerService', () => {
    let service: ToolManagerService;

    let mouseEventRight: MouseEvent;
    let mouseEventLeft: MouseEvent;

    let pencilServiceStub: PencilServiceStub;
    let lineServiceStub: LineServiceStub;
    let colorServiceStub: ColorServiceStub;

    let setCurrentToolSpy: jasmine.Spy<any>;

    beforeEach(() => {
        pencilServiceStub = new PencilServiceStub({} as DrawingService, {} as ActionManagerService);
        lineServiceStub = new LineServiceStub({} as DrawingService, {} as ActionManagerService);
        colorServiceStub = new ColorServiceStub({} as DrawingService);

        TestBed.configureTestingModule({
            providers: [
                { provide: PencilService, useValue: pencilServiceStub },
                { provide: LineService, useValue: lineServiceStub },
                { provide: ColorService, useValue: colorServiceStub },
            ],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(ToolManagerService);

        setCurrentToolSpy = spyOn<any>(service, 'setCurrentTool').and.callThrough();
        mouseEventLeft = {
            button: MouseButton.Left,
        } as MouseEvent;

        mouseEventRight = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onClick should call #setCurrentTool when a mouse event (left button) happens', () => {
        service.onClick(mouseEventLeft, lineServiceStub);
        expect(setCurrentToolSpy).toHaveBeenCalledWith(lineServiceStub);
    });

    it('#onClick should not call #setCurrentTool when a mouse event (right button) happens', () => {
        service.onClick(mouseEventRight, lineServiceStub);
        expect(setCurrentToolSpy).not.toHaveBeenCalled();
    });

    it('#onKeyDown should define the currentTool property to Line when the shortcut for line is pressed', () => {
        service.onKeyDown(KeyboardCode.LineToolSelector);
        expect(setCurrentToolSpy).toHaveBeenCalledWith(lineServiceStub);
    });

    it('#onKeyDown should not define the currentTool property when the event string is not in the toolMap', () => {
        service.onKeyDown('blabla');
        expect(setCurrentToolSpy).not.toHaveBeenCalledWith(lineServiceStub);
    });

    it(' #onKeyRelease should propagate the event to the current tool ', () => {
        const onKeyReleaseCurrentToolSpy: jasmine.Spy<any> = spyOn<any>(service.currentTool, 'onKeyRelease').and.callThrough();
        service.onKeyRelease(KeyboardCode.LineToolSelector);
        expect(onKeyReleaseCurrentToolSpy).toHaveBeenCalledWith(KeyboardCode.LineToolSelector);
    });
    it('setCurrentTool should set currentToolColorProperty properly if currentToolColorProperty is defined', () => {
        // tslint:disable: no-string-literal
        service['pencilService'] = pencilServiceStub;
        service.setCurrentTool(pencilServiceStub);
        const expectedColorProperty: ColorProperty = { fillColor: ColorLevel.SecondaryColor, strokeColor: ColorLevel.PrimaryColor };
        expect(service['colorService'].currentToolColorProperty).toEqual(expectedColorProperty);
    });
    it('setCurrentTool should not change currentToolColorProperty if the sat tool is unknow to the tool manager', () => {
        const toolStub = new ToolStub({} as DrawingService, {} as ActionManagerService);
        service.setCurrentTool(toolStub);
        const expectedColorProperty: ColorProperty = { fillColor: ColorLevel.SecondaryColor, strokeColor: ColorLevel.PrimaryColor };
        expect(service['colorService'].currentToolColorProperty).toEqual(expectedColorProperty);
    });
});
