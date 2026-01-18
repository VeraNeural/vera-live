export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    position: fixed;
    inset: 0;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes gentlePulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.02); }
  }

  @keyframes typing {
    0%, 60%, 100% { opacity: 0.3; }
    30% { opacity: 1; }
  }

  .message-appear {
    animation: fadeIn 0.3s ease-out;
  }

  .prompt-btn {
    transition: all 0.2s ease;
  }
  .prompt-btn:hover {
    transform: translateY(-2px);
  }
  .prompt-btn:active {
    transform: scale(0.98);
  }

  .prompt-scroll {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  .prompt-scroll::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }

  .hide-scrollbar {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
    overflow: -moz-scrollbars-none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
    -webkit-appearance: none !important;
  }
  .hide-scrollbar::-webkit-scrollbar-track {
    background: transparent !important;
  }
  .hide-scrollbar::-webkit-scrollbar-thumb {
    background: transparent !important;
  }

  .room-pill {
    transition: all 0.2s ease;
  }
  .room-pill:hover {
    transform: translateY(-2px);
  }
  .room-pill:active {
    transform: scale(0.96);
  }

  .chat-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .chat-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .chat-scroll::-webkit-scrollbar-thumb {
    background: rgba(150, 140, 130, 0.3);
    border-radius: 4px;
  }

  .input-field:focus {
    outline: none;
  }
`;