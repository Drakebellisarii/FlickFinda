import { useEffect, useState } from 'react';

export default function CurtainTransition() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Start with curtains closed
    setIsOpen(false);
    
    // Open curtains after a brief delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100);

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
