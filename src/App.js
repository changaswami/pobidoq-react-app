import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Heart, Target, Zap, Book, BarChart3, RefreshCw, MessageCircle, Send, CheckCircle2, Star, Smile, Lightbulb, Compass } from 'lucide-react';
import './App.css'; // <--- NEW: Import your CSS file here

const PobidoqApp = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);
  const [journeyEntries, setJourneyEntries] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showFloatingEmojis, setShowFloatingEmojis] = useState([]);
  const [inputFeedback, setInputFeedback] = useState('');
  const [pulseElement, setPulseElement] = useState(null);
  const [userStats, setUserStats] = useState({
    totalContributions: 0,
    currentStreak: 1,
    dominantColor: 'Yellow',
    colorEvolution: ['Yellow']
  });

  const colorPaths = {
    Red: { 
      emoji: '🔴', 
      trait: 'Universe', 
      description: 'Your actions are deeply rooted in your past, shaping your personal story and connections.',
      gradient: 'from-red-400 to-red-600',
      particles: '✨🌟💫',
      sound: 'universe'
    },
    Green: { 
      emoji: '🟢', 
      trait: 'Game', 
      description: 'Your choices are part of a larger game, influencing the future and evolving your character.',
      gradient: 'from-green-400 to-green-600',
      particles: '🎮🏆🎯',
      sound: 'game'
    },
    Blue: { 
      emoji: '🔵', 
      trait: 'Race', 
      description: 'You seek to master your reality, embracing duties and finding clarity in the silence of your purpose.',
      gradient: 'from-blue-400 to-blue-600',
      particles: '🌊⚡🔷',
      sound: 'race'
    },
    Yellow: { 
      emoji: '🟡', 
      trait: 'Step', 
      description: 'Your experience is driven by emotion, listening to your inner questions to transcend limitations.',
      gradient: 'from-yellow-400 to-yellow-600',
      particles: '☀️🌻💛',
      sound: 'step'
    }
  };

  const aiInsights = [
    "Your consistent effort is building strong foundations. What new perspective did you gain?",
    "That challenge you faced shows remarkable resilience. How will you apply this strength?",
    "Your mindful approach creates space for deeper understanding. What patterns are emerging?",
    "Taking action despite uncertainty demonstrates courage. How does this align with your values?",
    "This reflection reveals your commitment to growth. What question is your heart asking?"
  ];

  // Typing animation hook
  useEffect(() => {
    if (currentStep === 'insight' && aiResponse) {
      setTypingText('');
      let i = 0;
      const timer = setInterval(() => {
        if (i < aiResponse.length) {
          setTypingText(aiResponse.substring(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [aiResponse, currentStep]);

  // Floating emoji animation
  const createFloatingEmojis = (emojis, count = 5) => {
    const newEmojis = [];
    for (let i = 0; i < count; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      newEmojis.push({
        id: Date.now() + i,
        emoji,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        delay: i * 200
      });
    }
    setShowFloatingEmojis(newEmojis);
    setTimeout(() => setShowFloatingEmojis([]), 3000);
  };

  // Input feedback based on content
  const analyzeInput = (text) => {
    const positive = ['happy', 'joy', 'success', 'achieve', 'grateful', 'love', 'amazing', 'wonderful'];
    const challenging = ['difficult', 'hard', 'struggle', 'challenge', 'tough', 'overcome'];
    const reflective = ['think', 'reflect', 'realize', 'understand', 'learn', 'discover'];
    
    const words = text.toLowerCase().split(' ');
    
    if (positive.some(word => words.includes(word))) {
      setInputFeedback('✨ Feeling the positivity!');
      createFloatingEmojis(['😊', '🌟', '💖', '🎉']);
    } else if (challenging.some(word => words.includes(word))) {
      setInputFeedback('💪 Strength in challenges!');
      createFloatingEmojis(['💪', '⚡', '🔥', '🌟']);
    } else if (reflective.some(word => words.includes(word))) {
      setInputFeedback('🤔 Deep thoughts emerging...');
      createFloatingEmojis(['💭', '🧠', '💡', '✨']);
    } else if (text.length > 50) {
      setInputFeedback('📝 Rich story unfolding...');
    }
  };

  const simulateAI = async (input) => {
    setIsProcessing(true);
    setCurrentStep('processing');
    
    // Simulate processing delay with progress
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple color classification with enhanced feedback
    const inputLower = input.toLowerCase();
    let detectedColor = 'Yellow';
    
    if (inputLower.includes('past') || inputLower.includes('memory') || inputLower.includes('relationship')) {
      detectedColor = 'Red';
    } else if (inputLower.includes('goal') || inputLower.includes('future') || inputLower.includes('plan')) {
      detectedColor = 'Green';
    } else if (inputLower.includes('focus') || inputLower.includes('work') || inputLower.includes('discipline')) {
      detectedColor = 'Blue';
    }

    const insight = aiInsights[Math.floor(Math.random() * aiInsights.length)];
    
    setAiResponse(insight);
    setUserStats(prev => ({
      ...prev,
      dominantColor: detectedColor,
      colorEvolution: [...prev.colorEvolution, detectedColor]
    }));
    
    setIsProcessing(false);
    // After processing, transition to insight screen
    setCurrentStep('insight'); // <--- ADDED THIS LINE
  };

  const selectPath = (color) => {
    setSelectedPath(color);
    setPulseElement(color);
    
    // Show celebration animation
    setShowCelebration(true);
    createFloatingEmojis(colorPaths[color].particles.split(''), 8);
    
    setTimeout(() => {
      setCurrentStep('complete');
      setShowCelebration(false);
      setPulseElement(null);
    }, 2000);
    
    // Add to journey
    const newEntry = {
      id: Date.now(),
      input: userInput,
      insight: aiResponse,
      path: color,
      timestamp: new Date().toLocaleString()
    };
    
    setJourneyEntries(prev => [newEntry, ...prev]);
    setUserStats(prev => ({
      ...prev,
      totalContributions: prev.totalContributions + 1
    }));
  };

  const startNew = () => {
    setCurrentStep('input');
    setUserInput('');
    setAiResponse('');
    setSelectedPath(null);
    setInputFeedback('');
    setTypingText('');
    setShowFloatingEmojis([]); // Clear floating emojis on new cycle
  };

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['✨', '🌟', '💫', '🌱', '💖'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="max-w-2xl text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="text-6xl mb-4 animate-bounce-gentle">🌱</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            pobidoq
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up">
            Transform your daily moments into meaningful insights. 
            Share your growth, receive AI guidance, and shape your evolving story.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {Object.entries(colorPaths).map(([color, data], index) => (
            <div 
              key={color} 
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg transform hover:scale-110 transition-all duration-300 animate-fade-in-up cursor-pointer hover:shadow-xl"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-3xl mb-2 animate-pulse-gentle">{data.emoji}</div>
              <div className="font-semibold text-gray-800">{data.trait}</div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setCurrentStep('input')}
          className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse-gentle"
        >
          Begin Your Journey
          <ChevronRight className="inline ml-2 group-hover:translate-x-2 transition-transform duration-300" />
        </button>
      </div>

    </div>
  );

  const InputScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Floating feedback emojis */}
      {showFloatingEmojis.map(({ id, emoji, x, y, delay }) => (
        <div
          key={id}
          className="fixed text-2xl pointer-events-none z-50 animate-float-up"
          style={{
            left: x,
            top: y,
            animationDelay: `${delay}ms`
          }}
        >
          {emoji}
        </div>
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center py-8 animate-slide-down">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Share Your Moment</h2>
          <p className="text-gray-600">What did you do, feel, or learn today?</p>
          {inputFeedback && (
            <div className="mt-2 text-sm font-medium text-indigo-600 animate-bounce-gentle">
              {inputFeedback}
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-500 animate-scale-up">
          <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse-gentle">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">AI Growth Guide</div>
                <div className="text-sm text-gray-500 animate-typing">Ready to explore your contribution...</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Example prompts */}
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                { text: "I meditated for 10 minutes and felt more centered", icon: "🧘" },
                { text: "Had a challenging conversation but learned something new", icon: "💬" },
                { text: "Completed a difficult project despite feeling overwhelmed", icon: "🎯" },
                { text: "Took time for self-reflection during my walk", icon: "🚶" }
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setUserInput(prompt.text);
                    analyzeInput(prompt.text);
                  }}
                  className="text-left p-4 bg-gray-50 hover:bg-indigo-50 rounded-2xl transition-all duration-300 text-sm text-gray-700 transform hover:scale-105 hover:shadow-md group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg group-hover:animate-bounce-gentle">{prompt.icon}</span>
                    <span>"{prompt.text}"</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Input area */}
            <div className="relative">
              <textarea
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  if (e.target.value.length > 20) { // Only analyze after a certain length to avoid too many updates
                    analyzeInput(e.target.value);
                  } else {
                    setInputFeedback(''); // Clear feedback if input is too short
                  }
                }}
                placeholder="Share your growth moment, challenge, or reflection..."
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                rows="4"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm transition-colors duration-300 ${userInput.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {userInput.length}/500
                  </span>
                  {userInput.length > 20 && ( // Only show ping animation after a certain length
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => simulateAI(userInput)}
                  disabled={userInput.trim().length < 10}
                  className={`bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-110 ${userInput.trim().length >= 10 ? 'animate-pulse-gentle' : ''}`}
                >
                  <Send className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats if returning user */}
        {userStats.totalContributions > 0 && (
          <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 animate-slide-up">
            <h3 className="font-semibold text-gray-800 mb-4">Your Growth Journey</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-2xl font-bold text-indigo-600">{userStats.totalContributions}</div>
                <div className="text-sm text-gray-600">Contributions</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-2xl font-bold text-purple-600">{userStats.currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-2xl animate-bounce-gentle">{colorPaths[userStats.dominantColor]?.emoji}</div>
                <div className="text-sm text-gray-600">Current Path</div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );

  const ProcessingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${1 + Math.random()}rem`
            }}
          >
            {['🧠', '💡', '✨', '🔍', '⚡'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="text-center space-y-6 relative z-10">
        <div className="relative">
          <div className="w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-4 border-purple-400 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-4 border-4 border-pink-600 rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-2 animate-fade-in">
          <h3 className="text-3xl font-semibold text-gray-800 animate-pulse-text">Analyzing your contribution...</h3>
          <p className="text-gray-600">AI is crafting personalized insights for your growth</p>
        </div>
        
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>

        {/* Progress indicators */}
        <div className="space-y-3 mt-8">
          {['Understanding context', 'Identifying patterns', 'Generating insights'].map((step, i) => (
            <div key={i} className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div 
                className={`w-2 h-2 rounded-full transition-colors duration-500 ${i <= 1 ? 'bg-green-400' : 'bg-gray-300'}`}
                style={{ transitionDelay: `${i * 1000}ms` }}
              ></div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  const InsightScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-4 relative">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-celebration">🎉</div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-8 relative z-10">
        <div className="text-center mb-8 animate-slide-down">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 animate-check-mark" />
          <h2 className="text-3xl font-bold text-gray-800">Your Insight is Ready!</h2>
        </div>

        {/* Insight Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 transform animate-scale-up hover:shadow-2xl transition-all duration-500">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-gentle">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">AI Insight</h3>
              <p className="text-lg text-gray-700 italic leading-relaxed">
                "{typingText}
                {typingText.length < aiResponse.length && <span className="animate-blink">|</span>}
                "
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl animate-fade-in-up" style={{ animationDelay: '2s' }}>
            <p className="text-sm text-gray-600 mb-2"><strong>Your contribution:</strong></p>
            <p className="text-gray-800">{userInput}</p>
          </div>
        </div>

        {/* Path Selection */}
        <div className="bg-white rounded-3xl shadow-xl p-8 animate-slide-up">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Choose Your Path Forward</h3>
          <p className="text-gray-600 text-center mb-8">How do you wish to continue your journey?</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(colorPaths).map(([color, data], index) => (
              <button
                key={color}
                onClick={() => selectPath(color)}
                className={`group p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-xl animate-fade-in-up ${
                  pulseElement === color ? 'animate-pulse-strong border-indigo-400' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center space-x-4 mb-3">
                  <div className="text-4xl group-hover:animate-bounce-gentle transition-transform duration-300">{data.emoji}</div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors">{data.trait}</h4>
                    <div className={`text-sm font-semibold bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent`}>
                      Path of {color}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">{data.description}</p>
                
                {/* Hover particles */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {data.particles.split('').map((particle, i) => (
                    <div
                      key={i}
                      className="absolute animate-float text-sm"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${10 + i * 15}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    >
                      {particle}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );

  const CompleteScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 relative overflow-hidden">
      {/* Floating celebration particles */}
      {showFloatingEmojis.map(({ id, emoji, x, y, delay }) => (
        <div
          key={id}
          className="fixed text-3xl pointer-events-none z-50 animate-float-celebration"
          style={{
            left: x,
            top: y,
            animationDelay: `${delay}ms`
          }}
        >
          {emoji}
        </div>
      ))}

      <div className="max-w-6xl mx-auto py-8 relative z-10">
        <div className="text-center mb-8 animate-scale-up">
          <div className="text-6xl mb-4 animate-bounce-celebration">🌟</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Journey Complete!</h2>
          <p className="text-gray-600">Your contribution has been added to your growth story</p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 transform hover:shadow-2xl transition-all duration-500 animate-slide-up">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2 animate-bounce-gentle">{colorPaths[selectedPath]?.emoji}</div>
              <div className="font-semibold text-gray-800">Chosen Path</div>
              <div className="text-sm text-gray-600">{colorPaths[selectedPath]?.trait}</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2 text-indigo-600 font-bold animate-count-up">{userStats.totalContributions}</div>
              <div className="font-semibold text-gray-800">Total Contributions</div>
              <div className="text-sm text-gray-600">Growing stronger daily</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2 animate-pulse">📈</div>
              <div className="font-semibold text-gray-800">Progress Made</div>
              <div className="text-sm text-gray-600">Insights gained</div>
            </div>
          </div>
        </div>

        {/* Journey History */}
        {journeyEntries.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Book className="mr-3 animate-pulse-gentle" />
              Your Growth Story
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {journeyEntries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="border border-gray-200 rounded-2xl p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl animate-bounce-gentle">{colorPaths[entry.path]?.emoji}</span>
                      <span className="font-semibold text-gray-800">Entry #{journeyEntries.length - index}</span>
                    </div>
                    <span className="text-sm text-gray-500">{entry.timestamp}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{entry.input}</p>
                  <p className="text-sm text-gray-600 italic flex items-center">
                    <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
                    {entry.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={startNew}
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 animate-pulse-gentle"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>New Contribution</span>
          </button>
          <button className="group border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105">
            <BarChart3 className="w-5 h-5 group-hover:animate-bounce" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

    </div>
  );

  // Render appropriate screen
  if (currentStep === 'welcome') return <WelcomeScreen />;
  if (currentStep === 'input') return <InputScreen />;
  if (isProcessing) return <ProcessingScreen />;
  if (currentStep === 'insight') return <InsightScreen />;
  if (currentStep === 'complete') return <CompleteScreen />;
};

export default PobidoqApp;