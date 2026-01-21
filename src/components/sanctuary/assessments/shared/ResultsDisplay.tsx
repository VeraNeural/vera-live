import React from 'react';

interface ResultsDisplayProps {
  insights: string[];
  recommendations: string[];
  accentColor: string;
  primaryColor: string;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  cardBorder: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  insights,
  recommendations,
  accentColor,
  primaryColor,
  textColor,
  mutedColor,
  cardBg,
  cardBorder,
}) => {
  return (
    <div>
      {/* Insights */}
      <div style={{ padding: 20, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>Key Insights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {insights.map((insight, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: 12, color: accentColor }}>{i + 1}</span>
              </div>
              <p style={{ fontSize: 14, color: mutedColor, lineHeight: 1.6 }}>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ padding: 20, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>Your Growth Path</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${primaryColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: 14, color: primaryColor }}>→</span>
              </div>
              <p style={{ fontSize: 14, color: mutedColor, lineHeight: 1.6 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;