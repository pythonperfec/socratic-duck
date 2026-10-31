/**
 * Mock conversation & Socratic engine for frontend demonstration.
 * Zero backend calls - purely local scripted interaction.
 */

export const INITIAL_MESSAGES = [
  {
    id: 'm1',
    role: 'user',
    text: "My React useEffect hook is running in an infinite re-render loop and freezing the browser tab! Here's my code snippet.",
    timestamp: '10:41 AM'
  },
  {
    id: 'm2',
    role: 'duck',
    mood: 'squint',
    patienceDelta: -2,
    text: "Quack. An infinite loop? Fascinating. Before you ask me for the fix—where would the fun be in that?—tell me: what state variable does your effect mutate, and what's in its dependency array?",
    timestamp: '10:42 AM'
  },
  {
    id: 'm3',
    role: 'user',
    text: "It reads `userCount` and inside it calls `setUserCount(prev => prev + 1)` whenever the list updates. The dependency array is `[userCount]`.",
    timestamp: '10:43 AM'
  },
  {
    id: 'm4',
    role: 'duck',
    mood: 'calm',
    patienceDelta: 4,
    text: "Now walk me through the lifecycle, step by single step. The effect runs because `userCount` changed. Inside, what does `setUserCount` do to the state, and what will React immediately trigger next?",
    timestamp: '10:43 AM'
  }
];

export const SCRIPTED_RESPONSES = [
  {
    trigger: ['fix', 'give me', 'just tell me', 'code', 'solution', 'what should i write'],
    reply: {
      message: "Quack! I was about to blurt out the exact replacement syntax, but my beak snapped shut! Step back: if an effect triggers the very thing it depends on, how could it ever finish?",
      mood: 'grumpy',
      patienceDelta: -8,
      blocked: true
    }
  },
  {
    trigger: ['re-render', 'infinite', 'triggers', 'state', 'dependency', 'cycle'],
    reply: {
      message: "Precisely! Each update causes a re-render, which notices the dependency changed, which runs the effect again. So if you need to calculate derived count from the list, do you even need `useEffect` at all?",
      mood: 'delighted',
      patienceDelta: 6,
      blocked: false
    }
  },
  {
    trigger: ['derived', 'memo', 'render', 'remove effect'],
    reply: {
      message: "Look at you thinking like the virtual DOM itself! If the list already has `.length`, what happens if you compute `const userCount = list.length` directly during render?",
      mood: 'delighted',
      patienceDelta: 8,
      blocked: false
    }
  },
  {
    trigger: ['default'],
    reply: {
      message: "A provocative hypothesis! Look closely at the boundary between your inputs and outputs. What assumptions are you making about the order of execution?",
      mood: 'calm',
      patienceDelta: 2,
      blocked: false
    }
  }
];

export function getMockDuckResponse(userText, currentPatience = 70) {
  const lower = (userText || '').toLowerCase();
  
  // Check triggers
  for (const item of SCRIPTED_RESPONSES) {
    if (item.trigger.some(k => lower.includes(k))) {
      return item.reply;
    }
  }

  // Fallback random Socratic nudges
  const genericReplies = [
    {
      message: "Quack. Print out the value right before that branch. Does the runtime reality match what you pictured in your head?",
      mood: 'squint',
      patienceDelta: 1,
      blocked: false
    },
    {
      message: "If that function received an empty array or undefined right now, what would break on the very first instruction?",
      mood: 'calm',
      patienceDelta: 2,
      blocked: false
    },
    {
      message: "Hold on. Don't guess. Which exact line in the call stack threw the error, and what was the type of the argument?",
      mood: 'grumpy',
      patienceDelta: -3,
      blocked: false
    }
  ];

  return genericReplies[Math.floor(Math.random() * genericReplies.length)];
}
