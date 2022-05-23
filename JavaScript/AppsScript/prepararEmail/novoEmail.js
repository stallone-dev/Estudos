
function prepararEmailsMonitoramento(pasta_arquivos, somente_Um_Email){
    console.warn("Inicializando - PREPARAR_EMAILS")

    const planilha  = links_GLOBAIS.monitoramento;

    const paginasMonit = planilha.getSheets().filter( 
        e => e.getName().indexOf(referencias_GLOBAIS.monitoramento) !== '-1'
        );

    function ativadorEmailsMonit(fonte){
        const dadosBrutos   = fonte.getDataRange().getValues();
        const responsavel   = referencias_GLOBAIS.responsavel;
        const unidade       = fonte.getName().split("_")[0];
        const destino       = planilha.getSheetByName(`${unidade}_${referencias_GLOBAIS.email}`);

        const matrizDados = auxColetarDadosMonit(dadosBrutos, responsavel, unidade, destino);

        auxOrganizarDadosMonit(matrizDados, destino);

        gerarAnexos(destino, pasta_arquivos);
    }

    if(somente_Um_Email === true){ 

        const monit = paginasMonit.filter(
            e => e.getName().indexOf(SS.getActiveSheet().getName().split("_")[0]) !== '-1'
            );

        ativadorEmailsMonit(monit);
        
    } else { 

        // Loop pelas páginas do monitoramento
        for(const e in paginasMonit){
            
            ativadorEmailsMonit(paginasMonit[e]);

        }
    }
}



function auxColetarDadosMonit(fonte_dados, destino_dados, identificador, responsavel){

    const posicoes = {
        data:           fonte_dados[0].indexOf('Dt.Emissão'),
        NF:             fonte_dados[0].indexOf('Nro.Docto.'),
        serie:          fonte_dados[0].indexOf('Serie'),
        codFornecedor:  fonte_dados[0].indexOf('Código'),
        nomeFornecedor: fonte_dados[0].indexOf('Fornecedor'),
        valorNF:        fonte_dados[0].indexOf('Valor'),
        situacaoNF:     fonte_dados[0].indexOf('STATUS'),
        chaveNF:        fonte_dados[0].indexOf('Chave Acesso'),
        aosCuidados:    fonte_dados[0].indexOf('A/C')
    }

    const dadosPOSTOS = {
        J01: SS.openByUrl(links_GLOBAIS.posto_J01).getSheetByName(referencias_GLOBAIS.posto).getDataRange().getValues(),
        J02: SS.openByUrl(links_GLOBAIS.posto_J02).getSheetByName(referencias_GLOBAIS.posto).getDataRange().getValues(),
        EX1: SS.openByUrl(links_GLOBAIS.posto_EX1).getSheetByName(referencias_GLOBAIS.posto).getDataRange().getValues(),
        WM1: SS.openByUrl(links_GLOBAIS.posto_WM1).getSheetByName(referencias_GLOBAIS.posto).getDataRange().getValues(),
        WR1: SS.openByUrl(links_GLOBAIS.posto_WR1).getSheetByName(referencias_GLOBAIS.posto).getDataRange().getValues(),
    }

    const matrizPendencias = [];


    let pendentes = fonte_dados.filter(
        e => e[posicoes.situacaoNF].toString().toUpperCase() === '0 - PENDENTE' 
        && e[0] !== '' 
        && e[posicoes.aosCuidados].toString().toUpperCase() == responsavel
        );  


    let recebimento = fonte_dados.filter(
        e => e[posicoes.situacaoNF].toString().toUpperCase() === '1 - AGUARDANDO RECEBIMENTO' 
        && e[0] !== '' 
        && e[posicoes.aosCuidados].toString().toUpperCase() == responsavel
        );  


    if(identificador == 'J01'){
        const postoJ01      = dadosPOSTOS.J01;
        const colNFJ01      = postoJ01[0].indexOf('NF');
        const colCHAVEJ01   = postoJ01[0].indexOf('Chave');
        const obsJ01        = postoJ01[0].indexOf('Situação');
        const colPendJ01    = postoJ01[0].indexOf('Pendente?');

        for(const lin in postoJ01){
            const pend  = postoJ01[lin][colPendJ01];
            const chave = postoJ01[lin][colCHAVEJ01];
            const obs   = postoJ01[lin][obsJ01];
            const nota  = postoJ01[lin][colNFJ01]

            for(const e in pendentes){
                
                if(pend == true){
                    pendentes[e][posicoes.chaveNF] == chave ? pendentes[e][posicoes.situacaoNF] = obs : ''
                }

                if(obs != '' && pend != trye || pendentes[e][posicoes.situacaoNF] == '0 - Pendente'){
                    pendentes[e][posicoes.chaveNF] == chave ? pendentes[e][posicoes.situacaoNF] = 'REMOVER' : ''
                }
             }

        } // Fim loop Posto

    } // Fim loop J01


    const compararRecebimento = destino_dados.getDataRange().getValues();
    const posicoesDestino = {
        NF:     compararRecebimento[0].indexOf('Nota Fiscal'),
        status: compararRecebimento[0].indexOf('Situação')
    }

    for(const e in compararRecebimento){
        const nota   = compararRecebimento[e][posicoesDestino.NF];
        const status = compararRecebimento[e][posicoesDestino.status]

        for(const lin in recebimento){
            if(status != '0 - Aguardando recebimento' && status != ''){
                recebimento[lin][posicoes.NF] == nota ? recebimento[lin][posicoes.situacaoNF] = status : ''
            }

        }

    }


    function filtarMonit(dados, indice){
        let resultado = [];
        for(const e in dados){
            Object.keys(posicoes).forEach((item) =>{
                resultado.push([dados[e][posicoes[item]]])
            })
        }
    }



}