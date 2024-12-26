import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionComponent } from '../section/section.component';
import { ProntuarioService } from '../prontuario.service';
import { SecaoService } from '../secao.service';
import { QuesitoService } from '../quesito.service';
import { OpcaoService } from '../opcao.service';
import { RespostaService } from '../resposta.service';
import { Prontuario, ProntuarioComplete, ProntuarioData } from '../prontuario';
import { SecaoComplete, SecaoCreate, SecaoData } from '../secao';
import { QuesitoComplete, QuesitoData } from '../quesito';
import { Opcao, OpcaoComplete } from '../opcao';
import { concatMap, firstValueFrom, Observable, switchMap, tap } from 'rxjs';
import { UsuarioService } from '../usuario.service';
import { Usuario, UsuarioCreate } from '../usuario';
import { FormsModule } from '@angular/forms';
import { RespostaCreate } from '../resposta';
import { ItemOutput } from '../itemoutput';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-prontuario-view',
  standalone: true,
  imports: [RouterModule, CommonModule, SectionComponent, FormsModule],
  templateUrl: './prontuario-view.component.html',
  styleUrl: './prontuario-view.component.css'
})
export class ProntuarioViewComponent {
  route : ActivatedRoute = inject(ActivatedRoute);
  buttonSrc: string = 'button.png';
  estadoProntuario: string = 'visualizacao';
  usuarioService: UsuarioService = inject(UsuarioService);
  prontuarioService: ProntuarioService = inject(ProntuarioService);
  secaoService: SecaoService = inject(SecaoService);
  quesitoService: QuesitoService = inject(QuesitoService);
  opcaoService: OpcaoService = inject(OpcaoService);
  respostaService: RespostaService = inject(RespostaService);
  router: Router = inject(Router);


  prontuario : ProntuarioComplete = {} as ProntuarioComplete;
  displayedText: string = '';
  displayedDiagnosticoText: string = '';

  mensagemSucesso: string | null = null;
  mostrarPopUp: boolean = false;
  ehMensagemErro = false;

  ngOnInit() {
    this.changeProntuarioState('visualizacao');
    this.refreshProntuarioAsync().subscribe(() => {
      this.displayedText = this.prontuario.diagnosticoLLM || "";
    });
  }

  refreshProntuario(id: number = 0) {
    const prontuarioId = (id != 0 ? id : parseInt(this.route.snapshot.params['id'], 10));

    const incluirDesabilitados : boolean = this.estadoProntuario === 'editando' ? true : false;

    this.prontuarioService.getByIdComplete(prontuarioId, incluirDesabilitados).subscribe(
      (prontuarioData) => {
        this.prontuario = prontuarioData;
      }
    );
  }

  onHoverButton() {
    this.buttonSrc = 'button_hover.png';
  }

  onLeaveButton() {
    this.buttonSrc = 'button.png';
  }

  changeProntuarioState(estado: string) {
    // Possiveis estados: visualizacao, respondendo, editando
    this.estadoProntuario = estado;
    // this.refreshProntuarioAsync().subscribe(() => {});
  }
  
  // DEBUG ONLY FUNCTION; REMOVE LATER
  changeProntuarioStateDebug() {
    this.estadoProntuario = this.estadoProntuario === 'visualizacao' ? 'respondendo' : 'visualizacao';
  }

  async makeProntuarioCopy(): Promise<void> {
    // const newUsuario : UsuarioCreate = {
    //   nome: 'Usuario Fantasma',
    //   login: 'login',
    //   senha: 'senha',
    //   tipoUsuario: 'PADRAO'
    // };
    // const usuarioCriado = await firstValueFrom(this.usuarioService.create(newUsuario));

    // const idUsuarioCriado = usuarioCriado.id;
    // TODO: Get the id of the user that is logged in
    const idUsuarioCriado = 1;

    const prontuarioCopiado = await firstValueFrom(this.prontuarioService.duplicar(this.prontuario.id, idUsuarioCriado));
    this.router.navigate(['/prontuario', prontuarioCopiado.id]);
    this.refreshProntuario(prontuarioCopiado.id);
    // this.prontuario = await this.mapProntuarioById(prontuarioCopiado.id);
    console.log('Prontuario copiado!');
    console.log(prontuarioCopiado);
    this.mensagemSucesso = 'Prontuário copiado com sucesso!';
    this.mostrarPopUp = true;

    // Fechar automaticamente o pop-up após 3 segundos (opcional)
    setTimeout(() => {
      this.fecharPopUp();
    }, 3000);
  }

