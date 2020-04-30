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
//
var button = document.querySelector('#submit')
var names = document.querySelectorAll('.name')
var days = document.querySelectorAll('.days')


button.addEventListener('click', () => {
  console.log(days);
  let filteredDays = Array.from(days).filter(day =>  day.innerHTML )
  console.log(filteredDays);
  var data = {}
  filteredDays.forEach((day) => {
    data[day.dataset.id] = (day.dataset.day + " " + day.innerHTML).split(' ')
  });
  let userId = Object.keys(data)
  let dayId = Object.values(data)
  console.log(data);
  fetch('/newatt', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
      'userIdOne': userId[0],
      'userIdTwo': userId[1],
      'userIdThree': userId[2],
      'userIdFour': userId[3],
      'userIdFive': userId[4],
      'userIdSix': userId[5],
      'userIdSeven': userId[6],
      'userIdEight': userId[7],
      'dayId': dayId[0][0],
      'attendanceOne': dayId[0][1],
      'attendanceTwo': dayId[1][1],
      'attendanceThree': dayId[2][1],
      'attendanceFour': dayId[3][1],
      'attendanceFive': dayId[4][1],
      'attendanceSix': dayId[5][1],
      'attendanceSeven': dayId[6][1],
      'attendanceEight': dayId[7][1],
    })
	})
  .then(response => {
    console.log(response, 'this is res');
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
  })
  setTimeout(() => {
    window.location.reload(true)
  }, 100)
})

let clear = document.querySelector('#clear')
clear.addEventListener('click', () => {
  let data = {}
  fetch('/clearatt', {
		method: 'delete',
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
