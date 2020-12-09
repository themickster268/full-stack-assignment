import { ComponentFixture, TestBed } from '@angular/core/testing';

import { USOComponent } from './uso.component';

describe('USOComponent', () => {
  let component: USOComponent;
  let fixture: ComponentFixture<USOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ USOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(USOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
