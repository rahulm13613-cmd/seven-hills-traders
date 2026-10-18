// Seven Hills Traders - Supabase connection

const SUPABASE_URL = "https://gnmtqcgxvmncteoklwow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_6c22BLLqV5Wx-h1NqXeVkg_hTgymJEP";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase connected successfully!");

// Load product information from Supabase
async function loadProducts() {
    const { data, error } = await supabaseClient
        .from("products")
        .select("name, category, description, price");

    if (error) {
        console.error("Could not load products:", error.message);
        return;
    }

    console.log("Products loaded from Supabase:", data);

    const databaseProducts = document.getElementById("database-products");

    if (!databaseProducts) {
        console.error("Product display area not found.");
        return;
    }

    databaseProducts.innerHTML = "";

    const existingCards = document.querySelectorAll(
        ".product-grid > .product-card"
    );

    data.forEach((product) => {
        // Hide the unwanted Pipe card
        if (String(product.name || "").trim().toLowerCase() === "pipe") {
            return;
        }

        // Check whether this product already has a card in HTML
        const existingCard = Array.from(existingCards).find((card) => {
            const heading = card.querySelector("h3");

            return heading &&
                heading.textContent.trim().toLowerCase() ===
                String(product.name || "").trim().toLowerCase();
        });

        if (existingCard) {
            const description = existingCard.querySelector(
                ".product-info > p:not(.product-category)"
            );

            if (description && product.description) {
                description.textContent = product.description;
            }

            return;
        }

        // Create a new card for products from Supabase
        const card = document.createElement("div");
        card.className = "product-card";

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category || "Product";

        const heading = document.createElement("h3");
        heading.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.description || "";

        info.append(category, heading, description);

        if (product.price !== null && product.price !== "") {
            const price = document.createElement("p");
            price.textContent = `Price: ${product.price}`;
            info.appendChild(price);
        }

        card.appendChild(info);
        databaseProducts.appendChild(card);
    });
}

loadProducts();