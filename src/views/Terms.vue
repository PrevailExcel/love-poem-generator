<template>
  <div class="terms-page">
    <h1>Terms & Conditions</h1>
    <p>Welcome to Dearluv! By using our website and services, you agree to these terms. Please read them carefully.</p>

    <section>
      <h2>1. Using Dearluv</h2>
      <p>Dearluv allows you to create personalized poems based on the details you provide. You may use the service for personal, non-commercial purposes only.</p>
    </section>

    <section>
      <h2>2. Account & Payments</h2>
      <p>No account is required for free features. If you choose to subscribe or make purchases, payments are processed securely via Paystack. You are responsible for providing accurate payment information.</p>
    </section>

    <section>
      <h2>3. Content Ownership</h2>
      <p>You retain ownership of any content you provide to create poems. By using Dearluv, you grant us permission to use your content to generate poems and provide the service.</p>
    </section>

    <section>
      <h2>4. Prohibited Use</h2>
      <p>You agree not to use Dearluv to:</p>
      <ul>
        <li>Submit content that is illegal, harmful, or offensive</li>
        <li>Violate the rights of others</li>
        <li>Attempt to hack, disrupt, or reverse-engineer our services</li>
      </ul>
    </section>

    <section>
      <h2>5. Privacy</h2>
      <p>Your use of Dearluv is also governed by our <a href="/privacy-policy">Privacy Policy</a>. Please review it to understand how we handle your data.</p>
    </section>

    <section>
      <h2>6. Limitation of Liability</h2>
      <p>Dearluv is provided as-is. We are not responsible for any indirect or consequential damages resulting from your use of the service.</p>
    </section>

    <section>
      <h2>7. Changes to Terms</h2>
      <p>We may update these Terms & Conditions from time to time. Changes will be reflected on this page. Continued use of Dearluv means you accept the updated terms.</p>
    </section>

    <section>
      <h2>8. Contact</h2>
      <p>If you have questions about these Terms & Conditions, please contact us at <a href="mailto:hello@dearluv.ng">hello@dearluv.ng</a>.</p>
    </section>
  </div>
</template>

<style scoped>
.terms-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: var(--font-serif);
  color: var(--color-ink);
  line-height: 1.8;
}

.terms-page h1 {
  font-size: 3rem;
  text-align: center;
  color: var(--color-rose-dark);
  margin-bottom: 1.5rem;
}

.terms-page h2 {
  font-size: 1.75rem;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: var(--color-rose);
}

.terms-page p, .terms-page li {
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.terms-page ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.terms-page a {
  color: var(--color-rose-dark);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .terms-page {
    padding: 2rem 1rem;
  }

  .terms-page h1 {
    font-size: 2rem;
  }

  .terms-page h2 {
    font-size: 1.5rem;
  }
}
</style>
