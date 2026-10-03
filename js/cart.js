/**
 * Логика корзины: добавление, удаление, изменение количества,
 * пересчёт суммы и сохранение в localStorage
 */

const CART_STORAGE_KEY = 'fishingCart';

/** Загрузка корзины из localStorage */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

/** Сохранение корзины в localStorage */
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/** Итоговая стоимость корзины */
function getCartTotal(cart) {
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}
