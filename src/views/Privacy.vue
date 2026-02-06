<template>
  <div class="privacy-policy">
    <h1>Privacy Policy</h1>
    <p>At Dearluv, your privacy is important to us. This page explains what data we collect and how we use it.</p>

    <section>
      <h2>Information We Collect</h2>
      <p>When you use Dearluv, we may collect:</p>
      <ul>
        <li>Your email address (if you choose to provide it for notifications or premium features).</li>
        <li>Payment information for subscription or purchases (processed securely via Paystack).</li>
        <li>Details you provide to generate personalized poems (names, descriptions, photos).</li>
        <li>Usage data such as pages visited and actions taken within the app.</li>
      </ul>
    </section>

    <section>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To generate personalized poems and deliver your requested content.</li>
        <li>To process payments securely through our payment provider.</li>
        <li>To improve Dearluv and personalize your experience.</li>
        <li>To communicate updates, promotions, or support messages (if you opted in).</li>
      </ul>
    </section>

    <section>
      <h2>Data Sharing</h2>
      <p>We do not sell or share your personal information with third parties except:</p>
      <ul>
        <li>With our payment processor (Paystack) to complete transactions.</li>
        <li>When required by law.</li>
      </ul>
    </section>

    <section>
      <h2>Security</h2>
      <p>We take reasonable steps to protect your data. Payments are handled securely by Paystack, and any sensitive information is encrypted.</p>
    </section>

    <section>
      <h2>Cookies</h2>
      <p>Dearluv may use cookies and similar technologies to improve your experience and track usage.</p>
    </section>

    <section>
      <h2>Changes to This Policy</h2>
      <p>We may update this privacy policy from time to time. Changes will be reflected on this page.</p>
    </section>

    <section>
      <h2>Contact Us</h2>
      <p>If you have any questions about our privacy practices, you can contact us at <a href="mailto:hello@dearluv.ng">hello@dearluv.ng</a>.</p>
    </section>
  </div>
</template>

<style scoped>
.privacy-policy {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: var(--font-serif);
  color: var(--color-ink);
  line-height: 1.8;
}

.privacy-policy h1 {
  font-size: 3rem;
  color: var(--color-rose-dark);
  margin-bottom: 1.5rem;
  text-align: center;
}

.privacy-policy h2 {
  font-size: 1.75rem;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: var(--color-rose);
}

.privacy-policy p, .privacy-policy li {
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.privacy-policy ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.privacy-policy a {
  color: var(--color-rose-dark);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .privacy-policy {
    padding: 2rem 1rem;
  }

  .privacy-policy h1 {
    font-size: 2rem;
  }

  .privacy-policy h2 {
    font-size: 1.5rem;
  }
}
</style>
