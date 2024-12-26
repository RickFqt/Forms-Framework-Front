import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Opcao, OpcaoUpdate } from './opcao';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpcaoService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Opcao[]> {
    return this.http.get<Opcao[]>(`/api/opcao`);
  }

  getById(id: number): Observable<Opcao> {
    return this.http.get<Opcao>(`/api/opcao/${id}`);
  }

  delete(id: number): Observable<Opcao> {
    return this.http.delete<Opcao>(`/api/opcao/${id}`);
  }

  update(id:number, opcao: OpcaoUpdate): Observable<Opcao> {
    return this.http.put<Opcao>(`/api/opcao/${id}`, opcao);
  }
}
