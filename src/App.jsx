import { useState } from 'react';
import './index.css';

/* --- THE 10 PERSONALITIES --- */

const resultsData = {
  // --- ODEs (2) ---
  ode_pure: {
    title: "Simple Harmonic Oscillator (ODE)",
    formula: "d²x/dt² + ω²x = 0",
    pun: "You go back and forth, but you always find your center. You're a creature of habit.",
    desc: "You are the definition of consistency. Like a pendulum or a spring, you operate in cycles. You might have your ups and downs, but you are predictable, reliable, and conserve your energy perfectly.",
    solver: "Verlet Integration or Crank-Nicolson",
    color: "#2563eb" // Blue
  },
  ode_growth: {
    title: "Logistic Growth Equation (ODE)",
    formula: "dP/dt = rP(1 - P/K)",
    pun: "You know your limits. You push hard at first, but you know when to settle down.",
    desc: "You are ambitious but realistic. You grow and improve rapidly (exponentially) when you start something new, but you respect boundaries (Carrying Capacity K) and settle into a comfortable, sustainable rhythm.",
    solver: "Runge-Kutta 4 (RK4)",
    color: "#3b82f6" // Lighter Blue
  },

  // --- PDEs (3) ---
  pde_heat: {
    title: "The Heat Equation (PDE)",
    formula: "∂u/∂t = α∇²u",
    pun: "You're a smoother. You walk into a room and the tension just melts away.",
    desc: "You are a master of diffusion. You take sharp edges, chaotic data, or angry people and smooth them out over time. You value entropy and irreversible progress—you don't look back.",
    solver: "Finite Difference Method (Forward-Time Central-Space)",
    color: "#10b981" // Emerald
  },
  pde_wave: {
    title: "The Wave Equation (PDE)",
    formula: "∂²u/∂t² = c²∇²u",
    pun: "You make waves wherever you go. You transport energy without losing momentum.",
    desc: "You are high-energy and reactive. Unlike the Heat Equation, you don't smooth things out—you reflect them! You transmit information perfectly, but you can be prone to constructive (or destructive) interference.",
    solver: "Finite Element Method (FEM)",
    color: "#059669" // Darker Green
  },
  pde_laplace: {
    title: "Laplace's Equation (PDE)",
    formula: "∇²u = 0",
    pun: "You are the Zen Master. No time dependence, just perfect equilibrium.",
    desc: "You are the steady state. You don't change with the ticking clock; you are defined entirely by your boundaries. You represent the perfect average of everything around you.",
    solver: "Relaxation Method (Jacobi / Gauss-Seidel)",
    color: "#34d399" // Light Green
  },

  // --- SDEs (3) ---
  sde_gbm: {
    title: "Geometric Brownian Motion (SDE)",
    formula: "dSₜ = μSₜdt + σSₜdWₜ",
    pun: "You're bullish on life. A little volatility just makes things interesting.",
    desc: "You are the standard model for success in a chaotic world. Like the stock market, you generally drift upwards (μ), but you have a 'wild side' (σ) that keeps people guessing.",
    solver: "Euler-Maruyama Method",
    color: "#f59e0b" // Amber
  },
  sde_ou: {
    title: "Ornstein-Uhlenbeck Process (SDE)",
    formula: "dxₜ = θ(μ - xₜ)dt + σdWₜ",
    pun: "You wander off, but you always find your way home. You're like a rubber band.",
    desc: "You are mean-reverting. You like to explore and get a little chaotic, but there is a strong force (Gravity? Mom?) that always pulls you back to your long-term average.",
    solver: "Exact Integration / Gillespie Algorithm",
    color: "#d97706" // Dark Amber
  },
  sde_white: {
    title: "Gaussian White Noise (SDE)",
    formula: "ξ(t) = dW/dt",
    pun: "You are pure chaos. No filter, no memory, just instant reaction.",
    desc: "You live entirely in the moment. You are uncorrelated with your past and unpredictable in your future. Some call it scattered; you call it having a flat power spectrum.",
    solver: "Monte Carlo Simulations",
    color: "#fbbf24" // Bright Yellow
  },

  // --- FDEs (2) ---
  fde_memory: {
    title: "Fractional Diffusion (FDE)",
    formula: "∂ᵅu/∂tᵅ = -(-Δ)^(β/2) u",
    pun: "You don't just spread out; you teleport. You skip the small talk.",
    desc: "You exhibit 'Anomalous Diffusion.' While normal people take small steps, you take 'Lévy flights'—making giant leaps to new ideas or places instantly. You refuse to be bound by the standard rules of space.",
    solver: "Matrix Transform Method",
    color: "#8b5cf6" // Purple
  },
  fde_decay: {
    title: "Power Law Decay (FDE)",
    formula: "Dᵅf(t) = -λf(t)",
    pun: "You hold grudges... mathematically. Your past never truly fades away.",
    desc: "You have 'Heavy Tails' in your memory. Unlike normal people who forget things exponentially fast, your memories decay very slowly (algebraically). Everything you've ever done is still part of you today.",
    solver: "Grünwald-Letnikov Approximation",
    color: "#7c3aed" // Dark Purple
  }
};

