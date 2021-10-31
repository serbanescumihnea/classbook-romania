document.addEventListener('DOMContentLoaded', () => {




  var btn2 = document.getElementsByClassName("stergereAbsenta");
  var modal2 = document.getElementById("modalStergereAbsenta");
  var span1 = document.getElementsByClassName("close")[1];
  var afisareMaterie2 = document.getElementById("afisareMaterie2");
  var inputMaterie2 = document.getElementById("inputMaterie2");
  var inputElev2 = document.getElementById("inputElev2");
  var inputData = document.getElementById("inputData");

  for (var i = 0; i < btn2.length; i++) {
    btn2[i].onclick = function() {
      modal2.style.display = "block";
      afisareMaterie2.innerHTML = this.parentNode.id.replace("tdNota-", "");
      inputMaterie2.value = afisareMaterie2.innerHTML;
      const urlParams = new URLSearchParams(window.location.search);
      const nume = urlParams.get('id');
      inputElev2.value = nume;
      document.getElementById("afisareData2").innerHTML = this.innerHTML;
      document.getElementById("afisareNume2").innerHTML = nume;
      inputData.value = document.getElementById("afisareData2").innerHTML;
    }
  }

  span1.onclick = function() {
    modal2.style.display = "none";
  }










  var btn = document.getElementsByClassName("adaugareAbsenta");
  var modal = document.getElementById("modalAdaugareAbsenta");
  var span2 = document.getElementsByClassName("close")[0];
  var afisareMaterie1 = document.getElementById("afisareMaterie1");
  var inputMaterie1 = document.getElementById("inputMaterie1");
  var inputElev1 = document.getElementById("inputElev1");

  for (var i = 0; i < btn.length; i++) {
    btn[i].onclick = function() {
      modal.style.display = "block";

      afisareMaterie1.innerHTML = this.parentNode.id.replace("tdButon-", "");
      inputMaterie1.value = afisareMaterie1.innerHTML;
      const urlParams = new URLSearchParams(window.location.search);
      const nume = urlParams.get('id');
      inputElev1.value = nume;

    }
  }


  span2.onclick = function() {
    modal.style.display = "none";
  }


  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    } else if (event.target == modal2) {
      modal2.style.display = "none";
    }
  }

  function myFunction(x) {
    if (x.matches) {
      document.getElementById("modalID").className = "modal-content w-75 p-3";
      document.getElementById("modalID2").className = "modal-content w-75 p-3";
    } else {
      document.getElementById("modalID").className = "modal-content w-25 p-3";
      document.getElementById("modalID2").className = "modal-content w-25 p-3";

    }
  }

  var x = window.matchMedia("(max-width: 700px)")
  myFunction(x)
  x.addListener(myFunction)
});
