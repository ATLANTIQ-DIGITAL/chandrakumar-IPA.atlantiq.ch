document.addEventListener('DOMContentLoaded', function () {
  console.log('test1');
  const container = document.querySelector('.view-content.gin-layer-wrapper');

  container.addEventListener('dragover', function (e) {
    e.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const currentElement = e.target;

    if (draggingElement && currentElement !== draggingElement && currentElement.classList.contains('views-row')) {
      const nextElement = (currentElement === draggingElement.nextElementSibling) ? currentElement.nextElementSibling : currentElement;
      container.insertBefore(draggingElement, nextElement);
    }
  });
  console.log('test2');
  container.addEventListener('drop', function (e) {
    e.preventDefault();
    updateOrder();
  });
  console.log('test3');
  function updateOrder() {
    const items = Array.from(container.querySelectorAll('.views-row')).map((item, index) => ({
      id: item.dataset.id, // ID des Elements
      weight: index // Indexposition als Gewicht
    }));

    // AJAX-Anfrage senden
    fetch('/team-manager/update-weights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items })
    })
      .then(response => response.json())
      .then(data => console.log(data));
    console.log('test4');
  }
});
