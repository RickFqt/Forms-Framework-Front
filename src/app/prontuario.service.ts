import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Prontuario, ProntuarioComplete } from './prontuario';
import { Observable, catchError, throwError } from 'rxjs';
import { Secao, SecaoCreate } from './secao';
import { Resposta, RespostaCreate } from './resposta';
import { Diagnostico } from './diagnostico';

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  url = 'http://localhost:8080';


  constructor(private http: HttpClient) { }


  getAll(): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(`/api/prontuario`);
  }

  getById(id: number): Observable<Prontuario> {
    return this.http.get<Prontuario>(`/api/prontuario/${id}`);
  }

  getByIdComplete(id: number, incluirDesabilitados: boolean): Observable<ProntuarioComplete> {
    const params = { 'incluirDesabilitados': incluirDesabilitados.toString() };
    return this.http.get<ProntuarioComplete>(`/api/prontuario/${id}/complete`, {params});
  }

  addProntuario(nome: string, descricao: string, ): void {
    const prontuario = { 
      nome: nome,
      descricao: descricao,
      ehPublico: false,
      ehTemplate: false
    };

    this.http.post(`/api/prontuario`, prontuario).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }

  duplicar(idProntuario: number, idUsuario: number): Observable<Prontuario> {
    const params = { 'idUsuario': idUsuario.toString() };
    return this.http.post<Prontuario>(`/api/prontuario/${idProntuario}/duplicar`, null, {params});
  }

  addFromTemplate(idProntuario: number): Observable<Prontuario> {
    return this.http.post<Prontuario>(`/api/prontuario/template/${idProntuario}/addProntuario`, null);
  }

  addSecao(idProntuario: number, secao: SecaoCreate): Observable<Secao> {
    return this.http.post<Secao>(`/api/prontuario/${idProntuario}/addSecao`, secao);
  }

  addResposta(idProntuario: number, idQuesito: number, resposta: RespostaCreate): Observable<Resposta> {
    return this.http.post<Resposta>(`/api/prontuario/${idProntuario}/quesito/${idQuesito}/addResposta`, resposta);
  }

  gerarDiagnosticoLLM(idProntuario: number): Observable<{conteudo: string}> {
    return this.http.get<{conteudo: string}>(`/api/prontuario/${idProntuario}/diagnosticoLLM`);
  }

  gerarDiagnostico(idProntuario: number): Observable<Diagnostico> {
    return this.http.get<Diagnostico>(`/api/prontuario/${idProntuario}/diagnostico`);
  }

  finalizarProntuario(idProntuario: number): Observable<Prontuario> {
    return this.http.patch<Prontuario>(`/api/prontuario/${idProntuario}/finalizarProntuario`, null).pipe(
      catchError((error) => {
        const mensagemErro = error.error?.message || 'Erro ao finalizar prontuário';
        return throwError(() => new Error(mensagemErro));
      })
    );
  }


}
