/*
    Aqui você poderá modificar as variáveis que controlarão as demais funções.
    Lembre-se de manter o mesmo padrão, conforme abaixo, para que tudo funcione corretamente.
*/

// Atalhos universais
const SS = SpreadsheetApp;
const DD = DriveApp;

const links_GLOBAIS = {
    monitoramento: SS.getActiveSpreadsheet(),
    posto_J01: "AAA",
    posto_J02: 'aaa',
    posto_EX1: "",
    posto_WM1: "",
    posto_WR1: '',
}

const referencias_GLOBAIS = {
    monitoramento   = 'Monitoramento',
    email           = 'Email',
    responsavel     = 'CONTROLADORIA',
    posto           = 'Pre_Contab'
}

const links_Pastas_Arquivos = {
    J01: "AAA",
    J02: "AAA",
    EX1: "AAA",
    WM1: "AAA",
    WR1: "AAA"
}

const ajustes_email = {
    lin_inicial = 3,
    col_inicial = 2,
    col_NF      = 3,
    col_anexos  = 10,
}