const questions = [
  {
    text: "1. How do you handle a stressful deadline?",
    options: [
      { text: "I follow my schedule perfectly.", type: "ode" },
      { text: "I adapt to the room's energy.", type: "pde" },
      { text: "I panic and improvise.", type: "sde" },
      { text: "I remember how I failed last time.", type: "fde" }
    ]
  },
  {
    text: "2. Your friend cancels plans last minute. You...",
    options: [
      { text: "Reschedule immediately.", type: "ode" },
      { text: "Go with the flow, do something else.", type: "pde" },
      { text: "Do something totally random instead.", type: "sde" },
      { text: "Think about this for weeks.", type: "fde" }
    ]
  },
  {
    text: "3. Describe your dream vacation.",
    options: [
      { text: "A planned tour itinerary.", type: "ode" },
      { text: "Immersing myself in the local culture.", type: "pde" },
      { text: "Vegas. Roulette. Chaos.", type: "sde" },
      { text: "Visiting my ancestral home.", type: "fde" }
    ]
  },
  {
    text: "4. When you walk into a crowded room...",
    options: [
      { text: "I walk a straight line to the food.", type: "ode" },
      { text: "I spread out to find space.", type: "pde" },
      { text: "I bounce between conversations.", type: "sde" },
      { text: "I look for someone I already know.", type: "fde" }
    ]
  },
  {
    text: "5. What is your 'vibe'?",
    options: [
      { text: "Steady and reliable.", type: "ode" },
      { text: "Smooth and balanced.", type: "pde" },
      { text: "Volatile and exciting.", type: "sde" },
      { text: "Deep and complex.", type: "fde" }
    ]
  },
  {
    text: "6. How do you solve a puzzle?",
    options: [
      { text: "Step by step, edge pieces first.", type: "ode" },
      { text: "Group pieces by color/area.", type: "pde" },
      { text: "Try pieces randomly until they fit.", type: "sde" },
      { text: "Look at the box image repeatedly.", type: "fde" }
    ]
  },
  {
    text: "7. Your relationship with time is...",
    options: [
      { text: "Time is a straight arrow.", type: "ode" },
      { text: "Time depends on where I am.", type: "pde" },
      { text: "Time is a flat circle... or a squiggle.", type: "sde" },
      { text: "The past weighs heavy on the present.", type: "fde" }
    ]
  },
  {
    text: "8. What scares you most?",
    options: [
      { text: "Disruption of my routine.", type: "ode" },
      { text: "Being isolated in a vacuum.", type: "pde" },
      { text: "Boredom / Flatlining.", type: "sde" },
      { text: "Forgetting who I am.", type: "fde" }
    ]
  },
  {
    text: "9. Pick a superpower.",
    options: [
      { text: "Super speed (Efficiency).", type: "ode" },
      { text: "Teleportation (Space mastery).", type: "pde" },
      { text: "Luck manipulation (Probability).", type: "sde" },
      { text: "Time travel (History access).", type: "fde" }
    ]
  },
  {
    text: "10. Finally, pick a shape.",
    options: [
      { text: "Line.", type: "ode" },
      { text: "Sphere.", type: "pde" },
      { text: "Cloud.", type: "sde" },
      { text: "Fractal.", type: "fde" }
    ]
  }
];

