import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Worship } from './worship';

describe('Worship', () => {
  let component: Worship;
  let fixture: ComponentFixture<Worship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Worship]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Worship);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
