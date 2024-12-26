import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { QuesitoComponent } from "../quesito/quesito.component";
import { SecaoComplete, SecaoCreate, SecaoData, SecaoUpdate } from '../secao';
import { SecaoService } from '../secao.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RespostaCreate } from '../resposta';
import { ItemOutput } from '../itemoutput';
import { QuesitoComplete, QuesitoCreate } from '../quesito';
import { QuesitoService } from '../quesito.service';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, QuesitoComponent, FormsModule],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent {
  @Input() section: SecaoComplete = {} as SecaoComplete;
  @Input() sectionIndex: string = ''; // Para numerar as seções e subseções
  @Input() estadoProntuario: string = '';
  isVisible: boolean = true;
  secaoService: SecaoService = inject(SecaoService);

  toggleSection() {
    this.isVisible = !this.isVisible;
  }

  // -------------------- Funcoes e atributos para o estado de edicao --------------------
  mostrarBotaoSubitem: boolean = false; // Para mostrar o input de nova seção ou quesito
  secaoEditando: boolean = false;  // ID da seção em edição
  secaoEditandoTitulo: string = '';  // Título temporário
  novaSecaoTitulo: string = ''; // para armazenar o título da nova seção temporariamente
  novoQuesitoTitulo: string = ''; // para armazenar o título da nova seção temporariamente
  @Output() secaoAtualizada = new EventEmitter<{superSecaoId:number, secaoAtualizada:SecaoComplete}>();
  @Output() subSecaoCriada = new EventEmitter<{superSecaoId: number, subSecao: SecaoData}>();
  @Output() quesitoCriado = new EventEmitter();
  @Output() subQuesitoCriado = new EventEmitter();
  @Output() quesitoAtualizado = new EventEmitter();

  // Método para iniciar a edição da seção
  editarSecao() {
    this.secaoEditando = true;
    this.secaoEditandoTitulo = this.section.titulo;
  }

  // Método para salvar a edição
  async salvarEdicaoSecao() {
    const secaoNova = { ...this.section, titulo: this.secaoEditandoTitulo };

    // Atualiza a seção no backend
    const secaoAtualizada = await firstValueFrom(this.secaoService.update(this.section.id, secaoNova));

    // Atualiza a seção na lista
    this.section.titulo = secaoAtualizada.titulo;
    this.section.ordem = secaoAtualizada.ordem;
    this.section.nivel = secaoAtualizada.nivel;


    this.secaoAtualizada.emit({superSecaoId: this.section.superSecaoId, secaoAtualizada:this.section});

    this.secaoEditando = false;

  }

  // Método para cancelar a edição
  cancelarEdicao() {
    this.secaoEditando = false;
    this.secaoEditandoTitulo = '';
  }

  async adicionarSubSecao(): Promise<void> {
     
    const novaSecao : SecaoCreate = {
      titulo: 'Nova Subseção',
    };

    // Adiciona a nova seção ao prontuário
    const novaSecaoCriada = await firstValueFrom(this.secaoService.addSubSecao(this.section.id, novaSecao));

    const novaSecaoData : SecaoData = {
      id: novaSecaoCriada.id,
      titulo: novaSecaoCriada.titulo,
      ordem: novaSecaoCriada.ordem,
      nivel: novaSecaoCriada.nivel,
      subSecoesIds: novaSecaoCriada.subSecoesIds,
      superSecaoId: novaSecaoCriada.superSecaoId,
      prontuarioId: novaSecaoCriada.prontuarioId,
      quesitosIds: novaSecaoCriada.quesitosIds,
      quesitos: [],
      subSecoes: []
    };

    this.novaSecaoTitulo = ''; // limpa o campo após a adição
    // Atualiza o prontuário local
    this.subSecaoCriada.emit({superSecaoId: this.section.id, subSecao: novaSecaoData});
  }

  atualizarSecaoPropagate(event : {superSecaoId: number, secaoAtualizada: SecaoComplete}) {
    this.secaoAtualizada.emit(event);
  }

  adicionarSubSecaoPropagate(event : {superSecaoId: number, subSecao: SecaoData}) {
    this.subSecaoCriada.emit(event);
  }

  async adicionarQuesito(): Promise<void> {
    
    const novoQuesito : QuesitoCreate = {
      enunciado: 'Novo Quesito',
      tipoResposta: 'DISSERTATIVA_CURTA',
    };

    // Adiciona a novo quesito ao prontuário
    const novoQuesitoCriado = await firstValueFrom(this.secaoService.addQuesito(this.section.id, novoQuesito));

    this.novoQuesitoTitulo = ''; // limpa o campo após a adição
    // Atualiza o prontuário local
    this.quesitoCriado.emit();
    
  }

  adicionarQuesitoPropagate() {
    this.quesitoCriado.emit();
  }

  adicionarSubQuesitoPropagate() {
    this.subQuesitoCriado.emit();
  }

  quesitoAtualizadoPropagate() {
    this.quesitoAtualizado.emit();
  }

  toggleAdicionarSubitemButtons() {
    this.mostrarBotaoSubitem = !this.mostrarBotaoSubitem;
  }

  // -------------------- Funcoes e atributos para o estado de respondendo --------------------
  @Output() respostaAtualizada = new EventEmitter();
  @Output() criarResposta = new EventEmitter<{quesitoId:number, resposta:RespostaCreate, opcaoId:number}>();
  @ViewChildren(QuesitoComponent) quesitoComponents!: QueryList<QuesitoComponent>;
  @ViewChildren(SectionComponent) subSecaoComponents!: QueryList<SectionComponent>;

  respostaAtualizadaPropagate() {
    this.respostaAtualizada.emit();
  }

  criarRespostaPropagate(event : {quesitoId:number, resposta:RespostaCreate, opcaoId:number}) {
    this.criarResposta.emit(event);
  }

  castToQuesitoComplete(subItem: ItemOutput) {
    return subItem as QuesitoComplete;
  }

  castToSecaoComplete(subItem: ItemOutput) {
    return subItem as SecaoComplete;
  }

  salvarRespostasDissertativas(prontuarioId: number) {
    const salvarRequisicoesQuesitos = this.quesitoComponents.map(quesitoComponent => quesitoComponent.salvarRespostaDissertativa(prontuarioId));
    const salvarRequisicoesSubSecoes = this.subSecaoComponents.map(subSecaoComponent => subSecaoComponent.salvarRespostasDissertativas(prontuarioId));

    Promise.all([...salvarRequisicoesQuesitos, ...salvarRequisicoesSubSecoes]).then(() => {
      
    });
  }
}
