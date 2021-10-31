// Get the modal
document.addEventListener('DOMContentLoaded', () => {


  var modal = document.getElementById("myModal");


  var btn = document.getElementsByClassName("adaugareNota");

  var afisareMedie = document.getElementsByClassName("afisareMedie");




  var span = document.getElementsByClassName("close")[0];


  var afisareNume = document.getElementById("afisareNume");
  var afisareMaterie = document.getElementById("afisareMaterie");


  var inputMaterie = document.getElementById("inputMaterie");
  var inputElev = document.getElementById("inputElev");




  const d = new Date();



  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  afisareNume.innerHTML = id;

  document.getElementById("inputClasa").value = urlParams.get('class');



  for (var i = 0; i < btn.length; i++) {
    btn[i].onclick = function() {
      modal.style.display = "block";
      console.log(this.parentNode);
      afisareMaterie.innerHTML = this.id;
      inputMaterie.value = afisareMaterie.innerHTML;

    }
  }

  for (var i = 0; i < afisareMedie.length; i++) {
    var afisareNote = document.getElementById("tdNota-" + afisareMedie[i].id.replace("tdMedie-", ""));
    console.log(afisareMedie[i].id.replace("tdMedie-", ""));
    console.log(afisareNote);
    if (afisareNote.innerHTML != '~') {

      var arrNote = afisareNote.innerHTML.split(',');
      var medie = 0;

      for (var j = 0; j < arrNote.length; j++) {
        medie = medie + parseInt(arrNote[j]);
      }
      console.log(arrNote);
      medie = parseFloat(medie / arrNote.length).toFixed(2);
      afisareMedie[i].innerHTML = medie + " (" + Math.round(medie) + ")";
      if (Math.round(medie) < 5) {
        afisareMedie[i].style = "color:red; ";
      }
    }
  }





  span.onclick = function() {
    modal.style.display = "none";
  }


  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  function myFunction(x) {
    if (x.matches) {
      document.getElementById("modalID").className = "modal-content w-75 p-3";
    } else {
      document.getElementById("modalID").className = "modal-content w-25 p-3";
    }
  }

  var x = window.matchMedia("(max-width: 700px)")
  myFunction(x)
  x.addListener(myFunction)


  inputElev.value = afisareNume.innerHTML;

  console.log(window.location.href);
});
