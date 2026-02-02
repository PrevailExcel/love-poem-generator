<template>
  <div class="landing">
    <div class="hero">
        <div class="romance-particles" aria-hidden="true">
    <span></span><span></span><span></span>
    <span></span><span></span><span></span>
    <span></span><span></span><span></span>
    <span></span><span></span><span></span>
  </div>
      <h1 class="hero-title">For the words you can’t find</h1>
      <p class="hero-subtitle">
        Dear.luv helps you turn feelings into words that come straight from your heart.
      </p>
      <p class="hero-description">
        Because the right words change everything.
      </p>
      <button class="cta-button" @click="startCreating">Create Your Poem</button>
      <p class="no-account">No account required • Free to start</p>

    </div>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">
          <PenLine :size="40" :stroke-width="2" />
        </div>
        <h3>Effortlessly Personal</h3>
        <p>Just share a few details and let AI craft a unique poem that feels genuinely yours.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">
          <Sparkles :size="40" :stroke-width="2" />
        </div>
        <h3>Multiple Styles</h3>
        <p>Choose from romantic classics, playful verses, passionate sonnets, and more.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">
          <Image :size="40" :stroke-width="2" />
        </div>
        <h3>Photo Enhanced</h3>
        <p>Upload a photo to make your poem even more personal and meaningful.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">
          <Heart :size="40" :stroke-width="2" />
        </div>
        <h3>Share & Save</h3>
        <p>Download, copy, or share your poem instantly. Save forever with premium.</p>
      </div>
    </div>

    <section class="how-it-works">
      <h2 class="section-title">How It Works</h2>
      <p class="section-subtitle">Three simple steps to your perfect poem</p>
      
      <div class="steps-container">
        <div class="step-item">
          <div class="step-number">1</div>
          <h3>Share Your Feelings</h3>
          <p>Tell us about someone special and what makes them unique to you.</p>
        </div>
        <div class="step-item">
          <div class="step-number">2</div>
          <h3>Choose Your Style</h3>
          <p>Pick from romantic, playful, passionate, or classic poetry styles.</p>
        </div>
        <div class="step-item">
          <div class="step-number">3</div>
          <h3>Receive Your Poem</h3>
          <p>Get a beautiful, personalized poem in seconds. Share, save, or treasure it forever.</p>
        </div>
      </div>
    </section>

    <section class="examples-section">
      <div class="examples-container">
        <h2 class="section-title">Poems That Touch Hearts</h2>
        <p class="section-subtitle">Real expressions, beautifully crafted</p>
        
        <div class="examples-grid">
          <div class="example-card">
            <div class="example-style">Classic Romance</div>
            <div class="example-text">
              "In morning light, your smile appears,<br>
              A gentle warmth that calms my fears.<br>
              Your laughter dances through the air,<br>
              A melody beyond compare."
            </div>
            <div class="example-occasion">— For an anniversary</div>
          </div>
          <div class="example-card">
            <div class="example-style">Playful & Light</div>
            <div class="example-text">
              "You steal the covers, hog the bed,<br>
              Leave coffee rings everywhere instead,<br>
              But when you laugh, my world turns bright,<br>
              And suddenly, everything's just right."
            </div>
            <div class="example-occasion">— For everyday love</div>
          </div>
          <div class="example-card">
            <div class="example-style">Passionate</div>
            <div class="example-text">
              "Your touch ignites a fire deep within,<br>
              A flame that burns beneath my skin.<br>
              In your eyes, I find my home,<br>
              With you, I'm never alone."
            </div>
            <div class="example-occasion">— For a special night</div>
          </div>
        </div>
      </div>
    </section>

    <section class="perfect-for">
      <h2 class="section-title">Perfect For Every Moment</h2>
      <p class="section-subtitle">When you want to say something that matters</p>
      
      <div class="occasions-grid">
        <div class="occasion-tag">
          <Cake :size="28" :stroke-width="2" />
          <div class="occasion-name">Anniversaries</div>
        </div>
        <div class="occasion-tag">
          <Gift :size="28" :stroke-width="2" />
          <div class="occasion-name">Birthdays</div>
        </div>
        <div class="occasion-tag">
          <HeartHandshake :size="28" :stroke-width="2" />
          <div class="occasion-name">Apologies</div>
        </div>
        <div class="occasion-tag">
          <Sparkle :size="28" :stroke-width="2" />
          <div class="occasion-name">Just Because</div>
        </div>
        <div class="occasion-tag">
          <Diamond :size="28" :stroke-width="2" />
          <div class="occasion-name">Proposals</div>
        </div>
        <div class="occasion-tag">
          <Sun :size="28" :stroke-width="2" />
          <div class="occasion-name">Good Morning</div>
        </div>
        <div class="occasion-tag">
          <Moon :size="28" :stroke-width="2" />
          <div class="occasion-name">Good Night</div>
        </div>
        <div class="occasion-tag">
          <Plane :size="28" :stroke-width="2" />
          <div class="occasion-name">Long Distance</div>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <h2 class="final-cta-title">Ready to express what words can't quite capture?</h2>
      <p class="final-cta-text">
        Start creating poems that feel as special as the person you're writing them for.
      </p>
      <button class="cta-button" @click="startCreating">Create Your First Poem</button>
      <p class="no-account">It takes less than a minute</p>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { PenLine, Sparkles, Image, Heart, Cake, Gift, HeartHandshake, Sparkle, Diamond, Sun, Moon, Plane } from 'lucide-vue-next'

