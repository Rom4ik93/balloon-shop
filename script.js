/* script.js */
const products = [
    { 
        id: 1, 
        title: "Мото набор", 
        price: 1375, 
        cat: "boy", 
        img: "images/products/moto_nabor.jpg?v=2",
        description: "В набор входит:\n🏍️ Мотоцикл\n🎈 5 шариков хром\n🎀 Ленты в тон"
    },
    { 
        id: 2, 
        title: "Шарики с бантиками", 
        price: 190, 
        cat: "girl", 
        img: "images/products/shariki_s_bantikami.jpg?v=2",
        description: "В набор входит:\n🎈 5 шаров с гелием\n🎀 Декоративные бантики"
    },
    { 
        id: 3, 
        title: "Набор для братика и сестрёнки", 
        price: 2750, 
        cat: "boy", 
        img: "images/products/nabor_dlya_bratika_i_sestryonki.jpg?v=2",
        description: "В набор входит:\n👦 5 синих шаров\n👧 5 розовых шаров\n🎀 Ленты"
    },
    { 
        id: 4, 
        title: "Набор для неё", 
        price: 2100, 
        cat: "arches", 
        img: "images/products/nabor_dlya_nee.jpg?v=2",
        description: "В набор входит:\n🌸 10 розовых шаров\n🎀 Декоративные элементы"
    },
    { 
        id: 5, 
        title: "Набор для Него", 
        price: 2300, 
        cat: "figures", 
        img: "images/products/for_him_1.jpg?v=2",
        description: "В набор входит:\n🎈 10 шаров\n🎁 Фигура\n🎀 Ленты"
    },
    { 
        id: 6, 
        title: "Шары под потолок", 
        price: 1500, 
        cat: "helium", 
        img: "images/products/helium_1.jpg?v=2",
        description: "В набор входит:\n🎈 10 шаров с гелием\n🎀 Ленты в тон"
    },
    { 
        id: 7, 
        title: "Набор для принцессы", 
        price: 2200, 
        cat: "girl", 
        img: "images/products/nabor_princessa.jpg?v=2",
        description: "В набор входит:\n👸 10 розовых шаров\n👑 Фольгированная корона"
    },
    { 
        id: 8, 
        title: "Набор на выписку", 
        price: 3500, 
        cat: "baby", 
        img: "images/products/nabor_vypiska.jpg?v=2",
        description: "В набор входит:\n🎈 15 шаров с гелием\n🎁 Коробка"
    },
    { 
        id: 9, 
        title: "Свадебный набор", 
        price: 4500, 
        cat: "wedding", 
        img: "images/products/svadba_nabor.jpg?v=2",
        description: "В набор входит:\n💍 20 белых шаров\n✨ Серебряные акценты"
    },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentImageIndex = 0;
let visibleProducts = [];

const categoryNames = {
    'helium': 'Шары под потолок',
    'figures': 'Наборы для Него',
    'arches': 'Наборы для Неё',
    'boy': 'Набор для мальчика',
    'girl': 'Набор для девочки',
    'baby': 'Шары на выписку',
    'wedding': 'Шары на свадьбу',
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
                <p class="product-desc">${(product.description || '').replace(/\n/g, '<br>')}</p>
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

// ========== LIGHTBOX ДЛЯ ГАЛЕРЕИ (С НЕСКОЛЬКИМИ ФОТО) ==========

let galleryImageIndex = 0;
let currentGalleryItem = 0;

// Массив работ, у каждой работы несколько фото
const galleryWorks = [
    {
        title: "День Рождения",
        desc: "Фотозона в стиле 'Единорог'",
        images: [
            "images/gallery/birthday_1.jpg",
            "images/gallery/birthday_2.jpg",
            "images/gallery/birthday_3.jpg"
        ]
    },
    {
        title: "Свадьба",
        desc: "Органическая арка из 200 шаров",
        images: [
            "images/gallery/wedding_1.jpg",
            "images/gallery/wedding_2.jpg",
            "images/gallery/wedding_3.jpg"
        ]
    },
    {
        title: "Выписка из роддома",
        desc: "Набор в коробке с фольгированными шарами",
        images: [
            "images/gallery/baby_1.jpg",
            "images/gallery/baby_2.jpg",
            "images/gallery/baby_3.jpg"
        ]
    },
    {
        title: "Для мальчика",
        desc: "Синяя тематика",
        images: [
            "images/gallery/boy_1.jpg",
            "images/gallery/boy_2.jpg"
        ]
    },
    {
        title: "Для девочки",
        desc: "Розовая тематика",
        images: [
            "images/gallery/girl_1.jpg",
            "images/gallery/girl_2.jpg"
        ]
    },
    {
        title: "Шары на выписку",
        desc: "Разные варианты оформления",
        images: [
            "images/gallery/vypiska_1.jpg",
            "images/gallery/vypiska_2.jpg",
            "images/gallery/vypiska_3.jpg"
        ]
    }
];

function openGalleryLightbox(workIndex) {
    const modal = document.getElementById('galleryLightbox');
    const modalImg = document.getElementById('galleryLightboxImg');
    const caption = document.getElementById('galleryLightboxCaption');
    const counter = document.getElementById('galleryLightboxCounter');
    
    if (!modal) return;
    
    currentGalleryItem = workIndex;
    galleryImageIndex = 0;
    
    const work = galleryWorks[workIndex];
    const imgSrc = work.images[0];
    
    modalImg.src = imgSrc;
    caption.innerHTML = `<strong>${work.title}</strong><br>${work.desc}`;
    counter.textContent = `1 / ${work.images.length}`;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeGalleryLightbox() {
    const modal = document.getElementById('galleryLightbox');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function changeGalleryImage(direction) {
    const work = galleryWorks[currentGalleryItem];
    galleryImageIndex += direction;
    
    // Зацикливаем
    if (galleryImageIndex < 0) {
        galleryImageIndex = work.images.length - 1;
    } else if (galleryImageIndex >= work.images.length) {
        galleryImageIndex = 0;
    }
    
    const modalImg = document.getElementById('galleryLightboxImg');
    const caption = document.getElementById('galleryLightboxCaption');
    const counter = document.getElementById('galleryLightboxCounter');
    
    const imgSrc = work.images[galleryImageIndex];
    
    // Плавная смена
    modalImg.style.opacity = '0';
    setTimeout(() => {
        modalImg.src = imgSrc;
        counter.textContent = `${galleryImageIndex + 1} / ${work.images.length}`;
        modalImg.style.opacity = '1';
    }, 150);
}

// Закрытие галереи по клику вне картинки
window.onclick = function(event) {
    const modal = document.getElementById('galleryLightbox');
    if (event.target == modal) {
        closeGalleryLightbox();
    }
    
    const cartModal = document.getElementById('cartModal');
    if (event.target == cartModal) {
        closeCart();
    }
}

// Закрытие галереи по Esc и навигация стрелками
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeGalleryLightbox();
        closeLightbox();
        closeCart();
    }
    
    // Навигация по галерее стрелками
    if (document.getElementById('galleryLightbox').style.display === 'flex') {
        if (event.key === 'ArrowLeft') changeGalleryImage(-1);
        if (event.key === 'ArrowRight') changeGalleryImage(1);
    }
    
    // Навигация по товарам стрелками
    if (document.getElementById('imageModal').style.display === 'flex') {
        if (event.key === 'ArrowLeft') changeImage(-1);
        if (event.key === 'ArrowRight') changeImage(1);
    }
});

// ========== HERO СЛАЙД-ШОУ ==========

function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Меняем слайд каждые 5 секунд
    setInterval(nextSlide, 5000);
}

// Запускаем слайд-шоу при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Сайт загрузился!');
    initSlideshow();  // ← Добавил запуск слайд-шоу
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
