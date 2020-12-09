import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostcodesComponent } from './postcodes.component';

describe('PostcodesComponent', () => {
  let component: PostcodesComponent;
  let fixture: ComponentFixture<PostcodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostcodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
