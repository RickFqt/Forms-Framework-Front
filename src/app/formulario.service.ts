import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Formulario, FormularioComplete } from './formulario';
import { Observable, catchError, throwError } from 'rxjs';
import { Secao, SecaoCreate } from './secao';
import { Resposta, RespostaCreate } from './resposta';
import { Diagnostico } from './diagnostico';

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

  addFromTemplate(idFormulario: number): Observable<Formulario> {
    return this.http.post<Formulario>(`/api/formulario/template/${idFormulario}/addFormulario`, null);
  }

  addSecao(idFormulario: number, secao: SecaoCreate): Observable<Secao> {
    return this.http.post<Secao>(`/api/formulario/${idFormulario}/addSecao`, secao);
  }

  addResposta(idFormulario: number, idQuesito: number, resposta: RespostaCreate): Observable<Resposta> {
    return this.http.post<Resposta>(`/api/formulario/${idFormulario}/quesito/${idQuesito}/addResposta`, resposta);
  }

  gerarDiagnosticoLLM(idFormulario: number): Observable<{conteudo: string}> {
    return this.http.get<{conteudo: string}>(`/api/formulario/${idFormulario}/diagnosticoLLM`);
  }

  gerarDiagnostico(idFormulario: number): Observable<Diagnostico> {
    return this.http.get<Diagnostico>(`/api/formulario/${idFormulario}/diagnostico`);
  }

  finalizarFormulario(idFormulario: number): Observable<Formulario> {
    return this.http.patch<Formulario>(`/api/formulario/${idFormulario}/finalizarFormulario`, null).pipe(
      catchError((error) => {
        const mensagemErro = error.error?.message || 'Erro ao finalizar prontuário';
        return throwError(() => new Error(mensagemErro));
      })
    );
  }


}
