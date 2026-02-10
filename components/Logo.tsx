import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-64" }) => (
  <svg 
    viewBox="0 0 800 280" 
    className={`${className} text-white`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Bar Le Jockey"
  >
    <defs>
      <style>
        {`
          .jockey-text { font-family: 'Playfair Display', serif; fill: currentColor; font-weight: 700; }
          .jockey-sub { font-family: 'Lato', sans-serif; fill: currentColor; font-weight: 400; letter-spacing: 0.15em; }
          .jockey-fill { fill: currentColor; }
          .jockey-stroke { stroke: currentColor; }
        `}
      </style>
    </defs>
    
    {/* --- LEFT SECTION (LE) --- */}
    
    {/* Top Double Lines */}
    <rect x="20" y="80" width="210" height="4" className="jockey-fill" />
    <rect x="20" y="90" width="210" height="1" className="jockey-fill" />
    
    {/* Bottom Double Lines */}
    <rect x="20" y="150" width="210" height="1" className="jockey-fill" />
    <rect x="20" y="156" width="210" height="4" className="jockey-fill" />

    {/* Left Vertical End Cap */}
    <rect x="20" y="80" width="8" height="80" className="jockey-fill" />
    
    {/* Left Hatching Pattern */}
    <line x1="38" y1="95" x2="38" y2="145" className="jockey-stroke" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />

    {/* Text: LE */}
    <text x="135" y="142" textAnchor="middle" fontSize="65" className="jockey-text">LE</text>


    {/* --- RIGHT SECTION (OCKEY) --- */}

    {/* Top Double Lines */}
    <rect x="370" y="80" width="410" height="4" className="jockey-fill" />
    <rect x="370" y="90" width="410" height="1" className="jockey-fill" />
    
    {/* Bottom Double Lines */}
    <rect x="370" y="150" width="410" height="1" className="jockey-fill" />
    <rect x="370" y="156" width="410" height="4" className="jockey-fill" />

    {/* Right Vertical End Cap */}
    <rect x="772" y="80" width="8" height="80" className="jockey-fill" />

    {/* Right Hatching Pattern */}
    <line x1="762" y1="95" x2="762" y2="145" className="jockey-stroke" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />

    {/* Text: OCKEY */}
    <text x="575" y="142" textAnchor="middle" fontSize="65" className="jockey-text">OCKEY</text>


    {/* --- CENTER (BIG J) --- */}
    
    {/* The 'J' sits in the gap. We add a stroke of the background color (simulated) 
        around it to separate it cleanly from lines if they touched, 
        though we've spaced the lines to accommodate it. */}
    <text x="300" y="225" textAnchor="middle" fontSize="220" className="jockey-text" 
          style={{ stroke: '#0e0e0e', strokeWidth: '12px', paintOrder: 'stroke' }}>J</text>
    {/* Re-render J on top for sharpness */}
    <text x="300" y="225" textAnchor="middle" fontSize="220" className="jockey-text">J</text>


    {/* --- SUBTITLE --- */}
    <text x="575" y="210" textAnchor="middle" fontSize="32" className="jockey-sub">BIÈRES &amp; COCKTAILS</text>
  </svg>
);

export default Logo;