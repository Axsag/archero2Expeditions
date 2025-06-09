import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersModalComponent } from './players-modal.component';

describe('PlayersModalComponent', () => {
  let component: PlayersModalComponent;
  let fixture: ComponentFixture<PlayersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
