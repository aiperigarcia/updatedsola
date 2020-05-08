fetch('progressChart', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    let student = data.map(e => e.student )
    console.log(student)
    let grade = data.map(e => Number(e.grade) )
    console.log(grade);
    let myChart = document.getElementById('myChart').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let grades = new Chart(myChart, {
      type: 'bar',
      data: {
        labels: student,
        datasets: [{
          label: 'Grade',
          data: grade,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(0, 0, 128, 0.7)',
            'rgba(0, 128, 0, 0.7)',
            'rgba(128, 0, 128, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 181, 197, 0.6)',
            'rgba(131, 111, 255, 0.6)',
            'rgba(156, 102, 131, 0.6)',
            'rgba(113, 113, 198, 0.6)'
          ],
          borderWidth: 1,
          borderColor: '#777',
          hoverBorderWidth: 3,
          hoverBorderColor: '#000'
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Final Grade',
          fontSize: 25
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            fontColor: '#000'
          }
        },
        layout: {
          padding: {
            left: 50,
            right: 0,
            bottom: 0,
            top: 0
          }
        },
        tooltips: {
          enabled: true
        }
      }
    });
  })
  .catch(err => {
    console.log(err);
  })
