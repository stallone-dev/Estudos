const SS = SpreadsheetApp
let Pasta = ""

function PREPARAR_ANEXOS(Email,Origem){
  console.log('Início de execução - PREPARAR_ANEXOS')
  const pastas = [
      ["J01", "zzzz"],
      ["J02", "zzzz"],
      ["EX1", "zzzz"],
      ["WM1", "zzzz"],
      ["WR1", "zzzz"]
     ]
  let chave = ""
  for(let e in pastas){
    if(pastas[e][0]==Origem){
      chave = pastas[e][1]
    }
  }

  Pasta = DriveApp.getFolderById(chave).getFiles()

  AUX_BUSCAR_PDFS(Email,Pasta)
  AUX_ORGANIZAR_PDFS(Email)
}


function AUX_BUSCAR_PDFS(GUIA_DESTINO,Pasta){
  console.log('Executando - BUSCAR_PDFS')
  console.log('Preparando anexos da pasta '+GUIA_DESTINO.getName().toString())

  let c = 0
  while(Pasta.hasNext()){
    let PDF = Pasta.next()
    let PDF_NOME = PDF.getName().toString()
    let PDF_URL = PDF.getUrl()

    if(PDF_NOME.split(' ')[0] != 'NF'){
        PDF_NOME = PDF_NOME.split('.')[0]
      } else {
        PDF_NOME = PDF_NOME.split(' ')[1].split('.')[0]
      }

    console.log('Preparando Anexo: '+PDF_NOME)
  
    GUIA_DESTINO.getRange(c+3,30).setValue(PDF_NOME)
    GUIA_DESTINO.getRange(c+3,31).setValue(PDF_URL)
    c++
  }

  console.log('Finalizando - PREPARAR_PDFS')
}


function AUX_ORGANIZAR_PDFS(GUIA_DESTINO){
  console.log('Executando - ORGANIZAR_PDFS')
  console.log('Página '+GUIA_DESTINO+' em andamento')

  let NUM_NF = GUIA_DESTINO.getRange(3,3,500).getValues()
  let NOME_PDF = GUIA_DESTINO.getRange(3,30,500).getValues()
  let URL_PDF = GUIA_DESTINO.getRange(3,31,500).getValues() 

  for(let K=0;K<NUM_NF.length;K++){
    if(NUM_NF[K].toString() == ''){
      GUIA_DESTINO.getRange(3,30,GUIA_DESTINO.getLastRow(),2).clear()
      console.log('Página '+GUIA_DESTINO.getName()+' finalizada')
      break
    }

    console.log('Organizando PDF '+NUM_NF[K])

    for(let J=0; J<NOME_PDF.length;J++){
      if(NUM_NF[K].toString() == NOME_PDF[J].toString().split(".")[0]){
        let ANEXO = SS.newRichTextValue()
          .setText('ANEXO')
          .setLinkUrl(URL_PDF[J])
          .build()
        GUIA_DESTINO.getRange(K+3,10).setRichTextValue(ANEXO)
        console.log('...ANEXADO!')
      }
    }
  }
}

