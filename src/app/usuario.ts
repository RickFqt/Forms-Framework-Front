export interface Usuario {
    id: number;
    nome: string;
    login: string;
    senha: string;
    tipoUsuario: string;
    formulariosIds: number[];
}

export interface UsuarioCreate {
    nome: string;
    login: string;
    senha: string;
    tipoUsuario: string;
}