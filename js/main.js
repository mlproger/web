/**
 * Точка входа: рендер каталога, фильтры, сортировка, инициализация модулей.
 */

/** Активный фильтр по категории */
let activeCategory = 'all';

/** Режим сортировки */
let sortMode = 'default';

/** Отфильтрованный и отсортированный список товаров */
function getVisibleProducts() {
  let list = PRODUCTS.filter(
    (product) => activeCategory === 'all' || product.category === activeCategory
  );

  switch (sortMode) {
    case 'price-asc':
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case 'name':
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      break;
    default:
      break;
  }

  return list;
}

/** Рендер карточек товаров в #catalogGrid */
function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  const empty = document.getElementById('catalogEmpty');
  if (!grid) return;

  const products = getVisibleProducts();

  grid.innerHTML = products.map((product) => `
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

  if (empty) empty.hidden = products.length > 0;
}

/** Обработчики фильтров и сортировки */
function initCatalog() {
  const filters = document.getElementById('filters');
  const sortSelect = document.getElementById('sortSelect');

  filters?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;

    activeCategory = button.dataset.category;

    filters.querySelectorAll('.filter').forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    renderCatalog();
  });

  sortSelect?.addEventListener('change', () => {
    sortMode = sortSelect.value;
    renderCatalog();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  initCatalog();
  initCart();
  initCheckout();
});