  fecharPopUp() {
    this.mostrarPopUp = false;
    this.ehMensagemErro = false;
  }

  async makeProntuarioFromTemplate(): Promise<void> {
    const prontuarioId = parseInt(this.route.snapshot.params['id'], 10);

    const prontuarioCriado = await firstValueFrom(this.prontuarioService.addFromTemplate(prontuarioId));
    // this.prontuario = await this.mapProntuarioById(prontuarioCriado.id);
    this.router.navigate(['/prontuario', prontuarioCriado.id]);
    this.refreshProntuario(prontuarioCriado.id);
    console.log('Prontuario criado a partir de template!');
    console.log(prontuarioCriado);
    this.mensagemSucesso = 'Prontuário criado a partir de template!';
    this.mostrarPopUp = true;

    // Fechar automaticamente o pop-up após 3 segundos (opcional)
    setTimeout(() => {
      this.fecharPopUp();
    }, 3000);
  }
  // -------------------- Funcoes e atributos para o estado de visualizacao --------------------
  gerarDiagnosticoLLM() {
    const textarea = document.getElementById("diagnosticoLLM") as HTMLTextAreaElement;
    textarea.value = "Gerando diagnóstico..."; 
    this.prontuarioService.gerarDiagnosticoLLM(this.prontuario.id).subscribe(() => {
      // Aguarda o refresh do prontuário antes de iniciar a animação
      this.refreshProntuarioAsync().subscribe(() => {
        const text = this.prontuario.diagnosticoLLM;
        
        let index = 0;
        const textarea = document.getElementById("diagnosticoLLM") as HTMLTextAreaElement;
        textarea.value = "";; // Limpa o conteúdo exibido para começar a animação

        function type() {
          if (index < text.length) {
            textarea.value += text.charAt(index);
            textarea.scrollTop = textarea.scrollHeight;
            index++;
            setTimeout(type, 10); // Ajuste a velocidade conforme necessário
          }
        }

        // Inicia a animação de digitação
        type();
      });
    });
  }

  gerarDiagnosticoPreCadastrado() {
    this.prontuarioService.gerarDiagnostico(this.prontuario.id).subscribe((diagnostico) => {
      const textarea = document.getElementById("diagnosticoPreCadastrado") as HTMLTextAreaElement;
      textarea.value = diagnostico.descricao;
      this.displayedDiagnosticoText = diagnostico.descricao;
    });
  }
    
    

  refreshProntuarioAsync(id: number = 0): Observable<void> {
    const prontuarioId = (id !== 0 ? id : parseInt(this.route.snapshot.params['id'], 10));
    const incluirDesabilitados: boolean = this.estadoProntuario === 'editando';

    return new Observable<void>((observer) => {
      this.prontuarioService.getByIdComplete(prontuarioId, incluirDesabilitados).subscribe(
        (prontuarioData) => {
          this.prontuario = prontuarioData;
          observer.next();
          observer.complete();
        }
      );
    });
  }

