import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario, UsuarioCreate } from './usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`/api/usuario`);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`/api/usuario/${id}`);
  }

  create(usuario: UsuarioCreate): Observable<Usuario> {
    return this.http.post<Usuario>(`/api/usuario`, usuario);
  }
}