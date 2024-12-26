import { ItemOutput } from "./itemoutput";
import { OpcaoComplete } from "./opcao";
import { RespostaComplete } from "./resposta";

export interface Quesito {
    id: number;
    enunciado: string;
    obrigatorio: boolean;
    ordem: number;
    nivel: number;
    tipoResposta: string;
    superQuesitoId: number;
    secaoId: number;
    respostaId: number;
    opcoesHabilitadorasIds: number[];
    subQuesitosIds: number[];
    opcoesIds: number[];
}

export class QuesitoData implements Quesito {
    id: number;
    enunciado: string;
    obrigatorio: boolean;
    ordem: number;
    nivel: number;
    tipoResposta: string;
    superQuesitoId: number;
    secaoId: number;
    respostaId: number;
    opcoesHabilitadorasIds: number[];
    subQuesitosIds: number[];
    opcoesIds: number[];

    opcoes: any[];
    subQuesitos: any[];

    constructor(
        id: number = 0,
        enunciado: string = '',
        obrigatorio: boolean = false,
        ordem: number = 0,
        nivel: number = 0,
        tipoResposta: string = '',
        superQuesitoId: number = 0,
        secaoId: number = 0,
        respostaId: number = 0,
        opcoesHabilitadorasIds: number[] = [],
        subQuesitosIds: number[] = [],
        opcoesIds: number[] = [],
        opcoes: any[] = [],
        subQuesitos: any[] = []
    ) {
        this.id = id;
        this.enunciado = enunciado;
        this.obrigatorio = obrigatorio;
        this.ordem = ordem;
        this.nivel = nivel;
        this.tipoResposta = tipoResposta;
        this.superQuesitoId = superQuesitoId;
        this.secaoId = secaoId;
        this.respostaId = respostaId;
        this.opcoesHabilitadorasIds = opcoesHabilitadorasIds;
        this.subQuesitosIds = subQuesitosIds;
        this.opcoesIds = opcoesIds;
        this.opcoes = opcoes;
        this.subQuesitos = subQuesitos;
    }
}

export class QuesitoCreate {
    enunciado: string;
    tipoResposta: string;

    constructor(enunciado: string = '') {
        this.enunciado = enunciado;
        this.tipoResposta = 'DISSERTATIVA_CURTA';
    }
}

export class QuesitoUpdate {
    enunciado: string;
    obrigatorio: boolean;
    ordem: number;
    nivel: number;
    tipoResposta: string;

    constructor(enunciado: string = '', obrigatorio: boolean = false, ordem: number = 0, nivel: number = 0, tipoResposta: string = 'DISSERTATIVA_CURTA') {
        this.enunciado = enunciado;
        this.obrigatorio = obrigatorio;
        this.ordem = ordem;
        this.nivel = nivel;
        this.tipoResposta = tipoResposta;
    }
}

export class QuesitoComplete implements ItemOutput {
    id: number;
    tipoDeItem: string;
    numeracao: string;
    enunciado: string;
    obrigatorio: boolean;
    ordem: number;
    nivel: number;
    tipoResposta: string;
    superQuesitoId: number;
    secaoId: number;
    resposta: RespostaComplete;
    opcoesHabilitadorasIds: number[];
    subQuesitos: QuesitoComplete[];
    opcoes: OpcaoComplete[];

    constructor(
        id: number = 0,
        enunciado: string = '',
        obrigatorio: boolean = false,
        ordem: number = 0,
        nivel: number = 0,
        tipoResposta: string = '',
        superQuesitoId: number = 0,
        secaoId: number = 0,
        resposta: RespostaComplete = new RespostaComplete(),
        opcoesHabilitadorasIds: number[] = [],
        subQuesitos: QuesitoComplete[] = [],
        opcoes: OpcaoComplete[] = []
    ) {
        this.id = id;
        this.tipoDeItem = 'Quesito';
        this.numeracao = '';
        this.enunciado = enunciado;
        this.obrigatorio = obrigatorio;
        this.ordem = ordem;
        this.nivel = nivel;
        this.tipoResposta = tipoResposta;
        this.superQuesitoId = superQuesitoId;
        this.secaoId = secaoId;
        this.resposta = resposta;
        this.opcoesHabilitadorasIds = opcoesHabilitadorasIds;
        this.subQuesitos = subQuesitos;
        this.opcoes = opcoes;
    }
}