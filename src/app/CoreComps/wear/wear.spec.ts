import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wear } from './wear';

describe('Wear', () => {
  let component: Wear;
  let fixture: ComponentFixture<Wear>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wear]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Wear);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
