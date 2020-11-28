import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module'
import {ComponentsModule} from '../components.module';
import {Tab2PageModule} from '../tab2/tab2.module';
import {DayViewSchedulerComponent} from '../day-view-scheduler/day-view-scheduler.component';
import {CalendarModule} from 'angular-calendar';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule,
        ExploreContainerComponentModule,
        RouterModule.forChild([{path: '', component: Tab3Page}]),
        Tab3PageRoutingModule,
        Tab2PageModule,
    ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
