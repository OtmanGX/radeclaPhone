import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {IonicModule} from '@ionic/angular';
import {CalendarModule} from 'angular-calendar';
import {DayViewSchedulerComponent} from './day-view-scheduler/day-view-scheduler.component';



@NgModule({
  declarations: [HeaderComponent, DayViewSchedulerComponent],
  exports: [
    HeaderComponent,
    DayViewSchedulerComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    CalendarModule
  ],
})
export class ComponentsModule { }
