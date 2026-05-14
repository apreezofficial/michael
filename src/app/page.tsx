'use client';

import { useState, useEffect, useMemo } from 'react';
import { quizData, Question } from '@/data/quizData';
import './globals.css';

type ScreenState = 'landing' | 'settings' | 'quiz' | 'result';

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>('landing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);
  
  // New States
  const [category, setCategory] = useState<string>('All');
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(quizData.map((q) => q.category)));
    return ['All', ...cats];
  }, []);

  const filteredQuestions = useMemo(() => {
    if (category === 'All') return quizData;
    return quizData.filter((q) => q.category === category);
  }, [category]);

  const currentQuestion = filteredQuestions[currentIndex];

  // Timer Logic
  useEffect(() => {
    if (screen === 'quiz' && timerEnabled && !isAnswered && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAutoSubmit();
    }
  }, [screen, timeLeft, timerEnabled, isAnswered]);

  const handleStartQuiz = () => {
    setScreen('quiz');
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setTimeLeft(15);
    setIsAnswered(false);
    setShowFeedback(null);
  };

  const handleAutoSubmit = () => {
    setIsAnswered(true);
    setShowFeedback(false);
    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    
    if (instantFeedback) {
      const isCorrect = option === currentQuestion.correctAnswer;
      setIsAnswered(true);
      setShowFeedback(isCorrect);
      if (isCorrect) setScore((prev) => prev + 1);
      
      setTimeout(() => {
        handleNext();
      }, 1500);
    }
  };

  const handleManualSubmit = () => {
    if (!selectedOption || isAnswered) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setIsAnswered(true);
    setShowFeedback(isCorrect);
    if (isCorrect) setScore((prev) => prev + 1);

    if (!instantFeedback) {
      // Logic for non-instant feedback could be different, 
      // but here we just mark it and show a "Next" button.
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setScreen('result');
    }
  };

  const getProgress = () => ((currentIndex + 1) / filteredQuestions.length) * 100;

  return (
    <main>
      {/* Landing Screen */}
      {screen === 'landing' && (
        <div className="glass-card animate-fade-in" style={{ textAlign: 'center' }}>
          <div className="badge">PREMIUM EXPERIENCE</div>
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Master the <br /><span className="gradient-text">Modern Stack</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '500px', marginInline: 'auto' }}>
            A high-stakes, timed quiz designed for elite developers. Test your limits across multiple disciplines.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => setScreen('settings')}>
              Configure Quiz
            </button>
            <button className="btn-outline" onClick={handleStartQuiz}>
              Quick Start
            </button>
          </div>
        </div>
      )}

      {/* Settings Screen */}
      {screen === 'settings' && (
        <div className="glass-card animate-scale-in">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Quiz Settings</h2>
          
          <div className="setting-section">
            <label className="setting-label">Select Category</label>
            <div className="category-grid">
              {categories.map((cat) => (
                <div 
                  key={cat} 
                  className={`category-card ${category === cat ? 'selected' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <div className="setting-section" style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem' }}>Timer (15s / question)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Automatically move to next on timeout</p>
              </div>
              <input 
                type="checkbox" 
                checked={timerEnabled} 
                onChange={(e) => setTimerEnabled(e.target.checked)}
                className="toggle-switch"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem' }}>Instant Feedback</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Show results immediately after selection</p>
              </div>
              <input 
                type="checkbox" 
                checked={instantFeedback} 
                onChange={(e) => setInstantFeedback(e.target.checked)}
                className="toggle-switch"
              />
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', marginTop: '3rem' }} onClick={handleStartQuiz}>
            Start Custom Quiz
          </button>
        </div>
      )}

      {/* Quiz Screen */}
      {screen === 'quiz' && currentQuestion && (
        <div className="glass-card animate-fade-in">
          <div className="quiz-top-bar">
            <div className="progress-info">
              <span className="question-tag">{category}</span>
              <span className="count-tag">Question {currentIndex + 1}/{filteredQuestions.length}</span>
            </div>
            {timerEnabled && (
              <div className={`timer-tag ${timeLeft < 5 ? 'danger' : ''}`}>
                {timeLeft}s
              </div>
            )}
          </div>

          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${getProgress()}%` }}></div>
          </div>

          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="options-container">
            {currentQuestion.options.map((option) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = selectedOption === option;
              
              let statusClass = '';
              if (isAnswered) {
                if (isCorrect) statusClass = 'correct';
                else if (isSelected) statusClass = 'wrong';
              } else if (isSelected) {
                statusClass = 'selected';
              }

              return (
                <div 
                  key={option} 
                  className={`option-card ${statusClass}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + currentQuestion.options.indexOf(option))}</span>
                  <span className="option-text">{option}</span>
                  {isAnswered && isCorrect && <span className="status-icon">✓</span>}
                  {isAnswered && isSelected && !isCorrect && <span className="status-icon">✗</span>}
                </div>
              );
            })}
          </div>

          {!instantFeedback && (
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              {!isAnswered ? (
                <button 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                  disabled={!selectedOption}
                  onClick={handleManualSubmit}
                >
                  Submit Answer
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                  onClick={handleNext}
                >
                  Next Question
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Result Screen */}
      {screen === 'result' && (
        <div className="glass-card animate-scale-in" style={{ textAlign: 'center' }}>
          <div className="badge">QUIZ COMPLETED</div>
          <h2 style={{ fontSize: '3rem', margin: '1rem 0' }}>Performance Review</h2>
          
          <div className="result-stats">
            <div className="stat-box">
              <span className="stat-value gradient-text">{score}</span>
              <span className="stat-label">Correct</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{filteredQuestions.length - score}</span>
              <span className="stat-label">Incorrect</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{Math.round((score / filteredQuestions.length) * 100)}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', margin: '2rem 0 3rem', fontSize: '1.1rem' }}>
            {score === filteredQuestions.length 
              ? "Exceptional! You've demonstrated complete mastery." 
              : score >= filteredQuestions.length / 2 
                ? "Solid performance. You're well on your way to mastery." 
                : "A good start. Keep practicing to sharpen your skills."}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => setScreen('landing')}>
              Main Menu
            </button>
            <button className="btn-outline" onClick={handleStartQuiz}>
              Retry Quiz
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          color: var(--accent);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
        }
        .setting-section {
          background: rgba(255, 255, 255, 0.02);
          padding: 2rem;
          border-radius: 24px;
          border: 1px solid var(--glass-border);
        }
        .setting-label {
          display: block;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .toggle-switch {
          width: 50px;
          height: 26px;
          appearance: none;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
        }
        .toggle-switch:checked {
          background: var(--accent);
        }
        .toggle-switch::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: all 0.3s;
        }
        .toggle-switch:checked::before {
          left: 27px;
        }
        .quiz-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .progress-info {
          display: flex;
          gap: 0.8rem;
        }
        .question-tag {
          background: var(--accent-gradient);
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .count-tag {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .timer-tag {
          font-family: monospace;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--accent);
          background: rgba(99, 102, 241, 0.1);
          padding: 0.3rem 1rem;
          border-radius: 12px;
        }
        .timer-tag.danger {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
          animation: pulse 1s infinite;
        }
        .question-text {
          font-size: 1.75rem;
          margin-bottom: 2.5rem;
          line-height: 1.3;
        }
        .options-container {
          display: grid;
          gap: 1rem;
        }
        .option-card {
          display: flex;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .option-card:hover:not(.correct):not(.wrong) {
          background: var(--glass-hover);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }
        .option-card.selected {
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.1);
        }
        .option-card.correct {
          border-color: var(--success);
          background: rgba(16, 185, 129, 0.15);
        }
        .option-card.wrong {
          border-color: var(--error);
          background: rgba(239, 68, 68, 0.15);
        }
        .option-letter {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.2rem;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .option-card.selected .option-letter {
          background: var(--accent);
          color: white;
        }
        .option-text {
          font-size: 1.1rem;
          font-weight: 500;
          flex: 1;
        }
        .status-icon {
          font-size: 1.2rem;
          font-weight: 700;
        }
        .result-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
        }
        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
        }
        .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
