/* SONIQ One - JavaScript del prototipo académico.
   Integraciones reales requieren IDs, cuentas y pruebas de cada proveedor. */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const PRICE = 399900;
  let quantity = 1;
  let cartCount = 0;
  let consentState = { analytics: false, experience: false };
  const toast = $('#toast');

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  // GTM/GA4 event scaffold. Once GTM is installed, events can be mapped to GA4 tags.
  function track(eventName, params = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
    // Useful for testing in the browser console; remove if not needed in production.
    console.debug('[SONIQ analytics demo]', eventName, params);
  }

  $$('[data-analytics="cta_click"]').forEach(el => {
    el.addEventListener('click', () => track('cta_click', { cta_name: el.dataset.ctaName || 'unnamed_cta', cta_text: el.textContent.trim() }));
  });

  const productObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.viewTracked) {
        entry.target.dataset.viewTracked = 'true';
        track('view_item', { item_id: 'soniq_one', item_name: 'SONIQ One', price: PRICE, currency: 'COP' });
      }
    });
  }, { threshold: 0.35 });
  const productSection = $('#comprar');
  if (productSection && 'IntersectionObserver' in window) productObserver.observe(productSection);

  const quantityOutput = $('#quantityOutput');
  const quantityInput = $('#quantity');
  function setQuantity(value) {
    quantity = Math.min(5, Math.max(1, value));
    quantityOutput.value = quantity;
    quantityOutput.textContent = quantity;
    quantityInput.value = quantity;
  }
  $('#qtyMinus').addEventListener('click', () => setQuantity(quantity - 1));
  $('#qtyPlus').addEventListener('click', () => setQuantity(quantity + 1));

  function updateCartSummary() {
    $('#cartCount').textContent = cartCount;
    $('#cartSummary').textContent = cartCount
      ? `${cartCount} unidad(es) en tu bolsa · Total demostrativo: ${(cartCount * PRICE).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}. No se realiza ningún cobro.`
      : 'Tu bolsa está vacía.';
  }
  $('#addToCart').addEventListener('click', () => {
    cartCount += quantity;
    updateCartSummary();
    track('add_to_cart', { currency: 'COP', value: PRICE * quantity, items: [{ item_id: 'soniq_one', item_name: 'SONIQ One', price: PRICE, quantity }] });
    showToast('Producto añadido a la bolsa de demostración.');
  });
  function beginCheckout() {
    if (!cartCount) { showToast('Agrega SONIQ One a la bolsa primero.'); return; }
    track('begin_checkout', { currency: 'COP', value: PRICE * cartCount, items: [{ item_id: 'soniq_one', item_name: 'SONIQ One', price: PRICE, quantity: cartCount }] });
    $('#orderForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Checkout de demostración iniciado; no hay pagos reales.');
  }
  $('#headerCart').addEventListener('click', beginCheckout);

  // Lead form: demo only. Replace with HubSpot embedded form or Forms API workflow.
  $('#orderForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const name = $('#fullName').value.trim();
    const email = $('#email').value.trim();
    const phone = $('#phone') ? $('#phone').value.trim() : '';
    const contactReason = $('#contactReason') ? $('#contactReason').value : 'unspecified';
    if (!$('#privacyConsent').checked) return;
    track('generate_lead', { form_name: 'soniq_order_interest', method: 'website_demo', interest_type: contactReason });
    $('#formMessage').textContent = `Gracias, ${name}. Recibimos tu solicitud de demostración. No se envió a HubSpot.`;
    form.reset();
    showToast('Formulario validado en modo demostración.');
    console.info('Demo lead; no data transmitted:', { name, email, phone, contactReason });
  });

  $('#newsletterForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    track('newsletter_signup_demo', { form_name: 'soniq_newsletter' });
    $('#newsletterMessage').textContent = '¡Gracias! Este registro es demostrativo y no se ha guardado en una plataforma externa.';
    event.currentTarget.reset();
  });

  // FAQ event: use a single listener per details element.
  $$('.faq-list details').forEach((details, index) => {
    details.addEventListener('toggle', () => {
      if (details.open) track('faq_open', { faq_index: index + 1, faq_question: $('summary', details).textContent.trim() });
    });
  });

  // Feedback survey UI demo. Configure an actual survey in Contentsquare separately.
  const feedbackModal = $('#feedbackModal');
  function openFeedback() { feedbackModal.hidden = false; $('#feedbackRating').focus(); }
  function closeFeedback() { feedbackModal.hidden = true; }
  $('#feedbackTab').addEventListener('click', openFeedback);
  $('#openFeedback').addEventListener('click', openFeedback);
  $('#closeFeedback').addEventListener('click', closeFeedback);
  feedbackModal.addEventListener('click', e => { if (e.target === feedbackModal) closeFeedback(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFeedback(); });
  $('#feedbackForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    track('feedback_submit_demo', { rating: $('#feedbackRating').value });
    $('#feedbackMessage').textContent = '¡Gracias! Esta respuesta solo se muestra en este prototipo; no se envió a Contentsquare.';
    event.currentTarget.reset();
  });

  // Consent banner demo. localStorage stores the choice on this browser only.
  const cookieBanner = $('#cookieBanner');
  function applyConsent(analytics, experience) {
    consentState = { analytics, experience };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'consent_preferences_updated',
      analytics_consent: analytics ? 'granted' : 'denied',
      experience_consent: experience ? 'granted' : 'denied'
    });
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    try { localStorage.setItem('soniqConsentDemo', JSON.stringify(consentState)); } catch (_) {}
    cookieBanner.hidden = true;
    showToast('Preferencias de demostración guardadas en este navegador.');
  }
  let savedConsent = null;
  try { savedConsent = JSON.parse(localStorage.getItem('soniqConsentDemo') || 'null'); } catch (_) {}
  if (savedConsent && typeof savedConsent.analytics === 'boolean') consentState = savedConsent;
  else cookieBanner.hidden = false;
  $('#acceptCookies').addEventListener('click', () => applyConsent(true, true));
  $('#rejectCookies').addEventListener('click', () => applyConsent(false, false));
  $('#cookieSettings').addEventListener('click', () => { cookieBanner.hidden = false; });
  // Note: a production CMP should control actual script loading. This UI alone is not a certified CMP.

  // Responsive navigation.
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  $('#year').textContent = new Date().getFullYear();
  updateCartSummary();
})();
