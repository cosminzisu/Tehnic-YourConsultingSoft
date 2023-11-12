import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './components/information/information.component';
import { PersonComponent } from './components/person/person.component';
import { CarComponent } from './components/car/car.component';

const routes: Routes = [
  { path: 'information', component: InformationComponent },
  { path: 'person', component: PersonComponent},
  { path: 'car', component: CarComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
