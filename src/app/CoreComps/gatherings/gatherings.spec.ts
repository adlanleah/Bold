import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gatherings } from './gatherings';

describe('Gatherings', () => {
  let component: Gatherings;
  let fixture: ComponentFixture<Gatherings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gatherings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gatherings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
