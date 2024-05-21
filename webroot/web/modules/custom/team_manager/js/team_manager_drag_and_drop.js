document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.view-content.gin-layer-wrapper');

  //Event-Listener für Drag-Over-Ereignis
  container.addEventListener('dragover', function (e) {
    e.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const currentElement = e.target;

    // Überprüfen, ob das aktuelle Element ein gültiges Ziel ist
    if (draggingElement && currentElement !== draggingElement && currentElement.classList.contains('views-row')) {
      const nextElement = (currentElement === draggingElement.nextElementSibling) ? currentElement.nextElementSibling : currentElement;
      container.insertBefore(draggingElement, nextElement);
    }
  });

  // Event-Listener für Drop-Ereignis
  container.addEventListener('drop', function (e) {
    e.preventDefault();
    updateOrder();
  });

  // Funktion zum Aktualisieren der Reihenfolge der Elemente
  function updateOrder() {
    const items = Array.from(container.querySelectorAll('.views-row')).map((item, index) => ({
      id: item.dataset.id, // ID des Elements
      weight: index // Indexposition als Gewicht
    }));

    // AJAX-Anfrage zum Aktualisieren der Gewichte
    fetch('/team-manager/update-weights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items })
    })
      .then(response => response.json())
      .then(data => console.log(data)); // Loggt die Antwort des Servers in der Konsole
  }
});
