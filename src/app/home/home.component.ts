import { Component, inject } from '@angular/core';
import { Formulario, FormularioData } from '../formulario';
import { FormularioService } from '../formulario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  formularioService: FormularioService = inject(FormularioService);
  usuarioService: UsuarioService = inject(UsuarioService);
  router: Router = inject(Router);

  formularioList: Formulario[] = [];
  formularioTemplateList: Formulario[] = [];
  filteredFormularioList: Formulario[] = [];

  ngOnInit() {
    this.carregarFormularios();
  }

  visualizarFormulario(id: number) {
    // this.router.navigate(['/formulario', id], { queryParams: { estado: 'visualizacao' } });
    this.router.navigate(['/formulario', id]);
  }

  responderFormulario(id: number) {
    // Lógica para responder prontuário
  }

  copiarFormulario(id: number) {
    // Lógica para copiar prontuário
  }

  deletarFormulario(id: number) {
    // if (confirm('Tem certeza que deseja deletar este prontuário?')) {
    //   this.formularioService.delete(id).subscribe(() => {
    //     this.carregarFormularios(); // Atualiza lista
    //   });
    // }
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

  carregarFormularios() {
    // TODO: Mudar isso para carregar apenas os prontuários do usuário logado
    const usuarioId = 1;
    this.usuarioService.getFormularios(usuarioId).subscribe((data) => {
      this.formularioList = data;
      this.filteredFormularioList = data;
      this.formularioTemplateList = data;
      this.formularioTemplateList = this.formularioTemplateList.filter((formulario) => formulario?.formularioPaiId === null);
      console.log(this.formularioTemplateList);
    });
  }

  criarFormulario() {
    const formulario : FormularioData = new FormularioData();
    formulario.nome = 'Novo Formulário';
    formulario.descricao = 'Descrição do novo formulário';
    formulario.ehTemplate = true;
    formulario.ehPublico = false;

    // TODO: Mudar isso para carregar apenas os prontuários do usuário logado
    const usuarioId = 1;

    this.usuarioService.createFormulario(1, formulario).subscribe(() => {
      this.carregarFormularios();
    });
  }
}
