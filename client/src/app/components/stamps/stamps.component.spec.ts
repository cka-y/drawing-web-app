import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { StampService } from '@app/services/tools/stamp-service/stamp.service';
import { StampsComponent } from './stamps.component';

// tslint:disable:no-any no-empty no-magic-numbers no-literal-string
describe('StampsComponent', () => {
    let component: StampsComponent;
    let fixture: ComponentFixture<StampsComponent>;
    let stampServiceStub: StampService;

    beforeEach(async(() => {
        stampServiceStub = {
            selectStamp: (_: any) => {},
        } as StampService;
        TestBed.configureTestingModule({
            declarations: [StampsComponent],
            imports: [FormsModule, MatIconModule, MatSliderModule],
            providers: [{ provide: StampService, useValue: stampServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('rotationAngle should return a positive number representing the rotation angle', () => {
        component.stampService.rotationAngle = -20;
        const rotationAngle = component.rotationAngle;
        expect(rotationAngle).toEqual(20);
    });

    it('selectStamp should call stampService.selectStamp', () => {
        const selectStampSpy = spyOn<any>(component.stampService, 'selectStamp');
        component.selectStamp('👌');
        expect(selectStampSpy).toHaveBeenCalled();
    });
});
