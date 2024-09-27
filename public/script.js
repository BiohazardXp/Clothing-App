let cart = [];
let totalPrice = 0;

// Dummy admin credentials
const adminCredentials = {
    username: "admin",
    password: "password123"
};

function addToCart(item, price) {
    cart.push({ item, price });
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    cartItems.innerHTML = '';
    totalPrice = 0;

    cart.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.item} - $${product.price.toFixed(2)}`;
        cartItems.appendChild(listItem);
        totalPrice += product.price;
    });

    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

function addNewItem() {
    const itemName = document.getElementById('item-name').value;
    const itemPrice = parseFloat(document.getElementById('item-price').value);
    const itemImage = document.getElementById('item-image').value;

    const productList = document.getElementById('product-list');
    const newProduct = document.createElement('div');
    newProduct.classList.add('product');
    
    newProduct.innerHTML = `
        <img src="${itemImage}" alt="${itemName}">
        <h3>${itemName}</h3>
        <p>$${itemPrice.toFixed(2)}</p>
        <button onclick="addToCart('${itemName}', ${itemPrice})">Add to Cart</button>
    `;

    productList.appendChild(newProduct);

    document.getElementById('admin-form').reset();
}

function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Hide login form and show admin panel
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin').style.display = 'block';
    } else {
        // Display error message
        document.getElementById('login-error').style.display = 'block';
    }
}
