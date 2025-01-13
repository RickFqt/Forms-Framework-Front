import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Formulario, FormularioComplete } from './formulario';
import { Observable, catchError, throwError } from 'rxjs';
import { Secao, SecaoCreate } from './secao';
import { Resposta, RespostaCreate } from './resposta';
import { Feedback } from './feedback';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  url = 'http://localhost:8080';


  constructor(private http: HttpClient) { }


  getAll(): Observable<Formulario[]> {
    return this.http.get<Formulario[]>(`/api/formulario`);
  }

  getById(id: number): Observable<Formulario> {
    return this.http.get<Formulario>(`/api/formulario/${id}`);
  }

  getByIdComplete(id: number, incluirDesabilitados: boolean): Observable<FormularioComplete> {
    const params = { 'incluirDesabilitados': incluirDesabilitados.toString() };
    return this.http.get<FormularioComplete>(`/api/formulario/${id}/complete`, {params});
  }

  update(id: number, formulario: Formulario): Observable<Formulario> {
    return this.http.put<Formulario>(`/api/formulario/${id}`, formulario);
  }

  addFormulario(nome: string, descricao: string, ): void {
    const formulario = { 
      nome: nome,
      descricao: descricao,
      ehPublico: false,
      ehTemplate: false
    };

    this.http.post(`/api/formulario`, formulario).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }

  duplicar(idFormulario: number, idUsuario: number): Observable<Formulario> {
    const params = { 'idUsuario': idUsuario.toString() };
    return this.http.post<Formulario>(`/api/formulario/${idFormulario}/duplicar`, null, {params});
  }

  addFromTemplate(idFormulario: number, idUsuario: number): Observable<Formulario> {
    return this.http.post<Formulario>(`/api/formulario/template/${idFormulario}/addFormulario/${idUsuario}`, null);
  }

  addSecao(idFormulario: number, secao: SecaoCreate): Observable<Secao> {
    return this.http.post<Secao>(`/api/formulario/${idFormulario}/addSecao`, secao);
  }

  addResposta(idFormulario: number, idQuesito: number, resposta: RespostaCreate): Observable<Resposta> {
    return this.http.post<Resposta>(`/api/formulario/${idFormulario}/quesito/${idQuesito}/addResposta`, resposta);
  }

  gerarFeedbackLLM(idFormulario: number): Observable<{conteudo: string}> {
    return this.http.get<{conteudo: string}>(`/api/formulario/${idFormulario}/feedbackLLM`);
  }

  gerarFeedback(idFormulario: number): Observable<Feedback> {
    return this.http.get<Feedback>(`/api/formulario/${idFormulario}/feedback`);
  }

  finalizarFormulario(idFormulario: number): Observable<Formulario> {
    return this.http.patch<Formulario>(`/api/formulario/${idFormulario}/finalizarFormulario`, null).pipe(
      catchError((error) => {
        const mensagemErro = error.error?.message || 'Erro ao finalizar prontuário';
        return throwError(() => new Error(mensagemErro));
      })
    );
  }

  getInformacoesArquivo(idFormulario: number): Observable<FormularioComplete> {
    return this.http.get<FormularioComplete>(`/api/formulario/${idFormulario}/informacoesArquivo`);
  }
  
  finalizarRespostas(idFormulario: number): Observable<Formulario> {
    return this.http.patch<Formulario>(`/api/formulario/${idFormulario}/finalizarRespostas`, null).pipe(
      catchError((error) => {
        const mensagemErro = error.error?.message || 'Erro ao finalizar respostas';
        return throwError(() => new Error(mensagemErro));
      })
    );
  }

  instanciarFormulario(idFormulario: number, idUsuario: number): Observable<Formulario> {
    return this.http.post<Formulario>(`/api/formulario/${idFormulario}/instanciarFormulario/${idUsuario}`, null).pipe(
      catchError((error) => {
        const mensagemErro = error.error?.message || 'Erro ao instanciar formulário';
        return throwError(() => new Error(mensagemErro));
      })
    );
  }
}
