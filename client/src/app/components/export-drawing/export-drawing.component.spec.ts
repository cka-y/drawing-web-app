import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';
import { ExportDrawingComponent } from './export-drawing.component';

// tslint:disable:no-empty
// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;
    let canvasTestHelper: CanvasTestHelper;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent, MatIcon],
            providers: [
                { provide: DrawingService, useValue: {} },
                {
                    provide: ExportDrawingService,
                    useValue: {
                        canvas: {} as HTMLCanvasElement,
                        canvasCtx: {} as CanvasRenderingContext2D,
                        setUp: () => {},
                        reset: () => {},
                        isNameDefined: () => {
                            return true;
                        },
                    },
                },
            ],
            imports: [MatIconModule, MatRadioModule, MatFormFieldModule, FormsModule, MatTooltipModule, MatInputModule, BrowserAnimationsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        fixture.detectChanges();
    });

    it('should create', () => {
        component['baseCanvasCopy'] = { nativeElement: canvasTestHelper['canvas'] } as ElementRef<HTMLCanvasElement>;
        expect(component).toBeTruthy();
    });
    // it('ngAfterViewInit should call setUp', () => {
    //     const setUpSpy = spyOn<any>(component['exporter'], 'setUp').and.callThrough();
    //     component['baseCanvasCopy'] = { nativeElement: canvasTestHelper.canvas } as ElementRef<HTMLCanvasElement>;
    //     component.ngAfterViewInit();
    //     expect(setUpSpy).toHaveBeenCalled();
    // });
});