  generatePDF() {
    this.prontuarioService.getByIdComplete(this.prontuario.id, false).subscribe({
      next: (prontuario) => {
        console.log(prontuario)
        // Cria uma nova instância de jsPDF
        const doc = new jsPDF('p', 'mm', 'a4');
  
        // Título
        doc.setFontSize(20);
        doc.setFont('Nunito', 'bold');
        doc.text(prontuario.nome, 10, 20);
        // Imprime se é template
        if (prontuario.ehTemplate) {
          doc.setFontSize(12);
          doc.text('@Template', 60, 20);
        }
  
        // Descrição
        doc.setFontSize(14);
        doc.setFont('Nunito', 'normal');
        doc.text(prontuario.descricao || 'Sem descrição', 10, 30);
  
        // Seções/Quesitos
        let yPosition = 40;
        // Função para imprimir seções e subseções recursivamente
        const printSubItem = (item: any, depth: number = 0) => {
          // Ajusta a indentação com base na profundidade
          const indent = 10 + depth * 10;

          // Título da seção ou quesito
          doc.setFontSize(16 - depth); // Menor tamanho para subseções mais profundas
          doc.setFont('Nunito', 'bold');
          if(item.tipoDeItem == "secao"){
            doc.text(`${item.numeracao} ${item.titulo}`, 10, yPosition);
          }else{
            doc.text(`${item.numeracao} ${item.enunciado}`, 10, yPosition);
          }
          yPosition += 10;

          // Conteúdo do quesito
          if(item.tipoDeItem == "quesito"){
            doc.setFontSize(12);
            doc.setFont('Nunito', 'normal');
            
            switch (item.tipoResposta) {
              case 'DISSERTATIVA_CURTA':
              case 'DISSERTATIVA_LONGA':
                // Cria uma caixa de texto com a resposta (se houver)
                const boxHeight = item.tipoResposta === 'DISSERTATIVA_CURTA' ? 20 : 50;
                doc.rect(indent, yPosition, 180 - depth * 10, boxHeight);
                if (item.resposta) {
                  const respostaText = doc.splitTextToSize(item.resposta.conteudo[0], 180 - depth * 10 - 2);
                  doc.text(respostaText, indent + 2, yPosition + 5);
                }
                yPosition += boxHeight + 10;
                break;

              case 'OBJETIVA_SIMPLES':
              case 'OBJETIVA_MULTIPLA':
                // Mostra as opções lado a lado
                if (item.opcoes && item.opcoes.length > 0) {
                  let currentX = indent; // Posição horizontal inicial
                  const rowHeight = 6; // Altura entre as linhas de opções
                  const maxWidth = 180; // Largura máxima da página para uma linha de opções
                  
                  item.opcoes.forEach((opcao: any, index: number) => {
                    const isSelected = item.resposta && item.resposta.opcoesMarcadas.some((o: { id: any; }) => o.id === opcao.id) ? 
                                       item.tipoResposta === 'OBJETIVA_SIMPLES' ? '(X)' : '[X]' 
                                       :
                                       item.tipoResposta === 'OBJETIVA_SIMPLES' ? '( )' : '[ ]' ;
                    const optionText = `${isSelected} ${opcao.textoAlternativa}`;
                    
                    const textWidth = doc.getTextWidth(optionText) + 10; // Largura do texto atual + margem

                    // Verifica se há espaço na linha atual, caso contrário, pula para a próxima linha
                    if (currentX + textWidth > maxWidth) {
                      currentX = indent; // Reinicia a posição horizontal
                      yPosition += rowHeight; // Avança para a próxima linha
                    }

                    // Adiciona o texto na posição atual
                    doc.text(optionText, currentX, yPosition);

                    // Avança horizontalmente
                    currentX += textWidth;
                  });
                  
                  // Avança a posição vertical após as opções
                  yPosition += rowHeight + 4;
                }
                break;

              default:
                doc.text('Tipo de resposta não identificado.', indent, yPosition);
                yPosition += 10;
                break;
            }
          }
          
          // Adiciona nova página se necessário
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          // Se a seção tiver subseções, chama a função recursivamente
          if (item.tipoDeItem == "secao" && item.subItens && item.subItens.length > 0) {
            item.subItens.forEach((subItem: any) => printSubItem(subItem, depth + 1));
          }
          if (item.tipoDeItem == "quesito" && item.subQuesitos && item.subQuesitos.length > 0) {
            item.subQuesitos.forEach((subItem: any) => printSubItem(subItem, depth + 1));
          }
        };
        prontuario.secoes.forEach((secao, index) => {
          printSubItem(secao);

          // Separador
          const indent = 10;
          yPosition += 5;
          doc.setLineWidth(0.1);
          doc.line(indent, yPosition, 200, yPosition);
          
          // Espaço após a seção principal
          yPosition += 10;
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
        });
  
        // Salva o PDF com o nome do prontuário
        doc.save(`${prontuario.nome}.pdf`);
      },
      error: (error) => {
        console.error('Erro ao buscar o prontuário:', error);
        alert('Não foi possível gerar o PDF.');
      },
      complete: () => {
        console.log('Geração do PDF concluída.');
      },
    });
  }
  // -------------------- Funcoes e atributos para o estado de edicao --------------------

