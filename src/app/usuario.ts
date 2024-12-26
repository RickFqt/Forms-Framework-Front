export interface Usuario {
    id: number;
    nome: string;
    login: string;
    senha: string;
    tipoUsuario: string;
    prontuariosIds: number[];
}

export interface UsuarioCreate {
    nome: string;
    login: string;
    senha: string;
    tipoUsuario: string;
}