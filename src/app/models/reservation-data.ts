export class ReservationData {
  id: number;
  terrain: any = 1;
  start_date : Date;
  end_date : Date;
  duration = 1;
  players: any = [];
  eclairage : boolean = false;
  eclairage_paye : boolean = false;
  entrainement : boolean = false;
  type_match: string = 'M';
  constructor() {
  }
}
