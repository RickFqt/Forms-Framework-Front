import { Component, inject } from '@angular/core';
import { FormularioItemComponent } from '../formulario-item/formulario-item.component';
import { Formulario } from '../formulario';
import { FormularioService } from '../formulario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormularioItemComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  formularioService: FormularioService = inject(FormularioService);

  formularioList: Formulario[] = [];
  filteredFormularioList: Formulario[] = [];

  constructor() {

    this.formularioService.getAll().subscribe((formularioList: Formulario[]) => {
      this.formularioList = formularioList;
      this.filteredFormularioList = formularioList;
    });
  }

  filterResults(text: string) {
    if(!text) {
      this.filteredFormularioList = this.formularioList;
      return;
    }

    this.filteredFormularioList = this.formularioList.filter((formulario) => 
      formulario?.nome.toLowerCase().includes(text.toLowerCase())
    );
  }
}
