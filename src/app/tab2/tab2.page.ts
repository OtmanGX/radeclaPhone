import {Component, OnInit, ViewChild} from '@angular/core';
import { Plugins } from '@capacitor/core';
import { DatePickerPluginInterface } from '@capacitor-community/date-picker';
import {Observable, Subject} from 'rxjs';
// Calendar
import {
    addHours,
    isAfter,
    endOfDay,
    startOfDay,
    addMinutes,
    subMinutes,
} from 'date-fns';
import {ReservationData} from '../models/reservation-data';
import {ReservationService} from '../services/reservation.service';
import {Terrain} from '../day-view-scheduler/day-view-scheduler.component';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, DAYS_OF_WEEK, } from 'angular-calendar';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../services/api.service';
import {AuthService} from '../services/auth.service';
import {DatePipe} from '@angular/common';
import {TERRAINS} from '../utils';
import {IonDatetime} from '@ionic/angular';


const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
const selectedTheme = 'light';


const TITLE = 'Agenda';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
    providers: [DatePipe]
})
export class Tab2Page implements OnInit{
    locale = 'fr';
    terrains = TERRAINS;
    refresh: Subject<any> = new Subject();
  title = TITLE;
  today = new Date();
  viewDate: Date = new Date();
    customPickerOptions;
  private params: { end_date: string; start_date: string };
  events$: Observable<ReservationData[]>;
  events: CalendarEvent[] = [];
  @ViewChild('picker') picker: IonDatetime;

  constructor(private service: ReservationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              public datepipe: DatePipe) {
      if (this.activatedRoute.snapshot.paramMap.has('add')) {
          this.fetchData(new Date());
      }
      this.customPickerOptions = {
          buttons: [{
              text: 'Aujourd\'hui',
              handler: () => {
                  this.picker.value = (new Date()).toDateString();
              }
          },{
              text: 'Confirmer',
              handler: (res) => {
                  console.log('save');
                  console.log(res);
                  this.picker.value = (new Date(res.year.value, res.month.value - 1, res.day.value)).toDateString();
              }
          }, {
              text: 'Annuler',
              role: 'cancel'
          }, ]
      };
  }

  ngOnInit(): void {
      this.fetchData(new Date());
  }


fetchData(date: Date) {
    console.log('fetchData called');
    this.viewDate = date;
    this.params = {start_date: addHours(startOfDay(this.viewDate), 8).toISOString(), end_date: endOfDay(this.viewDate).toISOString()};
    this.events$ = this.service.getall(this.params)
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

fetchData2(date: { value: string }) {
    const dates = date.value.split('/').map(x => parseInt(x, 10));
    this.viewDate = new Date(dates[2], dates[1] - 1, dates[0]);
    // this.fetchData(this.viewDate);
}

  openDatePicker() {
      DatePicker
          .present({
              mode: 'date',
              locale: 'fr_FR',
              format: 'dd/MM/yyyy',
              date: this.datepipe.transform(this.viewDate, 'dd/MM/yyyy'),
              // date: '28/09/2020',
              theme: 'selectedTheme',
          })
          .then((date) => this.fetchData2(date)).finally(() => this.fetchData(this.viewDate));
  }


    userChanged({ event, newUser }) {
        // event.color = newUser.color;
        event.meta.terrain = newUser;
        this.events = [...this.events];
    }

    hourSegmentClicked(event) {
      const date = event.date;
      const startDate = date;
      const terrain = this.terrains[event.col].id + 1;
      const endDate = addHours(date, 1);
      if (isAfter(date, subMinutes(new Date(), 30))) {
            this.router.navigate(['newr', {startDate, endDate, terrain}]);
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }

    dateChange(value: any) {
      this.fetchData(new Date(value));
    }
}
