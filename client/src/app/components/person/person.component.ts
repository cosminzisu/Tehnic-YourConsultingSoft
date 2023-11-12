import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { PersonModalComponent } from './person-modal/person-modal.component';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  persons: any = [];
  cars: any[] = [];

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }

  ngOnInit(): void {
    this.loadData();
  
  }
  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/person').then(({ data }) => {
      this.persons = data;
      console.log('Persons:', this.persons);
      axios.get('/api/car').then(({ data: cars }) => {
        this.cars = cars;
        console.log('Cars:', this.cars);
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea mașinilor!'));
    }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
  }
  getMasinaById(masinaId: string) {
    return this.cars.find(m => m.id.toString() === masinaId);
  }

  addEdit = (person?: any): void => {
    const modalRef = this._modal.open(PersonModalComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    console.log(person)
    if(person) {
      modalRef.componentInstance.person = person;
      modalRef.componentInstance.id_person = person.id;
    }
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (person: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana <b>${person.nume} ${person.prenume}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/person/${person.id}`).then(() => {
        this.toastr.success('Persoana a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this.toastr.error('Eroare la ștergerea informației!'));
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-informations')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-informations', 0);
    this.limit = 70;
  }

  

}
