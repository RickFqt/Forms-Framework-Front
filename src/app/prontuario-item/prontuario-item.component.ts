import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Prontuario } from '../prontuario';

@Component({
  selector: 'app-prontuario-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './prontuario-item.component.html',
  styleUrl: './prontuario-item.component.css'
})
export class ProntuarioItemComponent {
  @Input() prontuario!: Prontuario;
}
