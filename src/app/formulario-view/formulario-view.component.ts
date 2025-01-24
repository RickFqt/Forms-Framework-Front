import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionComponent } from '../section/section.component';
import { FormularioService } from '../formulario.service';
import { SecaoService } from '../secao.service';
import { QuesitoService } from '../quesito.service';
import { OpcaoService } from '../opcao.service';
import { RespostaService } from '../resposta.service';
import { Formulario, FormularioComplete, FormularioData } from '../formulario';
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
  selector: 'app-formulario-view',
  standalone: true,
  imports: [RouterModule, CommonModule, SectionComponent, FormsModule],
  templateUrl: './formulario-view.component.html',
  styleUrl: './formulario-view.component.css'
})
export class FormularioViewComponent {
  route : ActivatedRoute = inject(ActivatedRoute);
  buttonSrc: string = 'button.png';
  estadoFormulario: string = 'visualizacao';
  usuarioService: UsuarioService = inject(UsuarioService);
  formularioService: FormularioService = inject(FormularioService);
  secaoService: SecaoService = inject(SecaoService);
  quesitoService: QuesitoService = inject(QuesitoService);
  opcaoService: OpcaoService = inject(OpcaoService);
  respostaService: RespostaService = inject(RespostaService);
  router: Router = inject(Router);


  formulario : FormularioComplete = {} as FormularioComplete;
  displayedText: string = '';
  displayedTextEstatisticas: string = '';
  displayedFeedbackText: string = '';

  mensagemSucesso: string | null = null;
  mostrarPopUp: boolean = false;
  ehMensagemErro = false;

  ngOnInit() {
    this.changeFormularioState('visualizacao');
    this.refreshFormularioAsync().subscribe(() => {
      this.displayedText = this.formulario.feedbackLLM || "";
      this.ehInstancia = this.formulario.formularioPaiId !== null;
      console.log('Instância:', this.formulario.formularioPaiId);

    });
  }

  refreshFormulario(id: number = 0) {
    const formularioId = (id != 0 ? id : parseInt(this.route.snapshot.params['id'], 10));

    const incluirDesabilitados : boolean = this.estadoFormulario === 'editando' ? true : false;

    this.formularioService.getByIdComplete(formularioId, incluirDesabilitados).subscribe(
      (formularioData) => {
        this.formulario = formularioData;
      }
    );
  }

  onHoverButton() {
    this.buttonSrc = 'button_hover.png';
  }

  onLeaveButton() {
    this.buttonSrc = 'button.png';
  }

  changeFormularioState(estado: string) {
    // Possiveis estados: visualizacao, respondendo, editando
    this.estadoFormulario = estado;
    // this.refreshFormularioAsync().subscribe(() => {});
  }
  
  // DEBUG ONLY FUNCTION; REMOVE LATER
  changeFormularioStateDebug() {
    this.estadoFormulario = this.estadoFormulario === 'visualizacao' ? 'respondendo' : 'visualizacao';
  }

