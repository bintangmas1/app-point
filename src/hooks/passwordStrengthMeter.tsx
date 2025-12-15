

import { useEffect, useRef } from 'react';

interface PasswordStrengthMeterOptions {
  containerElement: string;
  passwordInput: string;
  height?: number;
  borderRadius?: number;
  colorScore1?: string;
  colorScore2?: string;
  colorScore3?: string;
  colorScore4?: string;
  pswMinLength?: number;
  showMessage?: boolean;
  messageContainer?: string;
  messagesList?: string[];
}

 
function passwordStrengthMeter(options: PasswordStrengthMeterOptions) {
  const styleElement = document.createElement('style');
  document.body.prepend(styleElement);

  styleElement.innerHTML = `
    ${options.containerElement} {
        height: ${options.height || 4}px;
        background-color: #e2e9fe;
        position: relative;
        overflow: hidden;
        border-radius: ${options.borderRadius?.toString() || '2'}px;
    }
    ${options.containerElement} .password-strength-meter-score {
      height: inherit;
      width: 0%;
      transition: .5s ease;
      background: ${options.colorScore1 || '#ea4c62'};
    }
    ${options.containerElement} .password-strength-meter-score.psms-25 {width: 25%; background: ${options.colorScore1 || '#ea4c62'};}
    ${options.containerElement} .password-strength-meter-score.psms-50 {width: 50%; background: ${options.colorScore2 || '#f1b10f'};}
    ${options.containerElement} .password-strength-meter-score.psms-75 {width: 75%; background: ${options.colorScore3 || '#1787b8'};}
    ${options.containerElement} .password-strength-meter-score.psms-100 {width: 100%; background: ${options.colorScore4 || '#2ecc4a'};}
  `;

  const containerElement = document.getElementById(options.containerElement.slice(1));
  if (!containerElement) return;
  
  containerElement.classList.add('password-strength-meter');

  const scoreElement = document.createElement('div');
  scoreElement.classList.add('password-strength-meter-score');
  containerElement.appendChild(scoreElement);

  const passwordInputElement = document.getElementById(options.passwordInput.slice(1)) as HTMLInputElement;
  if (!passwordInputElement) return;

  let currentPassword = '';
  passwordInputElement.addEventListener('keyup', function () {
    currentPassword = this.value;
    updateMeter(calculateScore());
  });

  const minLength = options.pswMinLength || 8;
  const messageElement = options.showMessage ? document.getElementById(options.messageContainer?.slice(1) || '') : null;
  const messages = options.messagesList || ['No data', 'Too simple', 'Simple', 'That\'s OK', 'Great password!'];

  function calculateScore() {
    let score = 0;
    const hasLowerCase = /(?=.*[a-z])/.test(currentPassword);
    const hasUpperCase = /(?=.*[A-Z])/.test(currentPassword);
    const hasNumbers = /(?=.*[0-9])/.test(currentPassword);
    const hasMinLength = new RegExp(`(?=.{${minLength},})`).test(currentPassword);

    if (hasLowerCase) score++;
    if (hasUpperCase) score++;
    if (hasNumbers) score++;
    if (hasMinLength) score++;
    if (score === 0 && currentPassword.length > 0) score++;

    return score;
  }

  function updateMeter(score: number) {
    switch (score) {
      case 1:
        scoreElement.className = 'password-strength-meter-score psms-25';
        if (messageElement) messageElement.textContent = messages[1] || 'Too simple';
        // containerElement.dispatchEvent(new Event('onScore1', { bubbles: true }));
        if (containerElement) {
          // Access the containerElement property or call methods on it
          containerElement.dispatchEvent(new Event('onScore1', { bubbles: true }));
        }
        break;
      case 2:
        scoreElement.className = 'password-strength-meter-score psms-50';
        if (messageElement) messageElement.textContent = messages[2] || 'Simple';
        // containerElement.dispatchEvent(new Event('onScore2', { bubbles: true })); 
        if (containerElement) {
          // Access the containerElement property or call methods on it
          containerElement.dispatchEvent(new Event('onScore2', { bubbles: true }));
        }
        break;
      case 3:
        scoreElement.className = 'password-strength-meter-score psms-75';
        if (messageElement) messageElement.textContent = messages[3] || 'That\'s OK';
        // containerElement.dispatchEvent(new Event('onScore3', { bubbles: true }));
        if (containerElement) {
          // Access the containerElement property or call methods on it
          containerElement.dispatchEvent(new Event('onScore3', { bubbles: true }));
        }        
        break;
      case 4:
        scoreElement.className = 'password-strength-meter-score psms-100';
        if (messageElement) messageElement.textContent = messages[4] || 'Great password!';
        // containerElement.dispatchEvent(new Event('onScore4', { bubbles: true }));
        if (containerElement) {
          // Access the containerElement property or call methods on it
          containerElement.dispatchEvent(new Event('onScore4', { bubbles: true }));
        }

        break;
      default:
        scoreElement.className = 'password-strength-meter-score';
        if (messageElement) messageElement.textContent = messages[0] || 'No data';
        // containerElement.dispatchEvent(new Event('onScore0', { bubbles: true }));
        if (containerElement) {
          // Access the containerElement property or call methods on it
          containerElement.dispatchEvent(new Event('onScore0', { bubbles: true }));
        }
    }
  }

  if (messageElement) {
    messageElement.textContent = messages[0] || 'No data';
  }

  return { containerElement, getScore: calculateScore };
}

const PasswordMeterComponent = () => {




  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const pswmeterRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (passwordInputRef.current && pswmeterRef.current) {
      passwordStrengthMeter({
        containerElement: '#pswmeter',
        passwordInput: '#psw-input',
        height: 4,
        borderRadius: 4,
        pswMinLength: 10,
        showMessage: true,
        messageContainer: '#pswmeter-message',
      });
    }
  }, []);


  

  return (
    <>
      <input type="password" id="psw-input" ref={passwordInputRef} />
      <div id="pswmeter" ref={pswmeterRef}></div>
      <div id="pswmeter-message" ref={messageRef}></div>
    </>
  );
};

export default PasswordMeterComponent;
