function teste(){

    let ss = SpreadsheetApp;
    let sheet = ss.getActiveSpreadsheet();
    let pages = sheet.getSheets();
    
    let ignorados = [];
    let coletados = [];
    
    
    for(let e in pages){
      let page = pages[e];
    
      if(page.getName().indexOf("BD") != '-1'){
    
        let valores = page.getRange("B3:K20").getValues();
    
        let b = valores.filter(function(a){if(a[9]=='ignorar'){return a}})
        ignorados.push(...b)
    
        let c = valores.filter(function(a){if(a[9]=='COLETAR'){return a}})
        coletados.push(...c)
    
      }
    
    }
    
    ignorados = ignorados.sort((a,b) => a[1]-b[1]);
    coletados = coletados.sort((a,b) => a[1]-b[1]);
    
    let divisor = [];
    for(let e in ignorados[0]){
      divisor.push('-')
    }
    
    let total = [];
    total.push(...ignorados,divisor,...coletados)
    
    let destino = sheet.getSheetByName("teste")
    let range = destino.getRange(1,1,total.length,total[0].length)
    
    range.setValues(total)
    
    }