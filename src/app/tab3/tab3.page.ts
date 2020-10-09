import {Component, OnInit} from '@angular/core';
import {ReservationService} from '../services/reservation.service';
import {AuthService} from '../services/auth.service';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  reservations$;
  constructor(
      private reservationService: ReservationService,
      private authService: AuthService,
      public toastController: ToastController,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.authService.getCurrentUser().subscribe(user => {
      this.reservations$ = this.reservationService.getall({created_by: user.id, limit: 10});
    });
  }

  deleteReservation(id: number) {
    this.reservationService.delete(id)
        .subscribe((result) => {
          this.presentToast('Réservation supprimé avec succès');
          this.fetchData();
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
}
