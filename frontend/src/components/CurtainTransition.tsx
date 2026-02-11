import { useEffect, useState } from 'react';

const CURTAIN_OPEN_DELAY = 100; // Delay before opening curtains for smooth page load effect

export default function CurtainTransition() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Start with curtains closed
    setIsOpen(false);
    
    // Open curtains after a brief delay to allow page content to render
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, CURTAIN_OPEN_DELAY);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="curtain-container">
      <div 
        className="curtain curtain-left"
        style={{
          transform: isOpen ? 'translateX(-100%)' : 'translateX(0)',
        }}
      />
      <div 
        className="curtain curtain-right"
        style={{
          transform: isOpen ? 'translateX(100%)' : 'translateX(0)',
        }}
      />
    </div>
  );
}