const router = useRouter()
const { canGenerate } = useUser()

const startCreating = () => {
  router.push('/create')
}
</script>

<style scoped>
.landing {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
  animation: fadeIn 1s ease-out 0.3s both;
}

.hero {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: 4.5rem;
  font-weight: 300;
  line-height: 1.2;
  color: var(--color-rose-dark);
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 2rem;
  color: var(--color-rose);
  margin-bottom: 1.5rem;
  font-weight: 400;
  line-height: 1.4;
  font-family: var(--font-serif);
}

.hero-description {
  font-size: 1.25rem;
  color: var(--color-ink);
  opacity: 0.8;
  margin-bottom: 3rem;
  line-height: 1.8;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.no-account {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--color-rose-light);
  font-style: italic;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 6rem;
}

.feature {
  background: rgba(255, 255, 255, 0.6);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(139, 71, 93, 0.1);
  backdrop-filter: blur(10px);
  text-align: left;
}

.feature-icon {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  color: var(--color-rose);
}

.feature h3 {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-rose-dark);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.feature p {
  color: var(--color-ink);
  opacity: 0.7;
  line-height: 1.6;
}

.how-it-works {
  margin: 6rem 0;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 3rem;
  text-align: center;
  color: var(--color-rose-dark);
  margin-bottom: 1rem;
  font-weight: 400;
}

.romance-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 999;
}

.romance-particles span {
  position: absolute;
  bottom: -20px;
  width: 6px;
  height: 6px;
  background: rgba(255, 180, 200, 0.85);
  border-radius: 50%;
  filter: blur(2px);
  animation: floatUp 14s linear infinite;
  opacity: 0;
}

/* Stagger everything so it feels organic */
.romance-particles span:nth-child(1) { left: 10%; animation-delay: 0s; }
.romance-particles span:nth-child(2) { left: 20%; animation-delay: 4s; }
.romance-particles span:nth-child(3) { left: 30%; animation-delay: 8s; }
.romance-particles span:nth-child(4) { left: 40%; animation-delay: 2s; }
.romance-particles span:nth-child(5) { left: 50%; animation-delay: 6s; }
.romance-particles span:nth-child(6) { left: 60%; animation-delay: 10s; }
.romance-particles span:nth-child(7) { left: 70%; animation-delay: 1s; }
.romance-particles span:nth-child(8) { left: 80%; animation-delay: 5s; }
.romance-particles span:nth-child(9) { left: 90%; animation-delay: 9s; }
.romance-particles span:nth-child(10){ left: 15%; animation-delay: 7s; }
.romance-particles span:nth-child(11){ left: 55%; animation-delay: 3s; }
.romance-particles span:nth-child(12){ left: 75%; animation-delay: 11s; }

@keyframes floatUp {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    transform: translate(12px, -120vh);
    opacity: 0;
  }
}



.section-subtitle {
  text-align: center;
  color: var(--color-rose);
  font-size: 1.25rem;
  margin-bottom: 4rem;
  font-style: italic;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 3rem;
}

.step-item {
  text-align: center;
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-rose) 0%, var(--color-rose-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 1.5rem;
  margin: 0 auto 1.5rem;
  box-shadow: var(--shadow-soft);
}

.step-item h3 {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-rose-dark);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.step-item p {
  color: var(--color-ink);
  opacity: 0.7;
  line-height: 1.6;
}

.examples-section {
  background: rgba(255, 255, 255, 0.5);
  padding: 6rem 2rem;
  margin: 4rem -2rem;
}

.examples-container {
  max-width: 1100px;
  margin: 0 auto;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.example-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(139, 71, 93, 0.1);
  transition: all 0.3s ease;
}

.example-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-elevated);
}

.example-style {
  font-family: var(--font-serif);
  color: var(--color-rose);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.example-text {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-ink);
  font-style: italic;
  margin-bottom: 1rem;
}

.example-occasion {
  font-size: 0.875rem;
  color: var(--color-rose-light);
  text-align: right;
}

.perfect-for {
  margin: 6rem 0;
}

.occasions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.occasion-tag {
  background: rgba(255, 255, 255, 0.7);
  padding: 1.25rem 1.5rem;
  border-radius: 15px;
  border: 2px solid rgba(139, 71, 93, 0.15);
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-rose);
}

.occasion-tag:hover {
  border-color: var(--color-rose);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
}

.occasion-name {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  color: var(--color-rose-dark);
  font-weight: 500;
}

.final-cta {
  text-align: center;
  padding: 6rem 0 4rem;
}

.final-cta-title {
  font-family: var(--font-serif);
  font-size: 3rem;
  color: var(--color-rose-dark);
  margin-bottom: 1.5rem;
  font-weight: 400;
  line-height: 1.3;
}

.final-cta-text {
  font-size: 1.25rem;
  color: var(--color-ink);
  opacity: 0.8;
  margin-bottom: 2.5rem;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .final-cta-title {
    font-size: 2rem;
  }

  .features,
  .steps-container,
  .examples-grid {
    grid-template-columns: 1fr;
  }

  .occasions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