  novaSecaoTitulo: string = ''; // para armazenar o título da nova seção temporariamente

  async adicionarSecao(): Promise<void> {
    if (this.novaSecaoTitulo.trim()) {
      
      const novaSecao : SecaoCreate = {
        titulo: this.novaSecaoTitulo
      };

      // Adiciona a nova seção ao prontuário
      const novaSecaoCriada = await firstValueFrom(this.prontuarioService.addSecao(this.prontuario.id, novaSecao));
      this.refreshProntuario();
      // Atualiza o prontuário local
      // this.prontuario.secoesIds.push(novaSecaoCriada.id);
      // this.prontuario.secoes.push(await this.mapSecaoById(novaSecaoCriada.id));
      this.novaSecaoTitulo = ''; // limpa o campo após a adição
    } else {
      alert('Por favor, insira um título para a seção.');
    }
  }

  adicionarSubSecao(event : {superSecaoId : number, subSecao : SecaoData}) {
    this.refreshProntuario();
  }

  atualizarSecao(event : {superSecaoId: number, secaoAtualizada: SecaoData}) {
    this.refreshProntuario();
  }

  finalizarEdicao() {

    this.prontuarioService.finalizarProntuario(this.prontuario.id).subscribe({
      next: () => {
      this.refreshProntuario();
      console.log('Prontuário finalizado!');
      this.mensagemSucesso = 'Prontuário finalizado com sucesso!';
      this.mostrarPopUp = true;
      this.changeProntuarioState('visualizacao');
      

      },
      error: (error) => {
      console.error('Erro ao finalizar o prontuário: ', error.message);
      this.mensagemSucesso = 'Erro ao finalizar o prontuário: ' + error.message;
      this.ehMensagemErro = true;
      this.mostrarPopUp = true;
      }
    });
  }

  // -------------------------------------------------------------------------------------

  // -------------------- Funcoes e atributos para o estado de respondendo --------------------
  @ViewChildren(SectionComponent) secaoComponents!: QueryList<SectionComponent>;
  // @Output() salvarRespostasDissertativas = new EventEmitter();

  salvarRespostasDissertativas() {

    const prontuarioId = this.prontuario.id;
    
    const salvarRequisicoes = this.secaoComponents.map(secaoComponent => secaoComponent.salvarRespostasDissertativas(prontuarioId));

    Promise.all(salvarRequisicoes).then(() => {
      // this.refreshProntuario();
      console.log('Respostas salvas!');
      this.mensagemSucesso = 'Respostas salvas com sucesso!';
      this.mostrarPopUp = true;

      this.changeProntuarioState('visualizacao');

    });
  }

  salvarResposta(event : {quesitoId:number, resposta:RespostaCreate, opcaoId:number}) {
    
    this.prontuarioService.addResposta(this.prontuario.id, event.quesitoId, event.resposta).subscribe(
      (resposta) => {
        
        this.respostaService.addOpcaoMarcada(resposta.id, event.opcaoId).subscribe(
          (resposta) => {
            this.refreshProntuario();
            console.log('Resposta salva!');
          }
        );
      }
    );
  }
  


}
