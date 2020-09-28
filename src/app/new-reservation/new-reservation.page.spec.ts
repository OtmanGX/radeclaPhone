import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewReservationPage } from './new-reservation.page';

describe('NewReservationPage', () => {
  let component: NewReservationPage;
  let fixture: ComponentFixture<NewReservationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReservationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
