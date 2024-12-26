import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Secao, SecaoCreate, SecaoUpdate } from './secao';
import { Observable } from 'rxjs';
import { QuesitoCreate } from './quesito';

@Injectable({
  providedIn: 'root'
})
export class SecaoService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Secao[]> {
    return this.http.get<Secao[]>(`/api/secao`);
  }

  getById(id: number): Observable<Secao> {
    return this.http.get<Secao>(`/api/secao/${id}`);
  }

  update(id:number, secao: SecaoUpdate): Observable<Secao> {
    return this.http.put<Secao>(`/api/secao/${id}`, secao);
  }

  addSubSecao(id:number, secao: SecaoCreate): Observable<Secao> {
    return this.http.post<Secao>(`/api/secao/${id}/addSubSecao`, secao);
  }

  addQuesito(id:number, quesito: QuesitoCreate): Observable<Secao> {
    return this.http.post<Secao>(`/api/secao/${id}/addQuesito`, quesito);
  }
}
