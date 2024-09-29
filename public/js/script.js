document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/items')
        .then(response => response.json())
        .then(items => {
            const itemsContainer = document.getElementById('items-container');
            items.forEach(item => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${item.imagePath}" alt="${item.name}" class="product-image">
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>
                    <button class="add-to-cart">Add to Cart</button>
                `;
                itemsContainer.appendChild(productCard);
            });
        });
});
