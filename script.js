/* script.js */
const products = [
    { 
        id: 1, 
        title: "Мото набор", 
        price: 1375, 
        cat: "figures", 
        img: "images/products/moto_nabor.jpg"  // ← ПРЯМОЙ СЛЕШ /
    },
    { 
        id: 2, 
        title: "Нежно голубой набор", 
        price: 1950, 
        cat: "figures", 
        img: "images/products/nezhno_goluboj_nabor.jpg" 
    },
    { 
        id: 3, 
        title: "Шарики с бантиками", 
        price: 190, 
        cat: "helium", 
        img: "images/products/shariki_s_bantikami.jpg" 
    },
    { 
        id: 4, 
        title: "Набор для братика и сестрёнки", 
        price: 2750, 
        cat: "helium", 
        img: "images/products/nabor_dlya_bratika_i_sestryonki.jpg" 
    },
    { 
        id: 5, 
        title: "Фигура Единорог", 
        price: 1500, 
        cat: "figures", 
        img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80"  // ← УБРАЛ ПРОБЕЛЫ
    },
    { 
        id: 6, 
        title: "Гирлянда 'Радуга'", 
        price: 2100, 
        cat: "arches", 
        img: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=400&q=80"  // ← УБРАЛ ПРОБЕЛЫ
    },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Перевод категорий
const categoryNames = {
    'helium': 'Гелиевые',
    'figures': 'Фигуры',
    'arches': 'Арки',
    'decor': 'Декор'
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Рендер товаров только если мы на странице каталога или главной
    const grid = document.getElementById('productsGrid');
    if (grid) {
        renderProducts(products);
        setupFilters();
    }
});

// Рендеринг карточек
function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    
    // Версия для обхода кэша (меняй при обновлении картинок)
    const cacheVersion = 'v=2';
    
    grid.innerHTML = items.map(product => {
        const categoryName = categoryNames[product.cat] || product.cat;
        
        // Добавляем версию только к локальным картинкам
        let imgSrc = product.img;
        if (imgSrc.startsWith('images/')) {
            const separator = imgSrc.includes('?') ? '&' : '?';
            imgSrc = `${imgSrc}${separator}${cacheVersion}`;
        }
        
        return `
        <div class="product-card">
            <img src="${imgSrc}" class="product-img" alt="${product.title}" loading="lazy">
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
}

// Фильтрация
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.dataset.filter;
            if (category === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.cat === category);
                renderProducts(filtered);
            }
        });
    });
}

// Корзина
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    saveCart();
    updateCartCount();
    
    // Анимация кнопки
    const btn = event.currentTarget;
    btn.style.background = '#59C3C3';
    btn.style.color = 'white';
    setTimeout(() => {
        btn.style.background = '';
        btn.style.color = '';
    }, 300);
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
    openCart(); // Перерисовать модалку
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

// Мобильное меню
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Закрытие модалки по клику вне
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target == modal) closeCart();
}