  async makeFormularioCopy(): Promise<void> {
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

    const formularioCopiado = await firstValueFrom(this.formularioService.duplicar(this.formulario.id, idUsuarioCriado));
    this.router.navigate(['/formulario', formularioCopiado.id]);
    this.refreshFormulario(formularioCopiado.id);
    // this.formulario = await this.mapFormularioById(formularioCopiado.id);
    console.log('Formulario copiado!');
    console.log(formularioCopiado);
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

  async makeFormularioFromTemplate(): Promise<void> {
    const formularioId = parseInt(this.route.snapshot.params['id'], 10);
    // TODO: Get the id of the user that is logged in
    const idUsuario = 1;
    const formularioCriado = await firstValueFrom(this.formularioService.addFromTemplate(formularioId, idUsuario));
    // this.formulario = await this.mapFormularioById(formularioCriado.id);
    this.router.navigate(['/formulario', formularioCriado.id]);
    this.refreshFormulario(formularioCriado.id);
    console.log('Formulario criado a partir de template!');
    console.log(formularioCriado);
    this.mensagemSucesso = 'Prontuário criado a partir de template!';
    this.mostrarPopUp = true;

    // Fechar automaticamente o pop-up após 3 segundos (opcional)
    setTimeout(() => {
      this.fecharPopUp();
    }, 3000);
  }
  // -------------------- Funcoes e atributos para o estado de visualizacao --------------------
  gerarFeedbackLLM() {
    const textarea = document.getElementById("feedbackLLM") as HTMLTextAreaElement;
    textarea.value = "Gerando sugestão..."; 
    this.formularioService.gerarFeedbackLLM(this.formulario.id).subscribe(() => {
      // Aguarda o refresh do prontuário antes de iniciar a animação
      this.refreshFormularioAsync().subscribe(() => {
        const text = this.formulario.feedbackLLM;
        
        let index = 0;
        const textarea = document.getElementById("feedbackLLM") as HTMLTextAreaElement;
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

  gerarFeedbackPreCadastrado() {
    this.formularioService.gerarFeedback(this.formulario.id).subscribe((feedback) => {
      const textarea = document.getElementById("feedbackPreCadastrado") as HTMLTextAreaElement;
      textarea.value = feedback.descricao;
      this.displayedFeedbackText = feedback.descricao;
    });
  }

  gerarEstatisticasLLM() {
    const textarea = document.getElementById("estatisticasLLM") as HTMLTextAreaElement;
    textarea.value = "Gerando estatísticas..."; 
    this.formularioService.gerarEstatisticasLLM(this.formulario.id).subscribe(mapa => {
      // Aguarda o refresh do prontuário antes de iniciar a animação
      this.refreshFormularioAsync().subscribe(() => {
        const text = mapa.content;
        
        let index = 0;
        const textarea = document.getElementById("estatisticasLLM") as HTMLTextAreaElement;
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
    
    

  refreshFormularioAsync(id: number = 0): Observable<void> {
    const formularioId = (id !== 0 ? id : parseInt(this.route.snapshot.params['id'], 10));
    const incluirDesabilitados: boolean = this.estadoFormulario === 'editando';

    return new Observable<void>((observer) => {
      this.formularioService.getByIdComplete(formularioId, incluirDesabilitados).subscribe(
        (formularioData) => {
          this.formulario = formularioData;
          observer.next();
          observer.complete();
        }
      );
    });
  }

  // generatePDF() {
  //   this.formularioService.getInformacoesArquivo(this.formulario.id).subscribe({
  //     next: (formulario) => {
  //       console.log(formulario)
  //       // Cria uma nova instância de jsPDF
  //       const doc = new jsPDF('p', 'mm', 'a4');
  
  //       // Salva o PDF com o nome do prontuário
  //       doc.save(`${formulario.nome}.pdf`);
  //     },
  //     error: (error) => {
  //       console.error('Erro ao buscar o prontuário:', error);
  //       alert('Não foi possível gerar o PDF.');
  //     },
  //     complete: () => {
  //       console.log('Geração do PDF concluída.');
  //     },
  //   });
  // }
  generatePDF() {
    this.formularioService.getInformacoesArquivo(this.formulario.id).subscribe({
      next: (infoIngresso) => {
        console.log(infoIngresso);
        // Cria uma nova instância de jsPDF
        const doc = new jsPDF('p', 'mm', 'a4');
  
        // Título do PDF
        doc.setFontSize(22);
        doc.setFont('Nunito', 'bold');
        doc.text('Ingresso - Festival Musical', 10, 20);
  
        // Data da compra
        doc.setFontSize(14);
        doc.setFont('Nunito', 'normal');
        doc.text(`Data da Compra: ${infoIngresso.dataCompra}`, 10, 40);
  
        // Informações do evento
        doc.text(`Sobre o Evento: ${infoIngresso.sobreEvento}`, 10, 50);
  
        // Meia-entrada
        const meiaEntradaText = infoIngresso.ehMeiaEntrada ? 'Sim' : 'Não';
        doc.text(`Meia-Entrada: ${meiaEntradaText}`, 10, 60);
  
        // Dados pessoais
        doc.setFontSize(16);
        doc.setFont('Nunito', 'bold');
        doc.text('Dados Pessoais:', 10, 80);
  
        doc.setFontSize(14);
        doc.setFont('Nunito', 'normal');
        doc.text(`Nome: ${infoIngresso.dadosPessoais.nomeTitular}`, 10, 90);
        doc.text(`CPF: ${infoIngresso.dadosPessoais.cpfTitular}`, 10, 100);
        doc.text(`Idade: ${infoIngresso.dadosPessoais.idadeTitular}`, 10, 110);
  
        // Sugestão gerada por LLM
        if (infoIngresso.sugestaoLLM) {
          doc.setFontSize(16);
          doc.setFont('Nunito', 'bold');
          doc.text('Sugestões Personalizadas:', 10, 130);
  
          doc.setFontSize(14);
          doc.setFont('Nunito', 'normal');
          const sugestaoText = doc.splitTextToSize(infoIngresso.sugestaoLLM, 190);
          doc.text(sugestaoText, 10, 140);
        }
  
        // Salva o PDF com um nome baseado no titular do ingresso
        doc.save(`Ingresso_${infoIngresso.dadosPessoais.nomeTitular}.pdf`);
      },
      error: (error) => {
        console.error('Erro ao buscar o ingresso:', error);
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
      const novaSecaoCriada = await firstValueFrom(this.formularioService.addSecao(this.formulario.id, novaSecao));
      this.refreshFormulario();
      // Atualiza o prontuário local
      // this.formulario.secoesIds.push(novaSecaoCriada.id);
      // this.formulario.secoes.push(await this.mapSecaoById(novaSecaoCriada.id));
      this.novaSecaoTitulo = ''; // limpa o campo após a adição
    } else {
      alert('Por favor, insira um título para a seção.');
    }
  }

  adicionarSubSecao(event : {superSecaoId : number, subSecao : SecaoData}) {
    this.refreshFormulario();
  }

  atualizarSecao(event : {superSecaoId: number, secaoAtualizada: SecaoData}) {
    this.refreshFormulario();
  }

  finalizarEdicao() {

    this.formularioService.finalizarFormulario(this.formulario.id).subscribe({
      next: () => {
      this.refreshFormulario();
      console.log('Prontuário finalizado!');
      this.mensagemSucesso = 'Prontuário finalizado com sucesso!';
      this.mostrarPopUp = true;
      this.changeFormularioState('visualizacao');
      

      },
      error: (error) => {
      console.error('Erro ao finalizar o prontuário: ', error.message);
      this.mensagemSucesso = error.message;
      this.ehMensagemErro = true;
      this.mostrarPopUp = true;
      }
    });
  }

  // -------------------------------------------------------------------------------------

  // -------------------- Funcoes e atributos para o estado de respondendo --------------------
  @ViewChildren(SectionComponent) secaoComponents!: QueryList<SectionComponent>;
  ehInstancia: boolean = false;
  // @Output() salvarRespostasDissertativas = new EventEmitter();

  salvarRespostasDissertativas() {

    const formularioId = this.formulario.id;
    
    const salvarRequisicoes = this.secaoComponents.map(secaoComponent => secaoComponent.salvarRespostasDissertativas(formularioId));

    Promise.all(salvarRequisicoes).then(() => {
      // this.refreshFormulario();
      this.finalizarRespostas();
    });
  }

  finalizarRespostas() {
    this.formularioService.finalizarRespostas(this.formulario.id).subscribe({
      next: () => {
        this.refreshFormulario();
        console.log('Respostas salvas!');
        this.mensagemSucesso = 'Respostas finalizadas com sucesso!';
        this.mostrarPopUp = true;
        this.changeFormularioState('visualizacao');
      },
      error: (error) => {
        console.error('Erro ao finalizar as respostas: ', error.message);
        this.mensagemSucesso = error.message;
        this.ehMensagemErro = true;
        this.mostrarPopUp = true;
      }
    });
  }

  salvarResposta(event : {quesitoId:number, resposta:RespostaCreate, opcaoId:number}) {
    
    this.formularioService.addResposta(this.formulario.id, event.quesitoId, event.resposta).subscribe(
      (resposta) => {
        
        this.respostaService.addOpcaoMarcada(resposta.id, event.opcaoId).subscribe(
          (resposta) => {
            this.refreshFormulario();
            console.log('Resposta salva!');
          }
        );
      }
    );
  }

  instanciarFormulario() {
    const formularioId = this.formulario.id;

    // TODO: Get the id of the user that is logged in
    const idUsuario = 1;
    
    this.formularioService.instanciarFormulario(formularioId, idUsuario).subscribe({
      next: (formulario) => {

        const formularioInstanciado : FormularioData = new FormularioData();
        formularioInstanciado.nome = formulario.nome + ' - ' + new Date().toLocaleString();
        formularioInstanciado.descricao = formulario.descricao;
        formularioInstanciado.ehTemplate = formulario.ehTemplate;
        formularioInstanciado.ehPublico = formulario.ehPublico;

        this.formularioService.update(formulario.id, formularioInstanciado).subscribe(() => {
          this.router.navigate(['/formulario', formulario.id]);
          this.refreshFormulario(formulario.id);
          this.changeFormularioState('respondendo');
          this.ehInstancia = true;
          console.log('Formulário instanciado!');
          console.log(formulario);
          this.mensagemSucesso = 'Formulário instanciado com sucesso!';
          this.mostrarPopUp = true;
        });
      },
      error: (error) => {
        console.error('Erro ao instanciar o formulário:', error);
        this.mensagemSucesso = error.message;
        this.ehMensagemErro = true;
        this.mostrarPopUp = true;
      }
    });
  }

  // -------------------------------------------------------------------------------------

  // -------------------- Funcoes e atributos para o estado de respondendo --------------------
  tituloEditando: boolean = false;
  tituloAtualEditando: string = '';
  mostrarBotaoSubitemTitulo: boolean = false;
  descricaoEditando: boolean = false;
  descricaoAtualEditando: string = '';
  mostrarBotaoSubitemDescricao: boolean = false;
  

  editarTitulo() {
    this.tituloEditando = true;
    this.tituloAtualEditando = this.formulario.nome;
  }

  salvarEdicaoTitulo() {
    const formulario : FormularioData = new FormularioData();
    formulario.nome = this.tituloAtualEditando;
    formulario.descricao = this.formulario.descricao;
    formulario.ehTemplate = this.formulario.ehTemplate;
    formulario.ehPublico = this.formulario.ehPublico;


    this.formularioService.update(this.formulario.id, formulario).subscribe(() => {
      this.refreshFormulario();
      this.tituloEditando = false;
      console.log('Título atualizado!');
      this.mostrarBotaoSubitemTitulo = false;
    });
  }

  cancelarEdicaoTitulo() {
    this.tituloEditando = false;
    this.tituloAtualEditando = '';
    this.mostrarBotaoSubitemTitulo = false;
  }

  cancelarEdicaoDescricao() {
    this.descricaoEditando = false;
    this.descricaoAtualEditando = '';
    this.mostrarBotaoSubitemDescricao = false;
  }

  editarDescricao() {
    this.descricaoEditando = true;
    this.descricaoAtualEditando = this.formulario.descricao;
  }

  salvarEdicaoDescricao() {
    const formulario : FormularioData = new FormularioData();
    formulario.nome = this.formulario.nome;
    formulario.descricao = this.descricaoAtualEditando;
    formulario.ehTemplate = this.formulario.ehTemplate;
    formulario.ehPublico = this.formulario.ehPublico;


    this.formularioService.update(this.formulario.id, formulario).subscribe(() => {
      this.refreshFormulario();
      this.descricaoEditando = false;
      console.log('Título atualizado!');
      this.mostrarBotaoSubitemDescricao = false;
    });
  }



}
