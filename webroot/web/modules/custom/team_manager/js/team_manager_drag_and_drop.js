document.addEventListener('DOMContentLoaded', function () {
  console.log("Test Start");
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

  container.addEventListener('drop', function (e) {
    e.preventDefault();
    updateOrder();
  });

  function updateOrder() {
    const items = Array.from(container.querySelectorAll('.views-row')).map((item, index) => ({
      id: index + 1, // Verwende die Indexposition als ID
      weight: index
    }));

    fetch('/team-manager/update-weights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Entferne die Zeile für das CSRF-Token
      },
      body: JSON.stringify({ items })
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }

  console.log("Test Ende");
});
