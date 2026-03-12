import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Give } from './give';

describe('Give', () => {
  let component: Give;
  let fixture: ComponentFixture<Give>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Give]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Give);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
