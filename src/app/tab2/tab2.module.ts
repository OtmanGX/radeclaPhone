import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import {ComponentsModule} from '../components.module';
import {DayViewSchedulerComponent} from '../day-view-scheduler/day-view-scheduler.component';
import {CalendarModule} from 'angular-calendar';
@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule,
        ExploreContainerComponentModule,
        Tab2PageRoutingModule,
        CalendarModule,
    ],
    declarations: [Tab2Page]
})
export class Tab2PageModule {}
