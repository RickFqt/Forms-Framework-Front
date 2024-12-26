import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resposta, RespostaCreate } from './resposta';
import { Opcao } from './opcao';

@Injectable({
  providedIn: 'root'
})
export class RespostaService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Resposta[]> {
    return this.http.get<Resposta[]>(`/api/resposta`);
  }

  getById(id: number): Observable<Resposta> {
    return this.http.get<Resposta>(`/api/resposta/${id}`);
  }

  addOpcaoMarcada(idResposta: number, idOpcao: number): Observable<Resposta> {
    return this.http.patch<Resposta>(`/api/resposta/${idResposta}/addOpcaoMarcada/${idOpcao}`, null);
  }

  update(id: number, resposta: RespostaCreate): Observable<Resposta> {
    return this.http.put<Resposta>(`/api/resposta/${id}`, resposta);
  }

  setOpcoesMarcadas(idResposta: number, opcoesMarcadasIds: {opcoesMarcadasIds: number[]}): Observable<Opcao[]> {
    return this.http.put<Opcao[]>(`/api/resposta/${idResposta}/setOpcoesMarcadas`, opcoesMarcadasIds);
  }
}
