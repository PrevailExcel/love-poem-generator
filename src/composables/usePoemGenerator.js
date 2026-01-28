import { ref } from 'vue'

export const poemStyles = [
  {
    id: 'classic',
    name: 'Classic Romance',
    description: 'Timeless and elegant, like a love letter from centuries past',
    premium: false
  },
  {
    id: 'playful',
    name: 'Playful & Light',
    description: 'Fun, whimsical verses that bring a smile',
    premium: false
  },
  {
    id: 'passionate',
    name: 'Passionate',
    description: 'Intense, heartfelt emotion that burns bright',
    premium: false
  },
  {
    id: 'haiku',
    name: 'Haiku',
    description: 'Simple, beautiful moments in three lines',
    premium: false
  },
  {
    id: 'sonnet',
    name: 'Shakespearean Sonnet',
    description: 'Classic 14-line structure with perfect rhythm',
    premium: true
  },
  {
    id: 'acrostic',
    name: 'Acrostic',
    description: 'Each line begins with a letter of their name',
    premium: true
  }
]

export function usePoemGenerator() {
  const isGenerating = ref(false)

  const generatePoem = async (poemData) => {
    isGenerating.value = true

    // Simulate AI generation (in production, this calls Claude API)
    await new Promise(resolve => setTimeout(resolve, 3000))

    const poem = createPoemText(poemData)
    
    isGenerating.value = false
    return poem
  }

  const createPoemText = (poemData) => {
    const name = poemData.name || 'you'
    const desc = poemData.description
    const style = poemData.style

    // Sample poem templates (in production, this is AI-generated)
    const poems = {
      classic: `In quiet moments when the world stands still,
I think of ${name}, and my heart fills with grace.
${desc.slice(0, 60)}...
A love so pure, no words could ever replace.

Your presence brings a warmth I've never known,
Like morning sun that breaks through winter's night.
In every smile, in every gentle tone,
You paint my world in colors warm and bright.`,

      playful: `Oh ${name}, you wonderful surprise!
With ${desc.slice(0, 40)}...
You make me laugh until I cry,
And turn my ordinary days to magic.

When I'm with you, the world's a playground bright,
Where every moment sparkles like champagne.
You've turned my life from black and white,
To rainbows dancing in the summer rain!`,

      passionate: `${name} – your name ignites my soul like fire,
${desc.slice(0, 50)}...
My heart burns with endless, fierce desire,
A flame that time could never steal away.

You are the thunder in my quiet storm,
The lightning that illuminates my night.
In your embrace, I find my truest form,
And lose myself in overwhelming light.`,

      haiku: `${name}'s gentle smile
${desc.slice(0, 30)}...
Love blooms in my heart`
    }

    return poems[style] || poems.classic
  }

  return {
    isGenerating,
    generatePoem,
    poemStyles
  }
}
