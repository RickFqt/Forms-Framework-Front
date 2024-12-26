import { ItemOutput } from "./itemoutput";

export interface Secao {
    id: number;
    titulo: string;
    ordem: number;
    nivel: number;
    subSecoesIds: number[];
    superSecaoId: number;
    prontuarioId: number;
    quesitosIds: number[];
}

export class SecaoData implements Secao {
    id: number;
    titulo: string;
    ordem: number;
    nivel: number;
    subSecoesIds: number[];
    superSecaoId: number;
    prontuarioId: number;
    quesitosIds: number[];

    quesitos: any[];
    subSecoes: any[];

    constructor(
        id: number = 0,
        titulo: string = '',
        ordem: number = 0,
        nivel: number = 0,
        subSecoesIds: number[] = [],
        superSecaoId: number = 0,
        prontuarioId: number = 0,
        quesitosIds: number[] = [],
        quesitos: any[] = [],
        subSecoes: any[] = []
    ) {
        this.id = id;
        this.titulo = titulo;
        this.ordem = ordem;
        this.nivel = nivel;
        this.subSecoesIds = subSecoesIds;
        this.superSecaoId = superSecaoId;
        this.prontuarioId = prontuarioId;
        this.quesitosIds = quesitosIds;
        this.quesitos = quesitos;
        this.subSecoes = subSecoes;
    }
}

export class SecaoCreate {
    titulo: string;

    constructor(titulo: string = '') {
        this.titulo = titulo;
    }
}

export class SecaoUpdate {
    titulo: string;
    ordem: number;
    nivel: number;

    constructor(titulo: string = '', ordem: number = 0, nivel: number = 0) {
        this.titulo = titulo;
        this.ordem = ordem;
        this.nivel = nivel;
    }
}

export class SecaoComplete implements ItemOutput {
    id: number;
    tipoDeItem: string;
    numeracao: string;
    titulo: string;
    ordem: number;
    nivel: number;
    subItens: ItemOutput[]
    superSecaoId: number;
    prontuarioId: number;

    constructor(
        id: number = 0,
        tipoDeItem: string = '',
        numeracao: string = '',
        titulo: string = '',
        ordem: number = 0,
        nivel: number = 0,
        subItens: (ItemOutput)[] = [],
        superSecaoId: number = 0,
        prontuarioId: number = 0
    ) {
        this.id = id;
        this.tipoDeItem = tipoDeItem;
        this.numeracao = numeracao;
        this.titulo = titulo;
        this.ordem = ordem;
        this.nivel = nivel;
        this.subItens = subItens;
        this.superSecaoId = superSecaoId;
        this.prontuarioId = prontuarioId;
    }
}