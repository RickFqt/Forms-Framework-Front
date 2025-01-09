import { SecaoComplete } from "./secao";

export interface Formulario {
    id: number;
    nome: string;
    descricao: string;
    finalizado: boolean;
    ehPublico: boolean;
    ehTemplate: boolean;
    usuarioId: number;
    secoesIds: number[];
}

export class FormularioData implements Formulario {
    id: number;
    nome: string;
    descricao: string;
    finalizado: boolean;
    ehPublico: boolean;
    ehTemplate: boolean;
    usuarioId: number;
    secoesIds: number[];

    secoes: any[];

    constructor(
        id: number,
        nome: string,
        descricao: string,
        finalizado: boolean,
        ehPublico: boolean,
        ehTemplate: boolean,
        usuarioId: number,
        secoesIds: number[],
        secoes: any[] = []
    ) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.finalizado = finalizado;
        this.ehPublico = ehPublico;
        this.ehTemplate = ehTemplate;
        this.usuarioId = usuarioId;
        this.secoesIds = secoesIds;
        this.secoes = secoes;
    }
}

export class FormularioComplete {
    id: number;
    nome: string;
    descricao: string;
    finalizado: boolean;
    ehPublico: boolean;
    ehTemplate: boolean;
    usuarioId: number;
    secoes: SecaoComplete[];
    feedbackLLM: string;

    constructor(
        id: number = 0,
        nome: string = '',
        descricao: string = '',
        finalizado: boolean = false,
        ehPublico: boolean = false,
        ehTemplate: boolean = false,
        usuarioId: number = 0,
        secoes: SecaoComplete[] = [],
        feedbackLLM: string = ''
    ) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.finalizado = finalizado;
        this.ehPublico = ehPublico;
        this.ehTemplate = ehTemplate;
        this.usuarioId = usuarioId;
        this.secoes = secoes;
        this.feedbackLLM = feedbackLLM;
    }
}