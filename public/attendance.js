
document.querySelectorAll("td").forEach(cell => {
  if (cell.className != 'name') {
    cell.addEventListener('click', () => {
      cell.innerHTML = 'present'
      cell.style.background = 'rgb(76, 157, 82)'
    })
  }
})

document.querySelectorAll("td").forEach(cell => {
  if (cell.className != 'name') {
    cell.addEventListener('dblclick', () => {
      cell.innerHTML = 'absent'
      cell.style.background = 'rgb(202, 144, 187)'
    })
  }
})

var button = document.querySelector('#button')
var names = document.querySelectorAll('.name')
let days = document.querySelectorAll('.days')
console.log(days[0].textContent)

button.addEventListener('click', () => {
  var data = {}
  names.forEach((name, i) => {
    var studentAttendance = document.querySelectorAll(`.${name.innerText.toLowerCase()}`)
    console.log("studentAttendance", studentAttendance);
    data[name.innerText] = {}
    studentAttendance.forEach((td, i) => {
      data[name.innerText][days[i].textContent] = td.innerText;
      data[name.innerText].index = i
      console.log(td.innerText);
    });
  });
  fetch('http://localhost:4444/updateattendance', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
  })
  setTimeout(() => {
    window.location.reload(true)
  }, 100)
})

let clear = document.getElementById('buttonClear')

clear.addEventListener('click', () => {
  var data = {}
  names.forEach((name, i) => {
    var studentAttendance = document.querySelectorAll(`.${name.innerText.toLowerCase()}`)
    console.log("studentAttendance", studentAttendance);
    data[name.innerText] = {}
    studentAttendance.forEach((td, i) => {
      data[name.innerText][days[i].textContent] = '';
      data[name.innerText].index = i
      console.log(td.innerText);
    });
  });
  fetch('http://localhost:4444/updateattendance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
  })
  setTimeout(() => {
    window.location.reload(true)
  }, 100)
})
