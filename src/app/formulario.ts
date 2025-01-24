import { SecaoComplete } from "./secao";

export interface Formulario {
    id: number;
    nome: string;
    descricao: string;
    finalizado: boolean;
    respondido: boolean;
    ehPublico: boolean;
    ehTemplate: boolean;
    usuarioId: number;
    secoesIds: number[];
    instanciasFormularioIds: number[];
    formularioPaiId: number;
}
export interface DadosPessoaisIngresso {
    // String dataCompra,
    // String sobreEvento,
    // Boolean ehMeiaEntrada,
    // DadosPessoaisIngresso dadosPessoais,
    // String sugestaoLLM   
    nomeTitular: string;
    cpfTitular: string;
    idadeTitular: string;
}
export interface InfoIngresso {
    // String dataCompra,
    // String sobreEvento,
    // Boolean ehMeiaEntrada,
    // DadosPessoaisIngresso dadosPessoais,
    // String sugestaoLLM   
    dataCompra: string;
    sobreEvento: string;
    ehMeiaEntrada: boolean;
    dadosPessoais: DadosPessoaisIngresso;
    sugestaoLLM: string;
}

export class FormularioData implements Formulario {
    id: number;
    nome: string;
    descricao: string;
    finalizado: boolean;
    respondido: boolean;
    ehPublico: boolean;
    ehTemplate: boolean;
    usuarioId: number;
    secoesIds: number[];
    instanciasFormularioIds: number[];
    formularioPaiId: number;

    secoes: any[];

    constructor(
        id: number = 0,
        nome: string = '',
        descricao: string = '',
        finalizado: boolean = false,
        respondido: boolean = false,
        ehPublico: boolean = false,
        ehTemplate: boolean = false,
        usuarioId: number = 0,
        secoesIds: number[] = [],
        secoes: any[] = [],
        instanciasFormularioIds: number[] = [],
        formularioPaiId: number = 0
    ) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.finalizado = finalizado;
        this.respondido = respondido;
        this.ehPublico = ehPublico;
        this.ehTemplate = ehTemplate;
        this.usuarioId = usuarioId;
        this.secoesIds = secoesIds;
        this.secoes = secoes;
        this.instanciasFormularioIds = instanciasFormularioIds;
        this.formularioPaiId = formularioPaiId;
    }
}

export class FormularioComplete {
    id: number;
    nome: string;
    descricao: string;
    finalizado: boolean;
    respondido: boolean;
    ehPublico: boolean;
    ehTemplate: boolean;
    usuarioId: number;
    secoes: SecaoComplete[];
    feedbackLLM: string;
    instanciasFormularioIds: number[];
    formularioPaiId: number;

    constructor(
        id: number = 0,
        nome: string = '',
        descricao: string = '',
        finalizado: boolean = false,
        respondido: boolean = false,
        ehPublico: boolean = false,
        ehTemplate: boolean = false,
        usuarioId: number = 0,
        secoes: SecaoComplete[] = [],
        feedbackLLM: string = '',
        instanciasFormularioIds: number[] = [],
        formularioPaiId: number = 0
    ) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.finalizado = finalizado;
        this.respondido = respondido;
        this.ehPublico = ehPublico;
        this.ehTemplate = ehTemplate;
        this.usuarioId = usuarioId;
        this.secoes = secoes;
        this.feedbackLLM = feedbackLLM;
        this.instanciasFormularioIds = instanciasFormularioIds;
        this.formularioPaiId = formularioPaiId;
    }
}