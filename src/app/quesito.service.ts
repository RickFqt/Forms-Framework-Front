import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quesito, QuesitoCreate, QuesitoUpdate } from './quesito';
import { Observable } from 'rxjs';
import { Opcao, OpcaoCreate } from './opcao';

@Injectable({
  providedIn: 'root'
})
export class QuesitoService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Quesito[]> {
    return this.http.get<Quesito[]>(`/api/quesito`);
  }

  getById(id: number): Observable<Quesito> {
    return this.http.get<Quesito>(`/api/quesito/${id}`);
  }

  estaHabilitado(quesitoId: number): Observable<boolean> {
    return this.http.get<boolean>(`/api/quesito/${quesitoId}/estaHabilitado`);
  }

  update(id:number, quesito: QuesitoUpdate): Observable<Quesito> {
    return this.http.put<Quesito>(`/api/quesito/${id}`, quesito);
  }

  addSubQuesito(id:number, quesito: QuesitoCreate): Observable<Quesito> {
    return this.http.post<Quesito>(`/api/quesito/${id}/addSubQuesito`, quesito);
  }

  addOpcao(id:number, opcao: OpcaoCreate): Observable<Opcao> {
    return this.http.post<Opcao>(`/api/quesito/${id}/addOpcao`, opcao);
  }
}
