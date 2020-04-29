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
      window.location.reload()
    })
  });
});

Array.from(completed).forEach(function(element) {
  element.addEventListener('click', function() {

    const message = this.parentNode.childNodes[7].innerText
    let completed = false
    if(element.checked !== completed){
      completed = !completed
    }
    fetch('/completedStatus', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          'message': message,
          'completed': completed
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
