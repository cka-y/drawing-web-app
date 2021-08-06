import { Injectable } from '@angular/core';
import { ColorProperty } from '@app/classes/interface/color-property';
import { Tool } from '@app/classes/utils/tool';
import { ColorLevel } from '@app/enums/color-level.enum';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ColorService } from '@app/services/color/color.service';
import { PolygonalLassoSelectionService } from '@app/services/selection/selection-tools/polygonal-lasso/polygonal-lasso-selection.service';
import { RectangleSelectionService } from '@app/services/selection/selection-tools/rectangle/rectangle-selection.service';
import { BucketService } from '@app/services/tools/bucket-service/bucket.service';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse-service';
import { EraserService } from '@app/services/tools/eraser-service/eraser.service';
import { LineService } from '@app/services/tools/line-service/line.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { SprayPaintService } from '@app/services/tools/spray-paint-service/spray-paint.service';
import { StampService } from '@app/services/tools/stamp-service/stamp.service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    tools: Tool[];
    currentTool: Tool;
    private colorProperties: Map<Tool, ColorProperty>;
    private toolMap: Map<KeyboardCode, Tool>;
    constructor(
        private pencilService: PencilService,
        private rectangleService: RectangleService,
        private lineService: LineService,
        private eraserService: EraserService,
        private colorService: ColorService,
        private ellipseService: EllipseService,
        private sprayPaintService: SprayPaintService,
        private rectangleSelector: RectangleSelectionService,
        private polygonalLassoSelector: PolygonalLassoSelectionService,
        private stampService: StampService,
        private bucketService: BucketService,
    ) {
        this.tools = [
            this.pencilService,
            this.eraserService,
            this.lineService,
            this.rectangleService,
            this.ellipseService,
            this.sprayPaintService,
            this.stampService,
            this.bucketService,
            this.rectangleSelector,
            this.polygonalLassoSelector,
        ];
        this.currentTool = this.pencilService;
        this.colorProperties = new Map<Tool, ColorProperty>();
        this.toolMap = new Map<KeyboardCode, Tool>();
        this.setColorProperties();
        this.setToolMap();
    }
    private setColorProperties(): void {
        this.colorProperties.set(this.pencilService, { fillColor: ColorLevel.SecondaryColor, strokeColor: ColorLevel.PrimaryColor });
        this.colorProperties.set(this.rectangleService, { fillColor: ColorLevel.PrimaryColor, strokeColor: ColorLevel.SecondaryColor });
        this.colorProperties.set(this.lineService, { fillColor: ColorLevel.PrimaryColor, strokeColor: ColorLevel.PrimaryColor });
        this.colorProperties.set(this.ellipseService, { fillColor: ColorLevel.PrimaryColor, strokeColor: ColorLevel.SecondaryColor });
        this.colorProperties.set(this.sprayPaintService, { fillColor: ColorLevel.PrimaryColor, strokeColor: ColorLevel.SecondaryColor });
    }
    private setToolMap(): void {
        this.toolMap.set(KeyboardCode.PencilToolSelector, this.pencilService);
        this.toolMap.set(KeyboardCode.LineToolSelector, this.lineService);
        this.toolMap.set(KeyboardCode.RectangleToolSelector, this.rectangleService);
        this.toolMap.set(KeyboardCode.EraserToolSelector, this.eraserService);
        this.toolMap.set(KeyboardCode.EllipseToolSelector, this.ellipseService);
        this.toolMap.set(KeyboardCode.SprayPaintToolSelector, this.sprayPaintService);
        this.toolMap.set(KeyboardCode.RectangleSelectionSelector, this.rectangleSelector);
        this.toolMap.set(KeyboardCode.PolygonalLassoToolSelector, this.polygonalLassoSelector);
        this.toolMap.set(KeyboardCode.StampToolSelector, this.stampService);
        this.toolMap.set(KeyboardCode.BucketToolSelector, this.bucketService);
    }
    onClick(event: MouseEvent, tool: Tool): void {
        if (event.button !== MouseButton.Left) return;
        this.setCurrentTool(tool);
    }

    onKeyDown(event: string): void {
        const selectedTool: Tool | undefined = this.toolMap.get(event as KeyboardCode);
        if (selectedTool) this.setCurrentTool(selectedTool);
        else this.currentTool.onKeyDown(event);
    }

    onKeyRelease(event: string): void {
        this.currentTool.onKeyRelease(event);
    }

    setCurrentTool(tool: Tool): void {
        this.currentTool.reset();
        this.currentTool = tool;
        this.currentTool.init();
        const currentToolColorProperty: ColorProperty | undefined = this.colorProperties.get(this.currentTool);
        if (currentToolColorProperty) this.colorService.currentToolColorProperty = currentToolColorProperty;
        this.colorService.updateColors();
    }

    isToolBeingUsed(): boolean {
        return this.currentTool.taskInProgress;
    }
}
