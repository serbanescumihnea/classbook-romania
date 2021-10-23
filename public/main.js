document.addEventListener('DOMContentLoaded', () => {

    var afisareMedie = document.getElementsByClassName("afisareMedie");





for(var i=0;i<afisareMedie.length;i++){
    var afisareNote = document.getElementById("tdNota-"+afisareMedie[i].id.replace("tdMedie-",""));
    console.log(afisareMedie[i].id.replace("tdMedie-",""));
    console.log(afisareNote);
  if(afisareNote.innerHTML!='~'){
    
    var arrNote = afisareNote.innerHTML.split(',');
    var medie = 0;
    
    for(var j =0;j<arrNote.length;j++){
      medie = medie + parseInt(arrNote[j]);
    }
    console.log(arrNote);
    medie = parseFloat(medie / arrNote.length).toFixed(2);
    afisareMedie[i].innerHTML = medie + " (" + Math.round(medie) +")";
    if(Math.round(medie)<5){
      afisareMedie[i].style = "color:red; ";
    }
    }
  }

});