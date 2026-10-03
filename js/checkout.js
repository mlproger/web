/**
 * Форма оформления заказа: открытие модального окна,
 * проверка полей, сообщение «Заказ создан!».
 */

function initCheckout() {
  const modal = document.getElementById('checkoutModal');
  const form = document.getElementById('checkoutForm');
  const success = document.getElementById('orderSuccess');
  const openButton = document.getElementById('checkoutButton');
  const closeButton = document.getElementById('checkoutClose');
  const cartPanel = document.getElementById('cartPanel');
  const overlay = document.getElementById('overlay');

  if (!modal || !form || !openButton) return;

  const inputs = Array.from(form.querySelectorAll('input[required]'));

  /** Пометить поле как невалидное */
  function setError(input) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
  }

  /** Убрать пометку об ошибке */
  function clearError(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }

  /** Проверка одного поля: непустое, телефон — минимум 10 цифр */
  function isValid(input) {
    const value = input.value.trim();
    if (!value) return false;
    if (input.type === 'tel') {
      return value.replace(/\D/g, '').length >= 10;
    }
    return true;
  }

  /** Открыть форму оформления заказа */
  function openModal() {
    if (cartPanel) cartPanel.hidden = true;
    if (overlay) overlay.hidden = false;

    modal.hidden = false;
    document.body.classList.add('is-locked');
    success.hidden = true;
    inputs.forEach(clearError);

    inputs[0]?.focus();
  }

  /** Закрыть форму оформления заказа */
  function closeModal() {
    modal.hidden = true;
    if (overlay) overlay.hidden = true;
    document.body.classList.remove('is-locked');
  }

  /** Закрыть всё, что открыто поверх страницы */
  function closeTopLayer() {
    if (!modal.hidden) {
      closeModal();
      return;
    }
    if (cartPanel && !cartPanel.hidden) {
      cartPanel.hidden = true;
      if (overlay) overlay.hidden = true;
      document.body.classList.remove('is-locked');
    }
  }

  openButton.addEventListener('click', openModal);
  closeButton?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeTopLayer);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeTopLayer();
  });

  // Снимаем ошибку, как только пользователь начинает исправлять поле
  inputs.forEach((input) => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const valid = inputs.map(isValid);
    inputs.forEach((input, index) => {
      if (valid[index]) clearError(input);
      else setError(input);
    });

    if (valid.includes(false)) return;

    // Заказ оформлен: показываем сообщение и очищаем корзину
    success.hidden = false;
    clearCart();
    form.reset();
  });
}
