import {Component, OnInit} from '@angular/core';
import {ReservationService} from '../services/reservation.service';
import {AuthService} from '../services/auth.service';
import {ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {addHours, addMinutes, endOfDay, isAfter, startOfDay, subMinutes} from 'date-fns';
import {map} from 'rxjs/operators';
import {ReservationData} from '../models/reservation-data';
import {Observable, Subject} from 'rxjs';
import {CalendarEvent} from 'angular-calendar';
import {TERRAINS} from '../utils';
import {User} from '../models/user';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers: [DatePipe]
})
export class Tab3Page implements OnInit {
  locale = 'fr';
  terrains = TERRAINS;
  refresh: Subject<any> = new Subject();
  title = 'Mes résérvations';
  today = new Date();
  viewDate: Date = new Date();
  user: User;
  private params: { end_date: string; start_date: string, created_by: number };
  events$: Observable<ReservationData[]>;
  events: CalendarEvent[] = [];
  constructor(
      private reservationService: ReservationService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private authService: AuthService,
      public datepipe: DatePipe,
      public toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.fetchData(new Date());
    });
  }

  fetchData(date: Date) {
    console.log('fetchData called');
    this.viewDate = date;
    console.log(date);
    this.params = {start_date: addHours(startOfDay(this.viewDate), 8).toISOString()
      , end_date: endOfDay(this.viewDate).toISOString()
      , created_by: this.user.id};
    this.events$ = this.reservationService.getall(this.params)
        .pipe(map(( results: any ) => {
              return results.map((reservation: ReservationData) => {
                return {
                  title: 'Réservé',
                  color: this.terrains[reservation.terrain.matricule - 1].color,
                  start: new Date(reservation.start_date),
                  end: addMinutes(new Date(reservation.start_date), reservation.duration * 60 - 1),
                  meta: {
                    terrain: this.terrains[reservation.terrain.matricule - 1],
                    reservation,
                  },
                  resizable: {
                    beforeStart: false,
                    afterEnd: false,
                  },
                  draggable: false,
                };
              });
            })
        );
    this.refresh.next();
    // this.events$.subscribe(value => this.events = value);
  }


  userChanged({ event, newUser }) {
    // event.color = newUser.color;
    event.meta.terrain = newUser;
    this.events = [...this.events];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  dateChange(value: any) {
    this.fetchData(new Date(value));
  }

  deleteReservation(id: number) {
    this.reservationService.delete(id)
        .subscribe((result) => {
          this.presentToast('Réservation supprimé avec succès');
          this.fetchData(this.viewDate);
        }, error => console.log(error));
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  editReservation(id: number) {
    this.router.navigate(['newr', {id}]);
  }

  handleEvent(event: CalendarEvent<any>) {
    this.editReservation(event.meta.reservation.id);
  }
}
