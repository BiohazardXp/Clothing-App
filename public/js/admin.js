function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('token', data.token);
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('admin-section').style.display = 'block';
            loadItems();
        } else {
            alert('Login failed');
        }
    });
}

function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemImage = document.getElementById('itemImage').value;

    fetch('/api/admin/addItem', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ itemName, itemPrice, itemImage })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Item added successfully');
            loadItems();
        } else {
            alert('Failed to add item');
        }
    });
}

function loadItems() {
    fetch('/api/items')
        .then(response => response.json())
        .then(items => {
            const itemsContainer = document.getElementById('all-items');
            itemsContainer.innerHTML = '';
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
}

// public/js/script.js
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/items')
        .then(response => response.json())
        .then(items => {
            const itemsContainer = document.getElementById('items-container');
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'product-card';
                itemElement.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}" class="product-image">
                    <h3 class="product-title">${item.name}</h3>
                    <p class="product-price">$${item.price}</p>
                    <button class="add-to-cart">Add to Cart</button>
                `;
                itemsContainer.appendChild(itemElement);
            });
        });
});
