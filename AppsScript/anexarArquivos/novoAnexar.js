function gerarAnexos(planilha_email,pasta_arquivos){
    
    console.log(`Inicializando - GERAR_ANEXOS`);

    //Alinhando pasta com o email de destino
    let pasta = '';
    Object.keys(pasta_arquivos).forEach((item) => 
        {
            item == planilha_email.getName() ? pasta = pasta_arquivos[item] : '';
        });

    pasta = DD.getFolderById(pasta).getFiles(); // Coletando arquivos

    const matrizLinks = auxBuscarLinks(pasta);  // Coletando matriz de nomes + links

    auxOrganizarLinks(matrizLinks, planilha_email); // Comparando nomes e organizando links na planilha de destino
    
    console.log('Finalizando - GERAR_ANEXOS');
}



/**
 * Função para coletar links e atribuí-los a uma matriz simples.
 * @param {String} pasta_arquivos ID da pasta contendo os arquivos
 * @returns {Array<String>} Matriz contendo os links em URL.
 */
function auxBuscarLinks(pasta_arquivos){
    console.warn("Inicializando - BUSCAR_LINKS");

    let matrizLinks = [];

    while(pasta_arquivos.hasNext()){
        let arquivo = pasta_arquivos.next();
        let nomeArquivo = arquivo.getName().split('.')[0];
        let linkArquivo = arquivo.getUrl();

        matrizLinks.push([nomeArquivo,linkArquivo]);
    }

    console.log(matrizLinks[1]);
    console.log("Finalizando - BUSCAR_LINKS");

    return matrizLinks
}



/**
 * Função para comparar os arquivos presentes na Matriz com os nomes encontrados na planilha e anexar os links nela.
 * 
 * @param {Array<String>} matriz_links Matriz 2-D contendo os nomes e URLS.
 * @param {String} planilha_destino Planilha de destino dos arquivos.
 */
function auxOrganizarLinks(matriz_links, planilha_destino){
    console.warn('Inicializando - ORGANIZAR_LINKS');
    console.log(`Trabalhando em: ${planilha_destino.getName()}`);

    const colunaNFs = planilha_destino.getRange(
            ajustes_email.lin_inicial, ajustes_email.col_NF, planilha_destino.getLastRow()
        )

    for(const lin in colunaNFs){
        
        if(colunaNFs[lin] === null){
            console.log(`Planilha ${planilha_destino.getName()} finalizada`)
        }

        for(const item in matriz_links){

            if(matriz_links[item][0] == colunaNFs[lin].toString()){
                const anexo = SS.newRichTextValue()
                    .setText('ANEXO')
                    .setLinkUrl(matriz_links[item][1])
                    .build()

                planilha_destino.getRange(lin + ajustes_email.lin_inicial, ajustes_email.col_anexos).setRichTextValue(anexo)

                console.log(`NF ${colunaNFs[lin].getName()} ANEXADA!`)
            }

        } // Fim 2º loop

    } // Fim 1º loop

    console.log('Finalizando - ORGANIZAR_LINKS')
}