import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Formulario } from '../formulario';

@Component({
  selector: 'app-formulario-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './formulario-item.component.html',
  styleUrl: './formulario-item.component.css'
})
export class FormularioItemComponent {
  @Input() formulario!: Formulario;
}
