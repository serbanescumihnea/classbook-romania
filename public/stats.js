


function schimbareClasa() {
  var objClasa = document.getElementById('clasa').value;

  var searchParams = new URLSearchParams(window.location.search);
  searchParams.set("clasa", objClasa);
  searchParams.set("elev", "all");
  window.location.search = searchParams.toString();

}

function schimbareElev() {
  var objElev = document.getElementById('elev').value;

  var searchParams = new URLSearchParams(window.location.search);
  searchParams.set("elev", objElev);
  window.location.search = searchParams.toString();
}

document.addEventListener('DOMContentLoaded', () => {







  var searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("clasa") == null) {
    document.getElementById("chart1").style.visibility = "hidden";
    document.getElementById("chart2").style.visibility = "hidden";
  } else {
    document.getElementById("chart1").style.visibility = "visible";
    document.getElementById("chart2").style.visibility = "visible";
  }
  var clasa_curenta = searchParams.get("clasa");
  if (clasa_curenta) {
    document.getElementById('clasa').value = clasa_curenta;
  }

  var elev_curent = searchParams.get("elev");
  if (elev_curent) {
    document.getElementById('elev').value = elev_curent;
  }

  if (document.getElementById("body2")) {
    var note = JSON.parse(document.getElementById("body2").getAttribute("data-server-scope"));
    note.sort(function (a, b) {
      return new Date(a.data) - new Date(b.data);
    });
    console.log(note);



    // CHART NOTE

    var months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    var date = []
    var medii = []
    var luna = null;
    var suma = 0;
    var count = 0;
    for (var i = 0; i < note.length; i++) {
      var dataObjLocal = new Date(note[i].data);

      if (dataObjLocal.getMonth() + 1 != luna) {
        date.push(months[dataObjLocal.getMonth()]);

        if (luna != null) {
          medii.push(parseFloat(suma / count));
          suma = 0 + parseInt(note[i].nota);
          count = 1;
          console.log(dataObjLocal.getMonth() + 1);
        }else  if (luna == null) {
          suma = suma + parseInt(note[i].nota);
          count++;
          console.log(dataObjLocal.getMonth() + 1);
          //console.log(note[i].nota);
        }
      } else {
        suma = suma + parseInt(note[i].nota);
        count++;
       console.log(dataObjLocal.getMonth() + 1);
        //console.log(note[i].nota);
      }
      luna = dataObjLocal.getMonth() + 1;
    }
    medii.push(parseFloat(suma / count));
    console.log(date);
    console.log(medii);
    // CHARTS

    var dateLabel = date;
    var lineChartData = {
      labels: dateLabel,
      datasets: [
        {
          borderColor: "green",
          fill: false,
          borderWidth: 3,
          pointBorderWidth: 7,
          pointHitRadius: 7,
          pointHoverBorderWidth: 7,
          pointRadius: 1,
          data: medii
        }
      ]
    }



    var chart0 = new Chart(document.getElementById("line-chart"), {
      type: 'line',
      data: lineChartData,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              min: 1,
              max: 10
            }
          }]
        },
        maintainAspectRatio: false,
        responsive: true,


        legend: { display: false },
        tooltips: { enabled: true },


      }
    })

  };


  // CHART ABSENTE !!!!!!!!!!! IMPORTANT !!!!!!!!!!!!!!
  if (document.getElementById("body3")) {
    var absente = JSON.parse(document.getElementById("body3").getAttribute("data-server-scope"));
  }
  absente.sort(function (a, b) {
    return new Date(a.data) - new Date(b.data);
  });

  console.log(absente)
  var count_absente = 0;
  var medii_absente = [];
  var date_absente = [];
  var luna = null;
  for (var i = 0; i < absente.length; i++) {
    var dataObjLocal = new Date(absente[i].data);

    if (dataObjLocal.getMonth() + 1 != luna) {
      date_absente.push(months[dataObjLocal.getMonth()]);

      if (luna != null) {
        medii_absente.push(count_absente);
        count_absente = 1;
        console.log(dataObjLocal.getMonth() + 1);
      } if (luna == null) {
        count_absente++;
        console.log(dataObjLocal.getMonth() + 1);
      }
    } else {
      count_absente++;
      console.log(dataObjLocal.getMonth() + 1);

    }
    luna = dataObjLocal.getMonth() + 1;
  }
  medii_absente.push(count_absente);
  count_absente = 0;

  var dateLabelAbsente = date_absente;
  console.log(dateLabelAbsente);
  console.log(medii_absente);
  var lineChartDataAbsente = {
    labels: dateLabelAbsente,
    datasets: [
      {
        borderColor: "red",
        fill: false,
        borderWidth: 3,
        pointBorderWidth: 7,
        pointHitRadius: 7,
        pointHoverBorderWidth: 7,
        pointRadius: 1,
        data: medii_absente
      }
    ]
  }




  var chart1 = new Chart(document.getElementById("line-chart-absente"), {
    type: 'line',
    data: lineChartDataAbsente,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            min: 0
          }
        }]
      },
      maintainAspectRatio: false,
      responsive: true,


      legend: { display: false },
      tooltips: { enabled: true },

    }
  })





});




