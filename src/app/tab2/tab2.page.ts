import {Component, OnInit} from '@angular/core';
import { Plugins } from '@capacitor/core';
import { DatePickerPluginInterface } from '@capacitor-community/date-picker';
import {Observable, Subject} from 'rxjs';
// Calendar
import {
    addHours,
    isAfter,
    endOfDay,
    endOfMonth,
    isSameDay,
    isSameMonth,
    startOfDay,
    startOfMonth,
    addMinutes,
    subMinutes,
    endOfHour
} from 'date-fns';
import {ReservationData} from '../models/reservation-data';
import {ReservationService} from '../services/reservation.service';
import {Terrain} from '../day-view-scheduler/day-view-scheduler.component';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, DAYS_OF_WEEK, } from 'angular-calendar';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../services/api.service';
import {AuthService} from '../services/auth.service';


const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
const selectedTheme = 'light';


const TITLE = 'Agenda';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
    },
};

const TERRAINS: Terrain[] = [
    {
        id: 0,
        name: 'Terrain 1',
        color: colors.blue,
    },
    {
        id: 1,
        name: 'Terrain 2',
        color: colors.blue,
    },
    {
        id: 2,
        name: 'Terrain 3',
        color: colors.blue,
    },
    {
        id: 3,
        name: 'Terrain 4',
        color: colors.blue,
    },
    {
        id: 4,
        name: 'Terrain 5',
        color: colors.blue,
    },
    {
        id: 5,
        name: 'Terrain 6',
        color: colors.blue,
    },
    {
        id: 6,
        name: 'Terrain 7',
        color: colors.blue,
    },
    // ,{
    //   id: 7,
    //   name: 'Terrain 8',
    //   color: colors.blue,
    // },
    {
        id: 8,
        name: 'Terrain 9',
        color: colors.blue,
    },
    {
        id: 9,
        name: 'Terrain 10',
        color: colors.blue,
    },
];

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
    locale = 'fr';
    terrains = TERRAINS;
    // refresh: Subject<any> = new Subject();
  title = TITLE;
  viewDate: Date = new Date();
  private params: { end_date: string; start_date: string };
  events$: Observable<ReservationData[]>;
  events: CalendarEvent[] = [];

  constructor(private service: ReservationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {
      if (this.activatedRoute.snapshot.paramMap.has('add')) {
          console.log('yeah');
          this.fetchData();
      }
  }

  ngOnInit(): void {
      this.fetchData();
  }


fetchData() {
    console.log('fetchData called');
    this.viewDate = new Date();
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
    // this.events$.subscribe(value => this.events = value);
}

  openDatePicker() {
      DatePicker
          .present({
              mode: 'date',
              locale: 'fr_FR',
              format: 'dd/MM/yyyy',
              date: this.viewDate.toDateString(),
              theme: selectedTheme,
          })
          .then((date) => alert(date.value));
  }


    userChanged({ event, newUser }) {
        // event.color = newUser.color;
        event.meta.terrain = newUser;
        this.events = [...this.events];
    }

    hourSegmentClicked(event) {
      console.log(event);
      const date = event.date;
      const startDate = date;
      const terrain = this.terrains[event.col].id + 1;
      console.log(terrain);
      const endDate = addHours(date, 1);
      if (isAfter(date, subMinutes(new Date(), 30))) {
            this.router.navigate(['newr', {startDate, endDate, terrain}]);
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }
}
