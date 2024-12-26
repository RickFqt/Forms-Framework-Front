import { OpcaoComplete } from "./opcao";

export interface Resposta {
    id : number;
    conteudo : string[];
    opcoesMarcadasIds : number[];
    idQuesito : number;
}

export class RespostaCreate {
    conteudo: string[];

    constructor(conteudo: string[] = []) {
        this.conteudo = conteudo;
    }
}

export class RespostaComplete {
    id : number;
    conteudo : string[];
    opcoesMarcadas : OpcaoComplete[];
    idQuesito : number;

    constructor(
        id: number = 0,
        conteudo: string[] = [],
        opcoesMarcadas: OpcaoComplete[] = [],
        idQuesito: number = 0
    ) {
        this.id = id;
        this.conteudo = conteudo;
        this.opcoesMarcadas = opcoesMarcadas;
        this.idQuesito = idQuesito;
    }
}