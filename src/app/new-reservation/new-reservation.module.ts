import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewReservationPageRoutingModule } from './new-reservation-routing.module';

import { NewReservationPage } from './new-reservation.page';
import {ComponentsModule} from '../components.module';
import {IonicSelectableModule} from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    IonicSelectableModule,
    NewReservationPageRoutingModule
  ],
  declarations: [NewReservationPage]
})
export class NewReservationPageModule {}
