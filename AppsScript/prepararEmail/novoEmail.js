
function prepararEmailsMonitoramento(pasta_arquivos, somenteUmEmail){
    console.warn("Inicializando - PREPARAR_EMAILS")

    const planilha  = links_GLOBAIS.monitoramento;

    const paginasMonit = planilha.getSheets().filter( 
        e => e.getName().indexOf(referencias_GLOBAIS.monitoramento) !== '-1' 
        );

    if(somenteUmEmail === true){
        
    } else { 

        // Loop pelas páginas do monitoramento
        for(const pagina in paginasMonit){




        }
    }
}