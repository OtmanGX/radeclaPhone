import { Component, OnInit } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import {ReservationService} from '../services/reservation.service';
import {MembreService} from '../services/membre.service';
import {Membre} from '../models/membre';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Form} from '@angular/forms';
import {ReservationData} from '../models/reservation-data';

@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.page.html',
  styleUrls: ['./new-reservation.page.scss'],
})
export class NewReservationPage implements OnInit {
  // members
    membres: Membre[] = [];
    title = 'Ajout';
    reservation: ReservationData = new ReservationData();

  constructor(private resService: ReservationService,
              private memService: MembreService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    const reservationID = this.activatedRoute.snapshot.paramMap.get('id');
    if (reservationID) {
      console.log('edit');
      this.title = 'Modifier';
      this.resService.get(parseInt(reservationID, 10)).subscribe(value => this.reservation = (value as ReservationData));
    } else {
      this.reservation.start_date = new Date(this.activatedRoute.snapshot.paramMap.get('startDate'));
      this.reservation.end_date = new Date(this.activatedRoute.snapshot.paramMap.get('endDate'));
      this.reservation.terrain = parseInt(this.activatedRoute.snapshot.paramMap.get('terrain'), 10);
    }

    this.memService.getAllByPage({all: true}).subscribe(value => {
      this.membres = value;
    });
  }

  memberChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('Membre:', event.value);
  }

  getMember(num: number): Membre {
    for (const m of this.membres){
      if (m.id === num)
      {
        return m;
      }
    }
  }

  submit(value) {
    // console.log(form);
    // const value = form.value;
    this.authService.getCurrentUser().subscribe(user => {
      this.reservation.players = [user.membreId, value.players.id];
      console.log(value);
      if (this.reservation.id) {
        this.resService.patch(this.reservation.id, this.reservation).subscribe(value1 => console.log(value1));
        this.router.navigate(['tabs/tab2', {add: true}]);
      }else { this.resService.create(this.reservation).subscribe( res => {
        console.log(res);
        this.router.navigate(['tabs/tab2', {add: true}]);
      });
      }
    });
  }
}
