document.getElementById('parentsName').addEventListener('change', function() {
  console.log('You selected: ', this.value);
  fetch('/messages/:parentId', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        
      })
    })
});
