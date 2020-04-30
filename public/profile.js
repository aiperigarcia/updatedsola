let add = document.querySelectorAll('.fa-plus-square')
const teacher = document.querySelector('.teacherEmail').innerText

Array.from(add).forEach(function(element) {
  element.addEventListener('click', function() {
    const parentId = this.parentNode.parentNode.childNodes[1].innerText
    console.log(parentId, 'parentId');
    const parent = this.parentNode.parentNode.childNodes[3].innerText
    console.log(parent, 'parent Name');
    Promise.all([
      fetch('/addparent', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'parent': parent,
            'parentId': parentId,
            'teacher': teacher
          })
        }),
        fetch('/addteacher', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'parent': parent,
              'parentId': parentId,
              'teacher': teacher
            })
          })
    ]).then(response => {
        if (response.ok) return response.json()
      }).then(data => {
        window.location.reload()
      })
  });
})
