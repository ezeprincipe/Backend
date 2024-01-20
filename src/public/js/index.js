const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
});

// Function to render the products table:
const renderProducts = (products) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        // Add button to delete product:
        card.innerHTML = `
                <p>Id ${item.id} </p>
                <p>Title ${item.title} </p>
                <p>Price ${item.price} </p>
                <button> Delete Product </button>
        `;
        productsContainer.appendChild(card);

        // Add delete product event:
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id);
        });
    });
}

// Delete product function:
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

// Add product:

document.getElementById("btnSend").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };

    socket.emit("addProduct", product);
};
