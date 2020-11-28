import {Component, OnInit, ViewChild} from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import {ReservationService} from '../services/reservation.service';
import {MembreService} from '../services/membre.service';
import {Membre} from '../models/membre';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Form} from '@angular/forms';
import {ReservationData} from '../models/reservation-data';
import {DatePipe} from '@angular/common';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.page.html',
  styleUrls: ['./new-reservation.page.scss'],
})
export class NewReservationPage implements OnInit {
  @ViewChild('double') doubleCheckbox;
  // members
    membres: Membre[] = [];
    entraineurs: Membre[] = [];
    title = 'Ajout';
    reservation: ReservationData = new ReservationData();

  constructor(private resService: ReservationService,
              private memService: MembreService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              public toastController: ToastController) {

  }

  ngOnInit() {
    const reservationID = this.activatedRoute.snapshot.paramMap.get('id');
    if (reservationID) {
      console.log('edit');
      this.title = 'Modifier';
      this.memService.getAllByPage({all: true, entraineur: true}).subscribe(value => {
        this.entraineurs = value;
      });
      this.memService.getAllByPage({all: true, entraineur: false}).subscribe(value => {
        this.membres = value;
        this.resService.get(parseInt(reservationID, 10)).subscribe(reservation =>
        {
          this.reservation = (reservation as ReservationData);
          this.reservation.players = this.reservation.players.map( elem => this.getMember(elem));
          if (this.reservation.players.length > 2) { this.doubleCheckbox.checked = true; }
          console.log(this.reservation);
        });
      });
    } else {
      this.memService.getAllByPage({all: true}).subscribe(value => {
        this.membres = value;
      });
      this.reservation.start_date = new Date(this.activatedRoute.snapshot.paramMap.get('startDate'));
      this.reservation.end_date = new Date(this.activatedRoute.snapshot.paramMap.get('endDate'));
      this.reservation.terrain = parseInt(this.activatedRoute.snapshot.paramMap.get('terrain'), 10);
      this.reservation.players = new Array(4);
    }


  }

  memberChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('Membre:', event.value);
  }

  getMember(num: number) {
    for (const m of this.membres){
      if (m.id === num)
      {
        return {id: m.id, nom: m.nom};
      }
    }
  }

  submit(value) {
    // console.log(form);
    // const value = form.value;
    console.log('submit');
    console.log(this.reservation);
    this.reservation.players = this.reservation.players.filter(elem => elem !== undefined).map(elem => elem.id);
    if (this.reservation.players.length > 2) { this.reservation.duration = 2; }
    if (this.reservation.id) {
      this.resService.patch(this.reservation.id, this.reservation).subscribe(value1 =>
      {
        console.log(value1);
        this.presentToast('Résérvation ajoutée avec succès', 'dark');
        this.router.navigate(['tabs/tab2', {add: true}]);
      }, error => this.presentToast('Il y a un erreur', 'danger'));
    }else { this.resService.create(this.reservation).subscribe( res => {
      console.log(res);
      this.presentToast('Résérvation modifiée avec succès', 'dark');
      this.router.navigate(['tabs/tab2', {add: true}]);
    });
    }
  }


  async presentToast(msg: string, color = 'danger') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color
    });
    toast.present();
  }

  deleteReservation(id: number) {
    this.resService.delete(id)
        .subscribe((result) => {
          this.presentToast('Réservation supprimé avec succès', 'dark');
          this.router.navigate(['tabs/tab2', {add: true}]);
        }, error => console.log(error));
  }
}
