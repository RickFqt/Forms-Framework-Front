import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario, UsuarioCreate } from './usuario';
import { Observable } from 'rxjs';
import { Formulario } from './formulario';

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

  getFormularios(usuarioId: number): Observable<Formulario[]> {
    return this.http.get<Formulario[]>(`/api/usuario/${usuarioId}/formularios`);
  }

  createFormulario(usuarioId: number, formulario: Formulario): Observable<Formulario> {
    return this.http.post<Formulario>(`/api/usuario/${usuarioId}/addFormulario`, formulario);
  }
}