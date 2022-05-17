
function prepararEmailsMonitoramento(pasta_arquivos, somenteUmEmail){
    console.warn("Inicializando - PREPARAR_EMAILS")

    const planilha  = links_GLOBAIS.monitoramento;

    if(somenteUmEmail === true){
        
    } else { 

        const paginasMonit = planilha.getSheets().filter( 
            e => e.getName().indexOf(referencias_GLOBAIS.monitoramento) !== '-1' 
            );

        // Loop pelas páginas do monitoramento
        for(const e in paginasMonit){
            
            const dadosBrutos   = paginasMonit[e].getDataRange().getValues();
            const responsavel   = referencias_GLOBAIS.responsavel;
            const unidade       = paginasMonit[e].getName().split("_")[0];
            const destino       = planilha.getSheetByName(`${unidade}_${referencias_GLOBAIS.email}`);

            const matrizDados = auxColetarDadosMonit(dadosBrutos, responsavel, unidade, destino);

            auxOrganizarDadosMonit(matrizDados, destino);


        }
    }
}