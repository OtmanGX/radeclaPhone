import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Injectable,
  Input,
  LOCALE_ID,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  CalendarDateFormatter,
  CalendarEventTimesChangedEvent,
  CalendarUtils,
  CalendarWeekViewComponent,
  DateAdapter,
  getWeekViewPeriod,
} from 'angular-calendar';
import {
  WeekView,
  GetWeekViewArgs,
  WeekViewTimeEvent,
  EventColor,
  CalendarEvent,
  WeekViewAllDayEventRow,
  WeekViewAllDayEvent,
} from 'calendar-utils';
import { DragEndEvent, DragMoveEvent } from 'angular-draggable-droppable';
import {CustomDateFormatter} from './custom-date-formatter.provider';

export interface Terrain {
  id: number;
  name: string;
  color: EventColor;
}

interface DayViewScheduler extends WeekView {
  terrains: Terrain[];
}

interface GetWeekViewArgsWithUsers extends GetWeekViewArgs {
  terrains: Terrain[];
}

@Injectable()
export class DayViewSchedulerCalendarUtils extends CalendarUtils {
  locale = 'fr';
  getWeekView(args: GetWeekViewArgsWithUsers): DayViewScheduler {
    const { period } = super.getWeekView(args);
    const view: DayViewScheduler = {
      period,
      allDayEventRows: [],
      hourColumns: [],
      terrains: [...args.terrains],
    };

    view.terrains.forEach((terrain, columnIndex) => {
      const events = args.events.filter(
        (event) => event.meta.terrain.id === terrain.id
      );
      const columnView = super.getWeekView({
        ...args,
        events,
      });
      view.hourColumns.push(columnView.hourColumns[0]);
    });

    return view;
  }
}
@Component({
  selector: 'app-day-view-scheduler',
  templateUrl: './day-view-scheduler.component.html',
  styleUrls: ['./day-view-scheduler.component.css'],
  providers: [DayViewSchedulerCalendarUtils, {
    provide: CalendarDateFormatter,
    useClass: CustomDateFormatter,
  }, ],
})
export class DayViewSchedulerComponent extends CalendarWeekViewComponent implements OnChanges {
  @Input() terrains: Terrain[] = [];
  @Input() extra = false;

  @Output() userChanged = new EventEmitter();

  view: DayViewScheduler;

  daysInWeek = 1;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected utils: DayViewSchedulerCalendarUtils,
    @Inject(LOCALE_ID) locale: string,
    protected dateAdapter: DateAdapter
  ) {
    super(cdr, utils, locale, dateAdapter);
    this.dayColumnWidth = 40;
  }

  trackByUserId = (index: number, row: Terrain) => row.id;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change');
    super.ngOnChanges(changes);

    if (changes.terrains) {
      this.refreshBody();
      this.emitBeforeViewRender();
    }
  }

  getDayColumnWidth(eventRowContainer: HTMLElement): number {
    return Math.floor(eventRowContainer.offsetWidth / this.terrains.length);
  }

  dragMove(dayEvent: WeekViewTimeEvent, dragEvent: DragMoveEvent) {
    if (this.snapDraggedEvents) {
      console.log('drag move');
      const newUser = this.getDraggedUserColumn(dayEvent, dragEvent.x);
      const newEventTimes = this.getDragMovedEventTimes(
        dayEvent,
        { ...dragEvent, x: 0 },
        this.dayColumnWidth,
        true
      );
      const originalEvent = dayEvent.event;
      const adjustedEvent = {
        ...originalEvent,
        ...newEventTimes,
        meta: { ...originalEvent.meta, terrain: newUser },
      };
      const tempEvents = this.events.map((event) => {
        if (event === originalEvent) {
          return adjustedEvent;
        }
        return event;
      });
      this.restoreOriginalEvents(
        tempEvents,
        new Map([[adjustedEvent, originalEvent]])
      );
    }
    this.dragAlreadyMoved = true;
  }

  dragEnded(
    weekEvent: WeekViewAllDayEvent | WeekViewTimeEvent,
    dragEndEvent: DragEndEvent,
    dayWidth: number,
    useY = false
  ) {
    super.dragEnded(
      weekEvent,
      {
        ...dragEndEvent,
        x: 0,
      },
      dayWidth,
      useY
    );
    const newUser = this.getDraggedUserColumn(weekEvent, dragEndEvent.x);
    if (newUser && newUser !== weekEvent.event.meta.terrain) {
      this.userChanged.emit({ event: weekEvent.event, newUser });
    }
  }

  protected getWeekView(events: CalendarEvent[]) {
    return this.utils.getWeekView({
      events,
      terrains: this.terrains,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      precision: this.precision,
      absolutePositionedEvents: true,
      hourSegments: this.hourSegments,
      dayStart: {
        hour: this.dayStartHour,
        minute: this.dayStartMinute,
      },
      dayEnd: {
        hour: this.dayEndHour,
        minute: this.dayEndMinute,
      },
      segmentHeight: this.hourSegmentHeight,
      weekendDays: this.weekendDays,
      ...getWeekViewPeriod(
        this.dateAdapter,
        this.viewDate,
        this.weekStartsOn,
        this.excludeDays,
        this.daysInWeek
      ),
    });
  }

  private getDraggedUserColumn(
    dayEvent: WeekViewTimeEvent | WeekViewAllDayEvent,
    xPixels: number
  ) {
    const columnsMoved = Math.round(xPixels / this.dayColumnWidth);
    const currentColumnIndex = this.view.terrains.findIndex(
      (terrain) => terrain === dayEvent.event.meta.terrain
    );
    const newIndex = currentColumnIndex + columnsMoved;
    return this.view.terrains[newIndex];
  }
}
