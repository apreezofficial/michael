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

  // Scroll to top on screen change or question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen, currentIndex]);

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
        <div className="glass-card animate-slide-up" style={{ textAlign: 'center' }}>
          <div className="badge">DEVELOPER CERTIFICATION v2.0</div>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1 }}>
            Forge Your <br /><span className="gradient-text">Expertise</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3.5rem', fontSize: '1.25rem', maxWidth: '480px', marginInline: 'auto', fontWeight: 500 }}>
            An elite assessment platform for modern engineering. Sharp, precise, and uncompromising.
          </p>
          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => setScreen('settings')}>
              Configure Session
            </button>
            <button className="btn-outline" onClick={handleStartQuiz}>
              Quick Start
            </button>
          </div>
        </div>
      )}

      {/* Settings Screen */}
      {screen === 'settings' && (
        <div className="glass-card animate-slide-up">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>Session Parameters</h2>
          
          <div className="setting-section">
            <label className="setting-label">Domain Selection</label>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Timed Protocol (15s)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Strict timeout enforcement per unit</p>
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
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real-time Analytics</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Immediate validation of input vectors</p>
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
            Initialize Session
          </button>
        </div>
      )}

      {/* Quiz Screen */}
      {screen === 'quiz' && currentQuestion && (
        <div className="glass-card animate-slide-up">
          <div className="quiz-top-bar">
            <div className="progress-info">
              <span className="question-tag">{category}</span>
              <span className="count-tag">Module {currentIndex + 1} / {filteredQuestions.length}</span>
            </div>
            {timerEnabled && (
              <div className={`timer-tag ${timeLeft < 5 ? 'danger' : ''}`}>
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
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
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
              {!isAnswered ? (
                <button 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                  disabled={!selectedOption}
                  onClick={handleManualSubmit}
                >
                  Validate Response
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                  onClick={handleNext}
                >
                  Proceed to Next Module
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Result Screen */}
      {screen === 'result' && (
        <div className="glass-card animate-slide-up" style={{ textAlign: 'center' }}>
          <div className="badge">EVALUATION COMPLETE</div>
          <h2 style={{ fontSize: '3.5rem', margin: '1rem 0', lineHeight: 1 }}>Final <br />Assessment</h2>
          
          <div className="result-stats">
            <div className="stat-box">
              <span className="stat-value gradient-text">{score}</span>
              <span className="stat-label">Verified</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{filteredQuestions.length - score}</span>
              <span className="stat-label">Failed</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{Math.round((score / filteredQuestions.length) * 100)}%</span>
              <span className="stat-label">Precision</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', margin: '2rem 0 3.5rem', fontSize: '1.1rem', fontWeight: 500 }}>
            {score === filteredQuestions.length 
              ? "Flawless execution. You have achieved maximum theoretical proficiency." 
              : score >= filteredQuestions.length * 0.8 
                ? "Highly proficient. Minimal refinement required in specific vectors." 
                : "Competency verified. Significant optimization potential remains."}
          </p>
          
          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => setScreen('landing')}>
              Return to Terminal
            </button>
            <button className="btn-outline" onClick={handleStartQuiz}>
              Recalibrate
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .badge {
          display: inline-block;
          padding: 0.6rem 1.2rem;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .setting-section {
          background: rgba(255, 255, 255, 0.01);
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
        }
        .setting-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.8rem;
        }
        .category-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .category-card:hover {
          background: var(--glass-hover);
        }
        .category-card.selected {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }
        .toggle-switch {
          width: 44px;
          height: 24px;
          appearance: none;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .toggle-switch:checked {
          background: #ffffff;
        }
        .toggle-switch::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .toggle-switch:checked::before {
          left: 23px;
          background: black;
        }
        .quiz-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .progress-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .question-tag {
          background: #ffffff;
          color: #000000;
          padding: 0.3rem 0.7rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
        }
        .count-tag {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 700;
        }
        .timer-tag {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.4rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
        }
        .timer-tag.danger {
          color: var(--error);
          border-color: var(--error);
          background: rgba(244, 63, 94, 0.1);
        }
        .question-text {
          font-size: 2rem;
          margin-bottom: 3rem;
          line-height: 1.2;
          font-weight: 800;
        }
        .options-container {
          display: grid;
          gap: 0.8rem;
        }
        .option-card {
          display: flex;
          align-items: center;
          padding: 1.4rem 1.8rem;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .option-card:hover:not(.correct):not(.wrong) {
          background: var(--glass-hover);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateX(8px);
        }
        .option-card.selected {
          border-color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }
        .option-card.correct {
          border-color: var(--success);
          background: rgba(16, 185, 129, 0.1);
        }
        .option-card.wrong {
          border-color: var(--error);
          background: rgba(244, 63, 94, 0.1);
        }
        .option-letter {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--text-secondary);
          border: 1px solid var(--glass-border);
        }
        .option-card.selected .option-letter {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }
        .option-text {
          font-size: 1.15rem;
          font-weight: 600;
          flex: 1;
        }
        .status-icon {
          font-size: 1.2rem;
          font-weight: 900;
        }
        .result-stats {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          margin: 3rem 0;
        }
        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-value {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -0.05em;
        }
        .stat-label {
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-top: 0.5rem;
        }
      `}</style>
    </main>
  );
}
