import { OpcaoComplete } from "./opcao";

export interface Resposta {
    id : number;
    conteudo : string[];
    opcoesMarcadasIds : number[];
    idQuesito : number;
}

export class RespostaCreate {
    conteudo: string[];
    tipoResposta: String;

    constructor(conteudo: string[] = [],
                tipoResposta: String = '') 
    {
        this.conteudo = conteudo;
        this.tipoResposta = tipoResposta;
    }
}

export class RespostaComplete {
    id : number;
    conteudo : string[];
    opcoesMarcadas : OpcaoComplete[];
    idQuesito : number;
    tipoResposta : String;

    constructor(
        id: number = 0,
        conteudo: string[] = [],
        opcoesMarcadas: OpcaoComplete[] = [],
        idQuesito: number = 0,
        tipoResposta: String = ''
    ) {
        this.id = id;
        this.conteudo = conteudo;
        this.opcoesMarcadas = opcoesMarcadas;
        this.idQuesito = idQuesito;
        this.tipoResposta = tipoResposta;
    }
}