function emailMonitoramento(){
    let planilha  = SpreadsheetApp.getActiveSpreadsheet();
    let paginas   = planilha.getSheets();
    let monits    = paginas.filter(e => e.getName().indexOf("Monitoramento") != '-1');
      
    for(let e in monits){
      let dados   = monits[e].getRange("A1:V").getValues()
      let responsavel = "CONTROLADORIA"
      let unidade = monits[e].getName().split("_")[0]
  
  
      let destino = planilha.getSheetByName(monits[e].getName().split("_")[0]+"_Email");
      //let destino = planilha.getSheetByName("DESTINO")
  
      
      let novosDados = coletarMonit(dados,responsavel,unidade,destino);
  
      ajustarDestino(novosDados,destino);
  
      //estilizarDestino(destino);
  
      PREPARAR_ANEXOS(destino,monits[e].getName().split("_")[0]);
  
    }
  
  }
  
  
  function estilizarDestino(paginaDestino){
    let a = paginaDestino = SpreadsheetApp.getActiveSheet()
    let rangeTotal = paginaDestino.getRange(3,1,paginaDestino.getLastRow(),10);
  
  
    let b = a.getRange(3,1,a.getLastRow(),10);
    b.setBorder(true,true,true,true,true,true)
    b.setFontSize(11);
    b.setVerticalAlignment("middle")
    b.setHorizontalAlignment("center")
    
  
  }
  
  function ajustarDestino(dados,paginaDestino){
    let c = 1
    console.log(dados[1][6])
    let fdados = dados.filter(e => e[6] != 'REMOVER_LISTA')
  
    paginaDestino.getRange(3,2,paginaDestino.getLastRow(),9).clearContent()
  
    let range = paginaDestino.getRange(3,2,fdados.length,fdados[0].length)
    range.setValues(fdados)
  
    
  
    for(let lin=0;lin<fdados.length;lin++){
      paginaDestino.getRange(lin+3,1).setValue(c)
      if(fdados[lin][2]=='-'){
        paginaDestino.getRange(lin+3,1).setValue("-")
        paginaDestino.getRange(lin+3,9).setValue(null)
      } else {
      c+=1;
      }
    }
  }
  
  function coletarMonit(paginaDados,responsavel,unidade,destino){
    let totalPendencias = [];
    let colSituacao = paginaDados[0].indexOf("STATUS");
    let colAC = paginaDados[0].indexOf("A/C");
    let dadosJ01 = SpreadsheetApp.openById("1enRwRtXH1qrv5SWJbFB9KTIOfA2EvzylHe6jM7oSt08")
                  .getSheetByName("Pre_Contab").getRange("A2:Y").getValues()
    
    let pendentes = paginaDados.filter(
        e => e[colSituacao].toString().toUpperCase() === '0 - PENDENTE' 
        && e[0] !== '' 
        && e[colAC].toString().toUpperCase() == responsavel
        )  
    
    if(unidade == 'J01'){
      for(let a in dadosJ01){
        let pend  = dadosJ01[a][1];
        let cha   = dadosJ01[a][24];
        let nota  = dadosJ01[a][14];
  
        for(let e in pendentes){
          if(pend == true){
            if(pendentes[e][paginaDados[0].indexOf("Chave Acesso")] == cha){
              pendentes[e][colSituacao] = nota
            }
          }
          if(nota != '' && pend != true || pendentes[e][colSituacao]=='0 - Pendente'){
            if(pendentes[e][paginaDados[0].indexOf("Chave Acesso")] == cha){
              pendentes[e][colSituacao] = 'REMOVER_LISTA'
            }
          }
        }
      }
    }
  
  
    let aguardandoRecebimento = paginaDados.filter(
        e => e[colSituacao].toString().toUpperCase() === '1 - AGUARDANDO RECEBIMENTO'
        && e[0] !== '' 
        && e[colAC].toString().toUpperCase() == responsavel
        );
  
      let compararRecebimento = destino.getRange("C3:H").getValues()
      for(let e in compararRecebimento){
        let nota  = compararRecebimento[e][0];
        let descr = compararRecebimento[e][5];
  
  
        for(let k in aguardandoRecebimento){
          if(descr != '0 - Aguardando recebimento' && descr != ''){
            if(aguardandoRecebimento[k][paginaDados[0].indexOf("Nro.Docto.")] == nota){
              aguardandoRecebimento[k][colSituacao] = descr;
            }
          }
        }
  
        
      }
  
    let filtroPendentes = filtrarDadosMonit(pendentes,paginaDados[0]);
  
    let filtroRecebimento = filtrarDadosMonit(aguardandoRecebimento,paginaDados[0]);
  
    let divisor = [];
  
    for(let e in filtroPendentes[0]){
      if(filtroPendentes[0][e] == ''){
        divisor.push('-');
      }
      divisor.push('-');
    }
  
    totalPendencias.push(...filtroPendentes,divisor,...filtroRecebimento);
    
    //destinoDados.getRange(3,2,totalPendencias.length,totalPendencias[0].length).setValues(totalPendencias);
  
    return totalPendencias
  }
  
  function filtrarDadosMonit(dados,indice){
    let resultado = [];
    for(let e in dados){
      let data  = [];
      data.push(dados[e][indice.indexOf("Dt.Emissão")])
      let nf    = [];
      nf.push(dados[e][indice.indexOf("Nro.Docto.")])
      let serie = [];
      serie.push(dados[e][indice.indexOf("Serie")])
      let cod   = [];
      cod.push(dados[e][indice.indexOf("Código")])
      let forn  = [];
      forn.push(dados[e][indice.indexOf("Fornecedor")])
      let valor = [];
      valor.push(dados[e][indice.indexOf("Valor")])
      let st    = [];
      st.push(dados[e][indice.indexOf("STATUS")])
      let chave = [];
      chave.push(dados[e][indice.indexOf("Chave Acesso")])
      
      resultado.push([data,nf,serie,cod,forn,valor,st,null,chave])
    }
    return resultado
  }