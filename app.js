function formatPLN(value) {
  const num = parseFloat(value.replace(/\s/g, '').replace(',', '.'));
  if (isNaN(num)) return '';
  return num.toLocaleString('pl-PL');
}

function unformatPLN(value) {
  return value.replace(/\s/g, '').replace(',', '.');
}

['deposit', 'bonds', 'ikze'].forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener('blur', () => {
    input.value = formatPLN(input.value);
  });
  input.addEventListener('focus', () => {
    input.value = unformatPLN(input.value);
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js')
      .then(function (reg) {
        console.log('Zarejestrowano SW:', reg.scope);
      })
      .catch(function (err) {
        console.log('Błąd rejestracji SW:', err);
      });
  });
}

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const deposit = parseFloat(unformatPLN(document.getElementById("deposit").value));
  const bonds = parseFloat(unformatPLN(document.getElementById("bonds").value));
  const ikze = parseFloat(unformatPLN(document.getElementById("ikze").value));
  const depositReturn = parseFloat(document.getElementById("depositReturn").value);
  const bondsReturn = parseFloat(document.getElementById("bondsReturn").value);
  const ikzeReturn = parseFloat(document.getElementById("ikzeReturn").value);

  const total = deposit + bonds + ikze;

  if (isNaN(deposit) || isNaN(bonds) || isNaN(ikze) || total <= 0) {
    alert("Wprowadź poprawne wartości. Suma portfela musi być większa niż 0.");
    return;
  }

  const totalReturn = (
    ((deposit * depositReturn) +
     (bonds * bondsReturn) +
     (ikze * ikzeReturn)) / total
  ).toFixed(2);

  const formattedDeposit = deposit.toLocaleString("pl-PL");
  const formattedBonds = bonds.toLocaleString("pl-PL");
  const formattedIkze = ikze.toLocaleString("pl-PL");

  document.getElementById("result").innerHTML =
    `<strong>Łączna stopa zwrotu: ${totalReturn}%</strong><br>` +
    `Depozyt: ${formattedDeposit} PLN<br>` +
    `Fundusz: ${formattedBonds} PLN<br>` +
    `IKZE: ${formattedIkze} PLN`;

  const ctx = document.getElementById("pieChart").getContext("2d");

  if (window.pieChart instanceof Chart) {
    window.pieChart.destroy();
  }

  window.pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Depozyt", "Fundusz obligacyjny", "IKZE"],
      datasets: [{
        data: [deposit, bonds, ikze],
        backgroundColor: ["#3498db", "#2ecc71", "#f39c12"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || "";
              const value = context.parsed;
              const formatted = value.toLocaleString("pl-PL");
              return `${label}: ${formatted} PLN`;
            }
          }
        }
      }
    }
  });
});
