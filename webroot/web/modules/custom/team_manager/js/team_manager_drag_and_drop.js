console.log("Test message after delay");
document.addEventListener('DOMContentLoaded', function () {
  console.log("Test message after delay");
  setTimeout(function() {
    console.log("Test message after delay");

    const container = document.querySelector('.view-content.gin-layer-wrapper');
    let draggableElements = document.querySelectorAll('.views-row');

    draggableElements.forEach(elem => {
      elem.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', e.target.id);
      });
    });
    console.log("Test message after delay");
    container.addEventListener('dragover', function (e) {
      e.preventDefault();
      let activeElement = container.querySelector('.dragging');
      let currentElement = e.target;
      let isMoveable = activeElement !== currentElement && currentElement.classList.contains('views-row');
      console.log("Test message after delay");
      if (!isMoveable) {
        return;
      }
      console.log("Test message after delay");
      let nextElement = (currentElement === activeElement.nextElementSibling) ? currentElement.nextElementSibling : currentElement;
      container.insertBefore(activeElement, nextElement);
    });

    container.addEventListener('drop', function (e) {
      e.preventDefault();
      updateOrder();
    });
    console.log("Test message after delay");
    function updateOrder() {
      let items = Array.from(container.querySelectorAll('.views-row')).map((item, index) => ({
        id: item.getAttribute('data-id'), // Stelle sicher, dass jedes Element eine `data-id` hat, die der Node-ID entspricht
        weight: index
      }));
      fetch('/team-manager/update-weights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({items})
      })
        .then(response => response.json())
        .then(data => console.log(data));
    }
    console.log("Test message after delay");
  }, 3000); // Verzögerung von 1000 Millisekunden (1 Sekunde)
});
console.log("Test message after delay");
