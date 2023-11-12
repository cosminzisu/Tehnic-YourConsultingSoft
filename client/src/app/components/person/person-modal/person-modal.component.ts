import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.scss']
})
export class PersonModalComponent implements OnInit {
    @Input() id_person: number | undefined;
    @Input() person: any | undefined;
    
    modal = {} as any;
    cars = [] as any;
  
    constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
    }
  
    loadPersonCars(carDetails: any[]): void {
      axios.get(`/api/car/`).then(({ data }) => {
        if (Array.isArray(data)) {
          this.cars = data;
          if (carDetails && carDetails.length > 0) {
            this.modal.masini = carDetails;
          } else {
            this.modal.masini = [];
          }
        } else {
          this.toastr.error('Datele mașinilor nu sunt în formatul așteptat.');
        }
      }).catch(() => this.toastr.error('Eroare la preluarea mașinilor persoanei!'));
    }

    ngOnInit(): void {
      this._spinner.show();

      axios.get(`/api/car/`).then(({ data }) => {
        if (Array.isArray(data)) {
          this.cars = data;
          console.log("Masinile" + this.cars);
    
          if (this.id_person) {
            axios.get(`/api/person/${this.id_person}`).then(({ data }) => {
              this.modal = data;
              
              if (data && data.masini && data.masini.length > 0) {
                this.loadPersonCars(data.masini);
                console.log(data.masini);
              }
    
              this._spinner.hide();
            }).catch(() => this.toastr.error('Eroare la preluarea informației!'));
          } else if (this.person) {
            this.modal = this.person;
            
            if (this.person.masini && this.person.masini.length > 0) {
              this.loadPersonCars(this.person.masini);
            }
    
            this._spinner.hide();
          }
        } else {
          this.toastr.error('Datele mașinilor nu sunt în formatul așteptat.');
        }
      }).catch(() => this.toastr.error('Eroare la preluarea mașinilor!'));
    }
  
    save(): void {
      const missingFields = [];

      if (!this.modal.nume) {
        missingFields.push('Nume');
      }
    
      if (!this.modal.prenume) {
        missingFields.push('Prenume');
      }
    
      if (!this.modal.cnp) {
        missingFields.push('CNP');
      }
    
      if (this.modal.masini.length === 0) {
        missingFields.push('Mașini');
      }
    
      if (missingFields.length > 0) {
        const missingFieldsMessage = `Campul(rile) ${missingFields.join(', ')} trebuie completate.`;
        this.toastr.error(missingFieldsMessage);
        return;
      }
      this.modal.varsta = this.calculateAgeFromCNP(this.modal.cnp);
      this.modal.masini = this.modal.masini || []; 
    
      this._spinner.show();
    
      if (!this.id_person) {
        axios.post('/api/person', this.modal).then(({ data }) => {
          const personId = data.id;
          if (this.id_person) {
            this.createPersonCarAssociations(this.id_person, this.modal.masini);
          }
    
          this._spinner.hide();
          this.toastr.success('Informația a fost salvată cu succes!');
          this.activeModal.close();
        }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
      } else {
        axios.put('/api/person', this.modal).then(() => {
          if (this.id_person) {
          this.updatePersonCarAssociations(this.id_person, this.modal.masini);
          }
          this._spinner.hide();
          this.toastr.success('Informația a fost modificată cu succes!');
          this.activeModal.close();
        }).catch(() => this.toastr.error('Eroare la modificarea informației!'));
      }
    }
    createPersonCarAssociations(personId: number, carIds: number[]): void {
      axios.post('/api/junction', { id_person: personId, id_car: carIds }).then(() => {
      }).catch(error => {
        console.error(error);
        this.toastr.error('Eroare la crearea asocierilor persoană-mașină!');
      });
    }
    updatePersonCarAssociations(personId: number, carIds: number[]): void {
      axios.delete(`/api/junction/${personId}`).then(() => {
        this.createPersonCarAssociations(personId, carIds);
      }).catch(() => this.toastr.error('Eroare la actualizarea asocierilor persoană-mașină!'));
    }
    
    selectSearch(term: string, item: any): boolean {
      const isWordThere = [] as any;
      const splitTerm = term.split(' ').filter(t => t);
  
      item = REPLACE_DIACRITICS(item.name);
  
      splitTerm.forEach(term => isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1));
      const all_words = (this_word: any) => this_word;
  
      return isWordThere.every(all_words);
    }

      //calcularea varstei din cnp

      calculateAgeFromCNP(cnp: string): number | null {

        const cnpRegex = /^[0-9]{13}$/;
        if (!cnpRegex.test(cnp)) {
          return null;
        }
        const birthYear = parseInt(cnp.substring(1, 3), 10);
  
        const currentYear = new Date().getFullYear();
        let age = currentYear - (1900 + birthYear);
    
        const currentMonth = new Date().getMonth() + 1;
        const birthMonth = parseInt(cnp.substring(3, 5), 10);
        const birthDay = parseInt(cnp.substring(5, 7), 10);
    
        if (birthMonth > currentMonth || (birthMonth === currentMonth && birthDay > new Date().getDate())) {
          age--;
        }
        return age;
      }
  }
  