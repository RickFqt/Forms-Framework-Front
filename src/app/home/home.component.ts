import { Component, inject } from '@angular/core';
import { ProntuarioItemComponent } from '../prontuario-item/prontuario-item.component';
import { Prontuario } from '../prontuario';
import { ProntuarioService } from '../prontuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProntuarioItemComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  prontuarioService: ProntuarioService = inject(ProntuarioService);

  prontuarioList: Prontuario[] = [];
  filteredProntuarioList: Prontuario[] = [];

  constructor() {

    this.prontuarioService.getAll().subscribe((prontuarioList: Prontuario[]) => {
      this.prontuarioList = prontuarioList;
      this.filteredProntuarioList = prontuarioList;
    });
  }

  filterResults(text: string) {
    if(!text) {
      this.filteredProntuarioList = this.prontuarioList;
      return;
    }

    this.filteredProntuarioList = this.prontuarioList.filter((prontuario) => 
      prontuario?.nome.toLowerCase().includes(text.toLowerCase())
    );
  }
}
