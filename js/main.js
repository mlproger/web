/**
 * Точка входа: рендер каталога и инициализация модулей.
 */

/** Рендер карточек товаров в #catalogGrid */
function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((product) => `
    <article class="card" data-id="${product.id}">
      <img class="card__image" src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="card__body">
        <span class="card__category">${product.category}</span>
        <h3 class="card__title">${product.name}</h3>
        <p class="card__description">${product.description}</p>
        <div class="card__footer">
          <span class="card__price">${product.price.toLocaleString('ru-RU')} ₽</span>
          <button class="btn btn--primary" type="button" data-action="add-to-cart">В корзину</button>
        </div>
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  initCheckout();
});
