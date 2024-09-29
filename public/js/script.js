document.addEventListener("DOMContentLoaded", () => {
  fetch('/api/items')
      .then(response => response.json())
      .then(items => {
          const itemsContainer = document.getElementById('items-container');
          items.forEach(item => {
              const itemElement = document.createElement('div');
              itemElement.innerHTML = `
                  <h3>${item.name}</h3>
                  <p>Price: $${item.price}</p>
                  <img src="${item.imageUrl}" alt="${item.name}" style="width: 150px;">
              `;
              itemsContainer.appendChild(itemElement);
          });
      });
});
