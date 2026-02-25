/* script.js */
const products = [
    { 
        id: 1, 
        title: "Мото набор", 
        price: 1375, 
        cat: "figures", 
        img: "images/products/moto_nabor.jpg?v=2",
        description: "В набор входит:\nМотоцикл\n5 шариков хром"
    },
    { 
        id: 2, 
        title: "Нежно голубой набор", 
        price: 1950, 
        cat: "figures", 
        img: "images/products/nezhno_goluboj_nabor.jpg?v=2",
        description: "В набор входит:\nЦифра\nФонтан из 7 шаров"
    },
    { 
        id: 3, 
        title: "Шарики с бантиками", 
        price: 1330, 
        cat: "helium", 
        img: "images/products/shariki_s_bantikami.jpg?v=2",
        description: "Фонтан из 7 Шаров с бантиками"
    },
    { 
        id: 4, 
        title: "Набор для братика и сестрёнки", 
        price: 2750, 
        cat: "helium", 
        img: "images/products/nabor_dlya_bratika_i_sestryonki.jpg?v=2",
        description: "В набор входит:\nЕдинорог\n13 шариков"
    },
    { 
        id: 5, 
        title: "Фигура Единорог", 
        price: 1500, 
        cat: "figures", 
        img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80",
        description: "Фольгированный единорог, 60 см"
    },
    { 
        id: 6, 
        title: "Гирлянда 'Радуга'", 
        price: 2100, 
        cat: "arches", 
        img: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=400&q=80",
        description: "Гирлянда из 30 шаров, 3 метра"
    },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentImageIndex = 0;
let visibleProducts = [];

const categoryNames = {
    'helium': 'Гелиевые',
    'figures': 'Фигуры',
    'arches': 'Арки',
    'decor': 'Декор'
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Сайт загрузился!');
    updateCartCount();
    
    const grid = document.getElementById('productsGrid');
    if (grid) {
        console.log('✅ Сетка товаров найдена!');
        renderProducts(products);
        setupFilters();
    } else {
        console.error('❌ Сетка товаров не найдена!');
    }
});

function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if(!grid) {
        console.error('productsGrid не найден!');
        return;
    }
    
    visibleProducts = items;
    const cacheVersion = 'v=2';
    
    console.log(`📦 Рендерим ${items.length} товаров`);
    
    grid.innerHTML = items.map((product, index) => {
        const categoryName = categoryNames[product.cat] || product.cat;
        
        let imgSrc = product.img;
        if (imgSrc.startsWith('images/')) {
            const separator = imgSrc.includes('?') ? '&' : '?';
            imgSrc = `${imgSrc}${separator}${cacheVersion}`;
        }
        
        return `
        <div class="product-card">
            <img src="${imgSrc}" 
                 class="product-img" 
                 alt="${product.title}" 
                 loading="lazy"
                 style="cursor: pointer;"
                 onclick="openLightbox(${index})">
            <div class="product-info">
                <div class="product-cat">${categoryName}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.description || ''}</p>
                <div class="product-footer">
                    <span class="price">${product.price} ₽</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
    
    console.log('✅ Товары отрисованы!');
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.dataset.filter;
            console.log(`Фильтр: ${category}`);
            
            if (category === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.cat === category);
                renderProducts(filtered);
            }
        });
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    saveCart();
    updateCartCount();
    alert(`✅ ${product.title} добавлен в корзину!`);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if(countEl) countEl.innerText = cart.length;
}

function openCart() {
    const modal = document.getElementById('cartModal');
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    
    if(!modal) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Корзина пуста</p>';
        totalEl.innerText = '0 ₽';
    } else {
        let total = 0;
        container.innerHTML = cart.map((item, index) => {
            total += item.price;
            return `
                <div class="cart-item">
                    <span>${item.title}</span>
                    <span>${item.price} ₽ <i class="fas fa-trash" style="color:red; cursor:pointer; margin-left:10px;" onclick="removeFromCart(${index})"></i></span>
                </div>
            `;
        }).join('');
        totalEl.innerText = total + ' ₽';
    }
    
    modal.style.display = 'flex';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    openCart();
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if(modal) modal.style.display = 'none';
}

function submitOrder(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert('Сначала добавьте товары в корзину!');
        return;
    }
    alert('Спасибо! Заказ оформлен. Менеджер свяжется с вами.');
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// ========== LIGHTBOX ==========

function openLightbox(index) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    if (!modal) {
        console.error('Lightbox не найден!');
        return;
    }
    
    currentImageIndex = index;
    const product = visibleProducts[index];
    
    modalImg.src = product.img;
    caption.textContent = product.title;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    console.log('🖼️ Lightbox открыт');
}

function closeLightbox() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = visibleProducts.length - 1;
    } else if (currentImageIndex >= visibleProducts.length) {
        currentImageIndex = 0;
    }
    
    const product = visibleProducts[currentImageIndex];
    const modalImg = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    modalImg.style.opacity = '0';
    setTimeout(() => {
        modalImg.src = product.img;
        caption.textContent = product.title;
        modalImg.style.opacity = '1';
    }, 150);
}

window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
        closeLightbox();
    }
    
    const cartModal = document.getElementById('cartModal');
    if (event.target == cartModal) {
        closeCart();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLightbox();
        closeCart();
    }
    
    if (document.getElementById('imageModal').style.display === 'flex') {
        if (event.key === 'ArrowLeft') changeImage(-1);
        if (event.key === 'ArrowRight') changeImage(1);
    }
});
