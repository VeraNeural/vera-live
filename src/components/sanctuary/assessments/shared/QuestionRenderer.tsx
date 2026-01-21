import React, { useState } from 'react';
import { Question } from './types';

interface QuestionRendererProps {
  question: Question;
  handleAnswer: (value: number) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, handleAnswer }) => {
  const [sliderValue, setSliderValue] = useState(question.min || 1);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.4, marginBottom: question.subtext ? 8 : 0 }}>
        {question.text}
      </h2>
      {question.subtext && <p style={{ fontSize: 14 }}>{question.subtext}</p>}

      {/* Scale/Choice Options */}
      {(question.type === 'scale' || question.type === 'choice') && question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option.value)}
              style={{ padding: '18px 20px', borderRadius: 16, cursor: 'pointer' }}
            >
              <div style={{ fontSize: 16, fontWeight: 500 }}>{option.label}</div>
              {option.description && <div style={{ fontSize: 13 }}>{option.description}</div>}
            </button>
          ))}
        </div>
      )}

      {/* Slider */}
      {question.type === 'slider' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <input
            type="range"
            min={question.min || 1}
            max={question.max || 10}
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <button onClick={() => handleAnswer(sliderValue)}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;