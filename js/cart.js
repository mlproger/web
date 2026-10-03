/**
 * Логика корзины: добавление, удаление, изменение количества,
 * пересчёт суммы и сохранение в localStorage.
 */

const CART_STORAGE_KEY = 'fishingCart';

/** Текущее состояние корзины: [{ id, quantity }] */
let cart = [];

/** Загрузка корзины из localStorage */
function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    if (!Array.isArray(stored)) return [];

    // Оставляем только известные товары с корректным количеством
    return stored.filter((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      return product && Number.isInteger(item.quantity) && item.quantity > 0;
    });
  } catch {
    return [];
  }
}

/** Сохранение корзины в localStorage */
function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/** Общее количество товаров в корзине */
function getCartCount(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

/** Итоговая стоимость корзины */
function getCartTotal(cartItems) {
  return cartItems.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

/** Добавить товар в корзину (или увеличить его количество) */
function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
}

/** Удалить товар из корзины полностью */
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);

  saveCart();
  renderCart();
}

/** Изменить количество товара (+/-), количество не может быть меньше 1 */
function changeQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity < 1) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  renderCart();
}

/** Очистить корзину (после оформления заказа) */
function clearCart() {
  cart = [];

  saveCart();
  renderCart();
}

/** Отрисовка списка корзины, счётчика и итоговой суммы */
function renderCart() {
  const list = document.getElementById('cartList');
  const empty = document.getElementById('cartEmpty');
  const total = document.getElementById('cartTotal');
  const count = document.getElementById('cartCount');

  if (!list || !empty || !total || !count) return;

  list.innerHTML = cart.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    const lineTotal = product.price * item.quantity;

    return `
      <li class="cart__item" data-id="${product.id}">
        <img class="cart__item-image" src="${product.image}" alt="${product.name}">
        <div class="cart__item-info">
          <p class="cart__item-title">${product.name}</p>
          <span class="cart__item-price">${lineTotal.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div class="cart__item-controls">
          <div class="quantity">
            <button class="quantity__btn" type="button" data-action="decrease" aria-label="Уменьшить количество">−</button>
            <span class="quantity__value">${item.quantity}</span>
            <button class="quantity__btn" type="button" data-action="increase" aria-label="Увеличить количество">+</button>
          </div>
          <button class="cart__item-remove" type="button" data-action="remove" aria-label="Удалить товар">×</button>
        </div>
      </li>
    `;
  }).join('');

  empty.hidden = cart.length > 0;
  total.textContent = `${getCartTotal(cart).toLocaleString('ru-RU')} ₽`;
  count.textContent = getCartCount(cart);
}

/** Открыть/закрыть панель корзины */
function toggleCart(open) {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('overlay');

  if (!panel || !overlay) return;

  panel.hidden = !open;
  overlay.hidden = !open;
  document.body.classList.toggle('is-locked', open);
}

/** Инициализация: подгрузка из localStorage и обработчики событий */
function initCart() {
  cart = loadCart();
  renderCart();

  const cartButton = document.getElementById('cartButton');
  const cartClose = document.getElementById('cartClose');
  const overlay = document.getElementById('overlay');
  const list = document.getElementById('cartList');
  const grid = document.getElementById('catalogGrid');

  cartButton?.addEventListener('click', () => toggleCart(true));
  cartClose?.addEventListener('click', () => toggleCart(false));
  overlay?.addEventListener('click', () => toggleCart(false));

  // Кнопки «В корзину» в каталоге
  grid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="add-to-cart"]');
    if (!button) return;

    const card = button.closest('[data-id]');
    addToCart(Number(card.dataset.id));
  });

  // Управление количеством и удаление внутри корзины
  list?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const item = button.closest('[data-id]');
    const productId = Number(item.dataset.id);

    switch (button.dataset.action) {
      case 'increase':
        changeQuantity(productId, 1);
        break;
      case 'decrease':
        changeQuantity(productId, -1);
        break;
      case 'remove':
        removeFromCart(productId);
        break;
    }
  });
}
