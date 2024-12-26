export interface Opcao {
    id: number;
    textoAlternativa: string;
    ordem: number;
    quesitoId: number;
}

export class OpcaoComplete {
    id: number;
    textoAlternativa: string;
    ordem: number;
    quesitoId: number;

    constructor(
        id: number = 0,
        textoAlternativa: string = '',
        ordem: number = 0,
        quesitoId: number = 0,
        quesitosHabilitadosIds: number[] = []
    ) {
        this.id = id;
        this.textoAlternativa = textoAlternativa;
        this.ordem = ordem;
        this.quesitoId = quesitoId;
    }
}

export class OpcaoCreate {
    textoAlternativa: string;
    ordem: number;

    constructor(textoAlternativa: string = '', ordem : number = 0) {
        this.textoAlternativa = textoAlternativa;
        this.ordem = 0;
    }
}

export class OpcaoUpdate {
    textoAlternativa: string;
    ordem: number;

    constructor(textoAlternativa: string = '', ordem : number = 0) {
        this.textoAlternativa = textoAlternativa;
        this.ordem = 0;
    }
}