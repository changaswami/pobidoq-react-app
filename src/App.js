import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Loader2, ChevronRight, CheckCircle2, Eye, RefreshCw, BookOpen, Volume2, VolumeX, Users } from 'lucide-react';
import './index.css';

// Sound Manager (moved outside component)
const SoundManager = {
  audioContext: null,
  
  init() {
    if (!this.audioContext && (window.AudioContext || window.webkitAudioContext)) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  
  play(type, enabled = true) {
    if (!enabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      const frequencies = {
        click: 800,
        transition: 220,
        insight: 659.25,
        success: 523.25,
        complete: 783.99,
        universe: 392.00,
        game: 493.88,
        race: 329.63,
        step: 440.00
      };
      
      oscillator.frequency.setValueAtTime(
        frequencies[type] || 440, 
        this.audioContext.currentTime
      );
      
      oscillator.type = type === 'insight' ? 'sine' : 'triangle';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
      
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }
};

// Initialize sound on first user interaction
document.addEventListener('click', () => {
  SoundManager.init();
}, { once: true });

// Glass Card Component (moved outside component)
const GlassCard = ({ children, className = '', style = {} }) => {
  return (
    <div 
      className={`glass-card ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

// Animated Background Component (moved outside component)
const AnimatedBackground = ({ type = 'default' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const count = type === 'processing' ? 30 : 15;
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4,
          emoji: getParticleEmoji(type)
        });
      }
      setParticles(newParticles);
    };

    const getParticleEmoji = (bgType) => {
      const emojiMap = {
        welcome: ['✨', '🌟', '💫', '🌱', '💖'],
        processing: ['⚡', '🔮', '💎', '🌊', '🔥'],
        red: ['🔴', '❤️', '🌹', '🔥', '💪'],
        green: ['🟢', '🌱', '🍃', '🌿', '💚'], 
        blue: ['🔵', '💙', '🌊', '❄️', '🔷'],
        yellow: ['🟡', '☀️', '⭐', '💛', '✨'],
        default: ['✨', '🌟', '💫']
      };
      
      const emojis = emojiMap[bgType] || emojiMap.default;
      return emojis[Math.floor(Math.random() * emojis.length)];
    };

    generateParticles();
  }, [type]);

  return (
    <div className="animated-background">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
};

// Welcome Screen Component (moved outside main component)
const WelcomeScreen = ({ setCurrentStep, setSoundEnabled, soundEnabled, colorPaths, STEPS }) => (
  <div className="welcome-container">
    <AnimatedBackground type="welcome" />
    <GlassCard className="welcome-card stagger-animation">
      <div className="text-center space-y-6">
        <div className="welcome-logo">
          <div className="text-6xl mb-4 animate-float">🔮</div>
          <h1 className="text-5xl font-bold bg-gradient-text mb-4">pobidoq</h1>
          <p className="text-xl opacity-90 mb-2">Personal Growth AI • Proof of Behavior • Collective Wisdom</p>
          <p className="text-sm opacity-70">Powered by Harmony Protocol & Simulated Aptos Blockchain</p>
        </div>
        
        <div className="archetype-preview">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
            {Object.entries(colorPaths).map(([color, data], index) => (
              <div key={color} className={`archetype-card stagger-${index + 1}`}>
                <div className="text-3xl mb-2">{data.emoji}</div>
                <div className="font-semibold text-sm">{data.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="btn-primary btn-large"
          onClick={() => setCurrentStep(STEPS.ONBOARD)}
        >
          ✨ Begin Your Journey
          <ChevronRight className="ml-2" />
        </button>
      </div>
    </GlassCard>
    
    <button 
      className="sound-toggle"
      onClick={() => setSoundEnabled(!soundEnabled)}
    >
      {soundEnabled ? <Volume2 /> : <VolumeX />}
    </button>
  </div>
);

// Onboarding Screen Component (moved outside main component)
const OnboardingScreen = ({ userProfile, setUserProfile, setCurrentStep, STEPS }) => (
  <div className="onboard-container">
    <AnimatedBackground type="onboard" />
    <GlassCard className="onboard-card">
      <h2 className="text-2xl font-bold text-center mb-6">🎯 Set Your Growth Intention</h2>
      <p className="text-center text-gray-600 mb-6">What personal growth goals are you focusing on? (Optional)</p>
      
      <textarea
        value={userProfile.goals}
        onChange={(e) => setUserProfile(prev => ({ ...prev, goals: e.target.value }))}
        placeholder="e.g., 'Building better communication skills', 'Practicing daily mindfulness', 'Developing emotional intelligence'..."
        className="goal-input"
        rows={3}
        maxLength={200}
        autoFocus
      />
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">{userProfile.goals.length}/200</span>
        <div className="space-x-3">
          <button 
            className="btn-secondary"
            onClick={() => {
              setUserProfile(prev => ({ ...prev, goals: '' }));
              setCurrentStep(STEPS.INPUT);
            }}
          >
            Skip
          </button>
          <button 
            className="btn-primary"
            onClick={() => setCurrentStep(STEPS.INPUT)}
          >
            Continue
            <ChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </GlassCard>
  </div>
);

// Input Screen Component (moved outside main component)
const InputScreen = ({ 
  userProfile, 
  currentSession, 
  setCurrentSession, 
  processReflection 
}) => (
  <div className="input-container">
    <AnimatedBackground type="input" />
    <div className="input-layout">
      <GlassCard className="input-card">
        <h2 className="section-title">
          <BookOpen className="mr-2" />
          📝 Describe Your Personal Growth Action
        </h2>
        
        {userProfile.goals && (
          <div className="goal-display">
            <span className="text-sm text-gray-600">Current Goal:</span>
            <p className="font-medium">{userProfile.goals}</p>
          </div>
        )}
        
        <textarea
          value={currentSession.input}
          onChange={(e) => setCurrentSession(prev => ({ ...prev, input: e.target.value }))}
          placeholder="Share what you've done today to grow personally... (e.g., 'I meditated for 10 minutes', 'I had a difficult conversation with my partner', 'I read about emotional intelligence')"
          className="main-input"
          rows={4}
          maxLength={500}
          autoFocus
        />
        
        <div className="input-footer">
          <span className="character-count">{currentSession.input.length}/500</span>
          <button 
            className="btn-primary"
            onClick={processReflection}
            disabled={currentSession.input.trim().length < 10}
          >
            ✨ Pob My Action
          </button>
        </div>
      </GlassCard>
      
      {userProfile.contributions.length > 0 && (
        <GlassCard className="stats-sidebar">
          <h3 className="text-lg font-semibold mb-4">📊 Your Progress</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{userProfile.totalContributions}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{userProfile.sessionActions}</div>
              <div className="stat-label">Today</div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  </div>
);

// Processing Screen Component (moved outside main component)
const ProcessingScreen = () => (
  <div className="processing-container">
    <AnimatedBackground type="processing" />
    <GlassCard className="processing-card">
      <div className="processing-content">
        <div className="processing-spinner">
          <Loader2 className="animate-spin w-12 h-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mt-4">🔍 Analyzing Your Action</h3>
        <p className="text-gray-600 mt-2">Node is capturing and verifying your contribution...</p>
        <div className="processing-dots">
          <div className="dot animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="dot animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="dot animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </GlassCard>
  </div>
);

// Insight Screen Component (moved outside main component)
const InsightScreen = ({ 
  currentSession, 
  colorPaths, 
  animationPhase, 
  setCurrentStep, 
  STEPS 
}) => (
  <div className="insight-container">
    <AnimatedBackground type={currentSession.color?.toLowerCase() || 'default'} />
    <div className="insight-layout">
      <GlassCard className={`insight-card stagger-${animationPhase}`}>
        {/* POB Confirmation */}
        <div className="result-section confirmation-section">
          <h3 className="flex items-center text-xl font-bold text-green-700 mb-3">
            <CheckCircle2 className="mr-2" />
            ✅ Action Recorded!
          </h3>
          <p><strong>Proof of Behaviour (P.O.B.) established.</strong> Your growth contribution has been captured and verified.</p>
        </div>

        {/* AI Insight */}
        <div className="result-section ai-insight-section">
          <h3 className="flex items-center text-xl font-bold mb-3">
            <Sparkles className="mr-2 text-yellow-500" />
            🤖 AI Insight into Your Pob:
          </h3>
          <p className="insight-text">{currentSession.insight}</p>
        </div>

        {/* Archetype Display */}
        <div className="archetype-section">
          <h3 className="text-xl font-bold mb-4">🎨 Your Current Dominant Color</h3>
          <div className="archetype-display">
            <div className="archetype-emoji">{colorPaths[currentSession.color]?.emoji}</div>
            <div className="archetype-name">{colorPaths[currentSession.color]?.name}</div>
            <div className="archetype-description">Currently resonating with {colorPaths[currentSession.color]?.name.toLowerCase()}</div>
          </div>
        </div>

        {/* Blockchain Section */}
        <div className="result-section blockchain-section">
          <h3 className="text-lg font-bold mb-3">⛓️ Simulated Aptos Blockchain Integration</h3>
          <p><strong>Transaction Hash:</strong> <code className="tx-hash">{currentSession.txHash}</code></p>
          <a 
            href={`https://explorer.aptoslabs.com/txn/${currentSession.txHash}?network=mainnet`}
            target="_blank" 
            rel="noopener noreferrer"
            className="blockchain-link"
          >
            <Eye className="mr-1" />
            🔍 View Transaction on Aptos Explorer
          </a>
        </div>

        {/* Ethics Report */}
        <div className="result-section ethics-section">
          <h3 className="text-lg font-bold mb-3">🛡️ Harmony Protocol Ethics Report</h3>
          <p className="ethics-text">{currentSession.ethicsReport}</p>
        </div>

        {/* Continue Button */}
        <button 
          className="btn-primary btn-large mt-6"
          onClick={() => setCurrentStep(STEPS.JUDGMENT)}
        >
          Continue to Path Selection
        </button>
      </GlassCard>
    </div>
  </div>
);

// Judgment Screen Component (moved outside main component)
const JudgmentScreen = ({ 
  currentSession, 
  colorPaths, 
  selectPath 
}) => (
  <div className="judgment-container">
    <AnimatedBackground type={currentSession.color?.toLowerCase() || 'default'} />
    <GlassCard className="judgment-card">
      <h2 className="section-title mb-6">🔮 Choose Your Doq Intention</h2>
      <p className="text-center text-gray-600 mb-8">Select the path that best represents your intention behind this action:</p>
      
      <div className="orb-container">
        {Object.entries(colorPaths).map(([colorKey, data]) => (
          <button
            key={colorKey}
            className={`orb orb-${colorKey.toLowerCase()} ${colorKey === currentSession.color ? 'orb-suggested' : ''}`}
            onClick={() => selectPath(colorKey)}
          >
            <div className="orb-emoji">{data.emoji}</div>
            <div className="orb-name">{data.name}</div>
            <div className="orb-explanation">{data.explanation}</div>
            {colorKey === currentSession.color && (
              <div className="suggested-badge">Suggested Path</div>
            )}
          </button>
        ))}
      </div>
    </GlassCard>
  </div>
);

// Dashboard Screen Component (moved outside main component)
const DashboardScreen = ({ 
  userProfile, 
  currentSession, 
  communityData, 
  colorPaths, 
  startNew, 
  setCurrentStep, 
  STEPS 
}) => (
  <div className="dashboard-container">
    <AnimatedBackground type={userProfile.currentPath?.toLowerCase() || 'default'} />
    <div className="dashboard-layout">
      <GlassCard className="dashboard-main">
        <h2 className="section-title mb-6">📊 Your Journey Insights Dashboard</h2>
        
        <div className="dashboard-grid">
          {/* Current Path Card */}
          <div className="dashboard-card current-path-card">
            <h3 className="card-title">🎨 Current Path</h3>
            <div className="current-path-display">
              <div className="path-emoji">{colorPaths[userProfile.currentPath]?.emoji}</div>
              <div className="path-name">{colorPaths[userProfile.currentPath]?.name}</div>
              <div className="path-trait">Currently resonating with {colorPaths[userProfile.currentPath]?.name.toLowerCase()}</div>
            </div>
            <div className="stats-mini-grid">
              <div className="stat-mini">
                <div className="stat-number">{userProfile.totalContributions}</div>
                <div className="stat-label">Total Contributions</div>
              </div>
              <div className="stat-mini">
                <div className="stat-number">{userProfile.sessionActions}</div>
                <div className="stat-label">This Session</div>
              </div>
            </div>
          </div>

          {/* Latest Contribution Card */}
          <div className="dashboard-card latest-card">
            <h3 className="card-title">📝 Latest Contribution</h3>
            <div className="latest-content">
              <p className="latest-text">{currentSession.input}</p>
              <div className="latest-insight">
                <strong>AI Insight:</strong>
                <p className="insight-preview">{currentSession.insight}</p>
              </div>
              <div className="latest-intention">
                <strong>Your Intention:</strong>
                <span className="intention-display">
                  {colorPaths[currentSession.chosenPath]?.emoji} {colorPaths[currentSession.chosenPath]?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Collective Wisdom Card */}
          <div className="dashboard-card collective-card">
            <h3 className="card-title flex items-center">
              <Users className="mr-2" />
              🌍 Collective Wisdom
            </h3>
            <div className="collective-content">
              <div className="collective-insight">
                <strong>Community Focus:</strong>
                <p>{communityData.collectiveInsight}</p>
              </div>
              <div className="collective-trait">
                <strong>Emerging Trait:</strong>
                <span className="trait-highlight">{communityData.dominantTrait}</span>
              </div>
              <div className="collective-stats">
                <div className="stat-mini">
                  <div className="stat-number">{communityData.pathPercentage}%</div>
                  <div className="stat-label">Share Your Path</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-number">{communityData.communityAvg}</div>
                  <div className="stat-label">Community Avg</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Epic Journey Section */}
        <div className="epic-section">
          <h3 className="section-title">📜 Your Epic So Far</h3>
          <div className="epic-list">
            {userProfile.epicEntries.length === 0 ? (
              <div className="epic-empty">
                <p>Start your journey by recording your first action above!</p>
              </div>
            ) : (
              userProfile.epicEntries.slice(0, 10).map((entry, index) => (
                <div key={entry.id} className="epic-item">
                  <div className="epic-header">
                    <span className="epic-emoji">{colorPaths[entry.color]?.emoji}</span>
                    <span className="epic-intention">{entry.intention}</span>
                    <span className="epic-time">{entry.timestamp}</span>
                  </div>
                  <div className="epic-text">{entry.input}</div>
                  <div className="epic-insight">💡 {entry.insight}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="dashboard-actions">
          <button 
            className="btn-primary btn-large"
            onClick={startNew}
          >
            <RefreshCw className="mr-2" />
            ✨ New Contribution
          </button>
          <button 
            className="btn-secondary"
            onClick={() => setCurrentStep(STEPS.ONBOARD)}
          >
            🎯 Update Goals
          </button>
        </div>
      </GlassCard>
    </div>
  </div>
);

// Color archetypes with enhanced properties
const colorPaths = {
  Red: {
    emoji: '🔴',
    name: 'Passion & Action',
    trait: 'Universe',
    hex: '#e53e3e',
    explanation: "Power through action - Transform experience into bold, decisive steps toward goals."
  },
  Green: {
    emoji: '🟢', 
    name: 'Growth & Harmony',
    trait: 'Game',
    hex: '#38a169',
    explanation: "Nurture growth - Let actions be seeds for sustainable, harmonious development."
  },
  Blue: {
    emoji: '🔵',
    name: 'Wisdom & Reflection', 
    trait: 'Race',
    hex: '#3182ce',
    explanation: "Deepen wisdom - Use experiences to understand yourself and others more profoundly."
  },
  Yellow: {
    emoji: '🟡',
    name: 'Joy & Creativity',
    trait: 'Step', 
    hex: '#d69e2e',
    explanation: "Spark creativity - Channel moments into innovative approaches and joyful expression."
  }
};

// Enhanced AI insights
const aiInsights = [
  "This action shows your commitment to inner peace. Consider how this stillness might ripple into other areas of your life.",
  "Taking time for self-reflection demonstrates emotional maturity. What patterns are you noticing about yourself?",
  "Growth often happens in uncomfortable moments. How did this challenge expand your comfort zone?",
  "Your willingness to learn shows a growth mindset. What's one key insight you'll carry forward?",
  "This action reflects your values in motion. How does it align with who you're becoming?",
  "Small consistent actions create lasting change. What would happen if you doubled down on this habit?",
  "You're developing emotional intelligence through real experience. How might this serve your relationships?",
  "This moment of courage creates new possibilities. What doors might this action open for you?",
  "Your mindful approach creates space for deeper understanding. What patterns are emerging?",
  "This reflects remarkable resilience. How will you apply this strength moving forward?"
];

const ethicsReports = [
  "✅ Ethical alignment verified: This insight promotes authentic self-development without manipulation.",
  "🔍 Bias check passed: AI analysis maintains neutrality while encouraging growth.", 
  "🛡️ Privacy protected: Your data remains secure while benefiting from collective wisdom.",
  "⚖️ Fairness confirmed: Insights generated without cultural or demographic bias."
];

const collectiveInsights = [
  "The community is currently focused on building stronger emotional resilience and authentic communication.",
  "Today's collective energy centers around mindful action and compassionate self-reflection.",
  "The network shows increased activity in courage-building and stepping outside comfort zones.",
  "Community patterns indicate a shared focus on sustainable growth and inner wisdom development."
];

const collectiveTraits = ["Mindful Courage", "Authentic Growth", "Compassionate Wisdom", "Creative Resilience"];

// Flow constants
const STEPS = {
  WELCOME: 'welcome',
  ONBOARD: 'onboard', 
  INPUT: 'input',
  PROCESSING: 'processing',
  INSIGHT: 'insight',
  JUDGMENT: 'judgment',
  DASHBOARD: 'dashboard'
};

export default function PobidoqApp() {
  // Core state
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // User data
  const [userProfile, setUserProfile] = useState({
    goals: '',
    contributions: [],
    totalContributions: 847,
    currentPath: null,
    epicEntries: [],
    sessionActions: 0
  });
  
  // Current session
  const [currentSession, setCurrentSession] = useState({
    input: '',
    insight: '',
    color: '',
    txHash: '',
    ethicsReport: '',
    chosenPath: '',
    processing: false
  });
  
  // Community data (simulated)
  const [communityData, setCommunityData] = useState({
    collectiveInsight: '',
    dominantTrait: '',
    pathPercentage: 0,
    communityAvg: 4.2
  });

  // Utility functions
  const generateTxHash = useCallback(() => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }, []);

  const assignColor = useCallback((input) => {
    const text = input.toLowerCase();
    if (/past|memory|relationship|history|connection|story/.test(text)) return 'Red';
    if (/future|goal|plan|strategy|game|win|achieve/.test(text)) return 'Green';  
    if (/focus|discipline|work|master|habit|complete|wisdom/.test(text)) return 'Blue';
    if (/feel|emotion|creative|joy|wonder|heart|express/.test(text)) return 'Yellow';
    return ['Red', 'Green', 'Blue', 'Yellow'][Math.floor(Math.random() * 4)];
  }, []);

  const generateAIInsight = useCallback((input) => {
    const lowerInput = input.toLowerCase();
    if (/doubt|stuck|difficult/.test(lowerInput)) {
      return "Acknowledging uncertainty is already progress. What small step feels possible right now?";
    }
    if (/team|others|help|support/.test(lowerInput)) {
      return "Supporting others often reveals our own hidden strengths and capacity for leadership.";
    }
    return aiInsights[Math.floor(Math.random() * aiInsights.length)];
  }, []);

  // Process reflection 
  const processReflection = useCallback(async () => {
    if (currentSession.input.trim().length < 10) {
      alert('Please write at least 10 characters for meaningful insights.');
      return;
    }

    setCurrentSession(prev => ({ ...prev, processing: true }));
    setCurrentStep(STEPS.PROCESSING);
    SoundManager.play('transition', soundEnabled);
    
    // Simulate AI processing with staggered reveals
    setTimeout(() => {
      const color = assignColor(currentSession.input);
      const insight = generateAIInsight(currentSession.input);
      const txHash = generateTxHash();
      const ethics = ethicsReports[Math.floor(Math.random() * ethicsReports.length)];
      
      setCurrentSession(prev => ({
        ...prev,
        color,
        insight, 
        txHash,
        ethicsReport: ethics,
        processing: false
      }));
      
      // Update community data
      setCommunityData({
        collectiveInsight: collectiveInsights[Math.floor(Math.random() * collectiveInsights.length)],
        dominantTrait: collectiveTraits[Math.floor(Math.random() * collectiveTraits.length)],
        pathPercentage: Math.floor(Math.random() * 30) + 15,
        communityAvg: (Math.random() * 2 + 3).toFixed(1)
      });
      
      setCurrentStep(STEPS.INSIGHT);
      setAnimationPhase(1);
      SoundManager.play('insight', soundEnabled);
    }, 2500);
  }, [currentSession.input, assignColor, generateAIInsight, generateTxHash, soundEnabled]);

  // Select DOQ path
  const selectPath = useCallback((pathColor) => {
    SoundManager.play(colorPaths[pathColor].trait.toLowerCase(), soundEnabled);
    
    const newEntry = {
      id: Date.now(),
      input: currentSession.input,
      insight: currentSession.insight,
      color: pathColor,
      chosenPath: pathColor,
      intention: colorPaths[pathColor].name,
      timestamp: new Date().toLocaleString(),
      txHash: currentSession.txHash
    };
    
    setUserProfile(prev => ({
      ...prev,
      contributions: [newEntry, ...prev.contributions],
      epicEntries: [newEntry, ...prev.epicEntries], 
      totalContributions: prev.totalContributions + 1,
      sessionActions: prev.sessionActions + 1,
      currentPath: pathColor
    }));
    
    setCurrentSession(prev => ({ ...prev, chosenPath: pathColor }));
    setCurrentStep(STEPS.DASHBOARD);
    setAnimationPhase(2);
    SoundManager.play('complete', soundEnabled);
  }, [currentSession, soundEnabled]);

  // Start new reflection
  const startNew = useCallback(() => {
    setCurrentSession({
      input: '',
      insight: '',
      color: '',
      txHash: '',
      ethicsReport: '',
      chosenPath: '',
      processing: false
    });
    setCurrentStep(STEPS.INPUT);
    setAnimationPhase(0);
    SoundManager.play('transition', soundEnabled);
  }, [soundEnabled]);

  // Set dynamic CSS variables for theming
  useEffect(() => {
    if (currentSession.color) {
      document.documentElement.className = `theme-${currentSession.color.toLowerCase()}`;
    }
  }, [currentSession.color]);

  // Main render
  return (
    <div className="app-container">
      {currentStep === STEPS.WELCOME && (
        <WelcomeScreen 
          setCurrentStep={setCurrentStep}
          setSoundEnabled={setSoundEnabled}
          soundEnabled={soundEnabled}
          colorPaths={colorPaths}
          STEPS={STEPS}
        />
      )}
      {currentStep === STEPS.ONBOARD && (
        <OnboardingScreen 
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          setCurrentStep={setCurrentStep}
          STEPS={STEPS}
        />
      )}
      {currentStep === STEPS.INPUT && (
        <InputScreen 
          userProfile={userProfile}
          currentSession={currentSession}
          setCurrentSession={setCurrentSession}
          processReflection={processReflection}
        />
      )}
      {currentStep === STEPS.PROCESSING && <ProcessingScreen />}
      {currentStep === STEPS.INSIGHT && (
        <InsightScreen 
          currentSession={currentSession}
          colorPaths={colorPaths}
          animationPhase={animationPhase}
          setCurrentStep={setCurrentStep}
          STEPS={STEPS}
        />
      )}
      {currentStep === STEPS.JUDGMENT && (
        <JudgmentScreen 
          currentSession={currentSession}
          colorPaths={colorPaths}
          selectPath={selectPath}
        />
      )}
      {currentStep === STEPS.DASHBOARD && (
        <DashboardScreen 
          userProfile={userProfile}
          currentSession={currentSession}
          communityData={communityData}
          colorPaths={colorPaths}
          startNew={startNew}
          setCurrentStep={setCurrentStep}
          STEPS={STEPS}
        />
      )}
    </div>
  );
}