/* --- LOGIC ENGINE --- */

function determinePersonality(scores) {
  // 1. Find the Winner (Primary Category)
  const winner = Object.keys(scores).reduce((a, b) => scores[a] >= scores[b] ? a : b);
  
  // 2. Find the Runner-Up (Secondary Category) to decide the specific flavor
  const scoresCopy = { ...scores };
  delete scoresCopy[winner];
  const runnerUp = Object.keys(scoresCopy).reduce((a, b) => scoresCopy[a] >= scoresCopy[b] ? a : b);

  // 3. Mapping Logic
  // ODE (2 variants)
  if (winner === 'ode') {
    if (runnerUp === 'sde' || scores[winner] > 6) return resultsData.ode_growth;
    return resultsData.ode_pure;
  }

  // PDE (3 variants)
  if (winner === 'pde') {
    if (runnerUp === 'ode') return resultsData.pde_laplace;
    if (runnerUp === 'sde') return resultsData.pde_wave;
    return resultsData.pde_heat;
  }

  // SDE (3 variants)
  if (winner === 'sde') {
    if (runnerUp === 'ode') return resultsData.sde_ou;
    if (runnerUp === 'pde') return resultsData.sde_gbm;
    return resultsData.sde_white;
  }

  // FDE (2 variants)
  if (winner === 'fde') {
    if (runnerUp === 'sde') return resultsData.fde_memory;
    return resultsData.fde_decay;
  }
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState({ ode: 0, pde: 0, sde: 0, fde: 0 });
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  const handleVote = (type) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);
    
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      const personality = determinePersonality(newScores);
      setResult(personality);
      setFinished(true);
    }
  };

  const restart = () => {
    setIndex(0);
    setScores({ ode: 0, pde: 0, sde: 0, fde: 0 });
    setFinished(false);
    setResult(null);
  };

  if (finished && result) {
    return (
      <div className="app-container">
        <div className="card result-card" style={{ borderTop: `6px solid ${result.color}` }}>
          <h2 className="result-intro">Your Mathematical Soul is...</h2>
          <h1 className="result-title" style={{ color: result.color }}>{result.title}</h1>
          
          <div className="formula-box">
            {result.formula}
          </div>

          <p className="pun-text">"{result.pun}"</p>
          
          {/* --- IMAGE PLACEHOLDER COMMENTED OUT AS REQUESTED ---
          <div className="image-placeholder">
             <img 
               src={`/${result.title.split(' ')[0].toLowerCase()}.png`} 
               alt="Equation Graph" 
               onError={(e) => e.target.style.display='none'} 
               style={{maxWidth: '100%', maxHeight: '100%'}}
             />
             <span className="placeholder-text">[ Graphic: {result.title} ]</span>
          </div>
          */}

          <div className="details-grid">
            <div className="detail-item">
              <strong>The Vibe</strong>
              <p>{result.desc}</p>
            </div>
            <div className="detail-item">
              <strong>Solver</strong>
              <p>{result.solver}</p>
            </div>
          </div>

          <button className="primary-btn" onClick={restart}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div className="app-container">
      <div className="card">
        {/* ADDED TITLE HERE */}
        {/* <h1 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Which Differential Equation Are You?</h1> */}
        <h1 style={{
          fontSize: '2.2rem', 
          fontWeight: '800', 
          letterSpacing: '-1px',
          background: 'linear-gradient(to right, #2563eb, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem',
          marginTop: '0'
        }}>
          Which Differential Equation Are You?
        </h1>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((index) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        <h2>{q.text}</h2>
        
        <div className="options-grid">
          {q.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleVote(opt.type)} 
              className="option-btn"
            >
              {opt.text}
            </button>
          ))}
        </div>
        
        <p className="counter">Question {index + 1} of {questions.length}</p>
      </div>
    </div>
  );
}