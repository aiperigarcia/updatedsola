const completed = document.getElementsByClassName("checkbox")
const trash = document.getElementsByClassName('trash');

Array.from(trash).forEach(function(element) {
  element.prevent
  element.addEventListener('click', function() {
    const homeworkType = this.parentNode.childNodes[1].innerText
    const message = this.parentNode.childNodes[3].innerText
    fetch('/homework', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'homeworkType': homeworkType,
        'message': message
      })
    }).then(function(response) {
      console.log(response)
      window.location.reload(true)
    })
  });
});

Array.from(completed).forEach(function(element) {
  element.addEventListener('click', function() {
    let userId = document.querySelector('#studentId').getAttribute("data-id")
    const message = this.parentNode.childNodes[9].innerText
    let checked = false
    if(element.checked !== checked){
      checked = 'checked'
    }
    fetch('/completedStatus', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'studentId': userId,
          'message': message,
          'completed': checked
        })
      })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        window.location.reload()
      })
  });
})

let add = document.querySelector("#addToList")


add.addEventListener('click', function(e) {
  e.preventDefault()
  let userId = document.querySelector('#teacherId').getAttribute("data-teacher")
  let day = document.querySelector('#inputDay').value
  let task = document.querySelector('#inputTask').value
  let message = document.querySelector('#listItem').value
  fetch('/homework', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userId': userId,
        'day': day,
        'homeworkType': task,
        'message': message
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data);
    })
    setTimeout(() => {
      window.location.reload(true)
    }, 100)
});
