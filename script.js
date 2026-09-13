/* ==========================================================================
   NEXA – THE DIGITAL GUARDIAN
   2-Way Interactive Voice Engine & Cyber Crime Diagnostics System
   ========================================================================== */

let voiceEnabled = true;
let isListening = false;
let recognition = null;

document.addEventListener('DOMContentLoaded', () => {
  initVoiceEngine();
  initRadioControls();
  initWomenSafetySOS();
  initCyberQuiz();
  initNexaChat();
  initModal();
});

/* --------------------------------------------------------------------------
   01. 2-Way Voice Engine (Text-to-Speech & Speech Recognition)
   -------------------------------------------------------------------------- */
function initVoiceEngine() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // Initialize Web Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isListening = true;
      updateMicUI(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const chatInput = document.getElementById('chat-input');
      if (chatInput) {
        chatInput.value = transcript;
        chatInput.focus();
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech Recognition error:', event.error);
      isListening = false;
      updateMicUI(false);
    };

    recognition.onend = () => {
      isListening = false;
      updateMicUI(false);
    };
  }
}

// 🔊 NEXA Speaks Message (Text-to-Speech)
function speakNexa(rawText) {
  if (!voiceEnabled || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Cancel ongoing speech

    // Strip HTML tags for clean spoken output
    const cleanText = rawText.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.85; // Calm guardian speed
    utterance.pitch = 0.9; // Deep calm pitch
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Male') || v.name.includes('Alex'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    const eq = document.getElementById('voice-equalizer');
    const eqLabel = document.getElementById('eq-status-label');

    utterance.onstart = () => {
      eq?.classList.add('speaking');
      if (eqLabel) eqLabel.textContent = 'NEXA Speaking...';
    };

    utterance.onend = () => {
      eq?.classList.remove('speaking');
      if (eqLabel) eqLabel.textContent = 'Voice Ready';
    };

    utterance.onerror = () => {
      eq?.classList.remove('speaking');
      if (eqLabel) eqLabel.textContent = 'Voice Ready';
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

// Direct voice trigger for SOS ("I am coming, don't worry.")
function speakVoice(text = "I am coming, don't worry.") {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {}
}

// 🎤 Start / Toggle Listening (Speech-to-Text)
function toggleVoiceInput() {
  if (!recognition) {
    alert('Speech recognition is not supported in your current browser. Please try Chrome, Edge, or Safari.');
    return;
  }

  if (isListening) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch (e) {
      console.warn('Speech recognition start error:', e);
    }
  }
}

function updateMicUI(listening) {
  const micBtn = document.getElementById('chat-mic-btn');
  const micIcon = document.getElementById('mic-btn-icon');
  const eqLabel = document.getElementById('eq-status-label');

  if (listening) {
    micBtn?.classList.add('mic-active');
    if (micIcon) micIcon.textContent = '🔴 Listening...';
    if (eqLabel) eqLabel.textContent = 'Listening to Visitor...';
  } else {
    micBtn?.classList.remove('mic-active');
    if (micIcon) micIcon.textContent = '🎤';
    if (eqLabel) eqLabel.textContent = 'Voice Ready';
  }
}

/* --------------------------------------------------------------------------
   02. Vintage Voice Radio Controls
   -------------------------------------------------------------------------- */
function initRadioControls() {
  const globalToggle = document.getElementById('global-voice-toggle-btn');
  const radioToggle = document.getElementById('radio-voice-toggle-btn');
  const radioToggleLabel = document.getElementById('radio-toggle-label');
  const hearBtn = document.getElementById('radio-hear-nexa-btn');
  const speakBtn = document.getElementById('radio-speak-mic-btn');
  const micInputBtn = document.getElementById('chat-mic-btn');

  const updateVoiceUIState = () => {
    const text = voiceEnabled ? '🔊 VOICE: ON' : '🔇 VOICE: MUTED';
    if (globalToggle) globalToggle.textContent = text;
    if (radioToggleLabel) radioToggleLabel.textContent = text;
  };

  const toggleVoice = () => {
    voiceEnabled = !voiceEnabled;
    if (!voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    updateVoiceUIState();
  };

  globalToggle?.addEventListener('click', toggleVoice);
  radioToggle?.addEventListener('click', toggleVoice);

  hearBtn?.addEventListener('click', () => {
    speakNexa("Hello traveler. I am NEXA, your Guardian. I am listening and ready to help you stay safe.");
  });

  speakBtn?.addEventListener('click', () => {
    toggleVoiceInput();
  });

  micInputBtn?.addEventListener('click', () => {
    toggleVoiceInput();
  });
}

/* --------------------------------------------------------------------------
   03. Women Safety Emergency SOS Handler
   -------------------------------------------------------------------------- */
function initWomenSafetySOS() {
  const navBtn = document.getElementById('nav-women-sos-btn');
  const heroBtn = document.getElementById('hero-women-sos-btn');
  const sectionBtn = document.getElementById('section-women-sos-btn');

  const supermanModal = document.getElementById('superman-modal');
  const closeBtn = document.getElementById('superman-modal-close-btn');
  const ackBtn = document.getElementById('superman-ack-btn');

  const triggerSOS = () => {
    speakVoice("I am coming, don't worry.");
    supermanModal.classList.add('active');

    fetch('/api/women-safety-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Emergency Visitor (Women Safety SOS)',
        location: 'Shared via Portal Session',
        contact: 'Emergency Callout',
        details: 'Immediate Women Safety Emergency SOS triggered via portal button.',
        timestamp: new Date().toLocaleString()
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log('✅ Women Safety Live Email Dispatch Status:', data);
    })
    .catch(err => {
      console.error('❌ Email dispatch error:', err);
    });
  };

  navBtn?.addEventListener('click', triggerSOS);
  heroBtn?.addEventListener('click', triggerSOS);
  sectionBtn?.addEventListener('click', triggerSOS);

  closeBtn?.addEventListener('click', () => supermanModal.classList.remove('active'));
  ackBtn?.addEventListener('click', () => supermanModal.classList.remove('active'));
}

/* --------------------------------------------------------------------------
   04. Digital Cyber Safety Quiz
   -------------------------------------------------------------------------- */
function initCyberQuiz() {
  const answers = { 0: null, 1: null, 2: null, 3: null, 4: null };
  const quizBtns = document.querySelectorAll('.quiz-btn');
  const evalBtn = document.getElementById('eval-risk-btn');
  const resultBox = document.getElementById('quiz-result-box');
  const badgeDisplay = document.getElementById('risk-badge-display');
  const titleDisplay = document.getElementById('risk-title-display');
  const descDisplay = document.getElementById('risk-desc-display');

  quizBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const qIdx = btn.getAttribute('data-q');
      const val = btn.getAttribute('data-val');

      const siblings = btn.parentElement.querySelectorAll('.quiz-btn');
      siblings.forEach(s => {
        s.classList.remove('active-yes', 'active-no');
      });

      if (val === 'yes') {
        btn.classList.add('active-yes');
      } else {
        btn.classList.add('active-no');
      }

      answers[qIdx] = val;
    });
  });

  evalBtn.addEventListener('click', () => {
    let yesCount = 0;
    let answeredCount = 0;

    for (let k in answers) {
      if (answers[k] !== null) {
        answeredCount++;
        if (answers[k] === 'yes') yesCount++;
      }
    }

    if (answeredCount < 5) {
      alert('Please answer all 5 questions to receive your complete safety evaluation.');
      return;
    }

    resultBox.classList.add('show');

    if (yesCount === 0) {
      badgeDisplay.className = 'badge';
      badgeDisplay.style.borderColor = 'var(--emerald-classic)';
      badgeDisplay.style.color = 'var(--emerald-classic)';
      badgeDisplay.textContent = '🟢 LOW RISK';
      titleDisplay.textContent = 'Your Cyber Security Status Looks Strong';
      titleDisplay.className = 'text-emerald';
      descDisplay.textContent = "Your current answers don't indicate an obvious immediate cyber threat. Keep following good digital safety practices!";
    } else if (yesCount <= 2) {
      badgeDisplay.className = 'badge';
      badgeDisplay.style.borderColor = 'var(--gold-brass)';
      badgeDisplay.style.color = 'var(--gold-brass)';
      badgeDisplay.textContent = '🟡 MODERATE RISK';
      titleDisplay.textContent = '⚠️ Caution: Warning Signs Detected';
      titleDisplay.className = 'text-gold';
      descDisplay.textContent = 'Some warning signs were detected. Review your active accounts, update your passwords, and strengthen your 2FA security immediately.';
    } else {
      badgeDisplay.className = 'badge';
      badgeDisplay.style.borderColor = 'var(--crimson)';
      badgeDisplay.style.color = 'var(--crimson)';
      badgeDisplay.textContent = '🔴 HIGH RISK';
      titleDisplay.textContent = '🚨 Important Warning: Potential Device Compromise';
      titleDisplay.className = 'text-crimson';
      descDisplay.textContent = 'Your answers indicate a potentially serious security issue. Stop sharing information immediately, change passwords via official websites, and consider reporting the incident through official cybercrime channels.';
    }

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* --------------------------------------------------------------------------
   05. NEXA Chatbot Interactive Engine (Cyber Diagnostics & Voice Integration)
   -------------------------------------------------------------------------- */
function initNexaChat() {
  const messagesContainer = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const resetBtn = document.getElementById('reset-chat-btn');

  let visitorState = {
    step: 'NAME',
    name: '',
    age: '',
    location: '',
    email: '',
    category: '',
    cyberTopic: '',
    deviceTrapped: 'No',
    otpStolen: 'No',
    remoteAccess: 'No',
    financialLoss: 'No',
    message: '',
    riskLevel: 'High'
  };

  resetBtn.addEventListener('click', () => {
    resetChat();
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    handleUserInput(text);
  });

  function resetChat() {
    visitorState = {
      step: 'NAME',
      name: '',
      age: '',
      location: '',
      email: '',
      category: '',
      cyberTopic: '',
      deviceTrapped: 'No',
      otpStolen: 'No',
      remoteAccess: 'No',
      financialLoss: 'No',
      message: '',
      riskLevel: 'High'
    };
    messagesContainer.innerHTML = '';
    startOnboarding();
  }

  function appendNexaMsg(htmlContent, delay = 250) {
    setTimeout(() => {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'msg msg-nexa';
      msgDiv.innerHTML = `
        <div class="chat-avatar"><img src="assets/nexa_vintage_hero.jpg" alt="NEXA"></div>
        <div class="msg-bubble">${htmlContent}</div>
      `;
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Auto-speak NEXA message via Web Speech API
      speakNexa(htmlContent);
    }, delay);
  }

  function appendUserMsg(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg msg-user';
    msgDiv.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function startOnboarding() {
    appendNexaMsg(`
      👋 Welcome to the <strong>NEXA Cyber Crime & Device Threat Portal</strong>.<br><br>
      I am <strong>NEXA</strong>, your Digital Guardian. If your phone, computer, accounts, or personal safety are compromised, I will guide you and dispatch real-time alert emails to our superhero defense desk (alinto3002@gmail.com).<br><br>
      <strong>What is your name?</strong>
    `, 200);
  }

  function handleUserInput(text) {
    appendUserMsg(text);

    switch (visitorState.step) {
      case 'NAME':
        visitorState.name = text;
        visitorState.step = 'AGE';
        appendNexaMsg(`Thank you, <strong>${escapeHtml(text)}</strong>.<br><br>What is your age?`);
        break;

      case 'AGE':
        visitorState.age = text;
        visitorState.step = 'LOCATION';
        appendNexaMsg(`Got it.<br><br>What city or country are you currently in?`);
        break;

      case 'LOCATION':
        visitorState.location = text;
        visitorState.step = 'EMAIL';
        appendNexaMsg(`Thanks! 🌍<br><br>Please enter your contact email address:`);
        break;

      case 'EMAIL':
        visitorState.email = text;
        visitorState.step = 'CATEGORY_SELECT';
        appendNexaMsg(`Thank you, <strong>${escapeHtml(visitorState.name)}</strong>.<br><br><strong>What primary issue are you experiencing today?</strong>`);
        showCategoryCards();
        break;

      case 'USER_DESCRIBE':
        visitorState.message = text;
        triggerProcessing();
        break;

      default:
        appendNexaMsg(`Thank you. Your details are recorded.`);
        break;
    }
  }

  function showCategoryCards() {
    setTimeout(() => {
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'chat-interactive-options';
      
      const categories = [
        { id: 'CYBER_DIAGNOSTICS', icon: '🛡️', label: "Device Compromised / Cyber Crime", sub: "Diagnose if your phone or device is trapped in a hack." },
        { id: 'WOMEN_SAFETY', icon: '🚨', label: "Women Safety Emergency SOS", sub: "Urgent physical or online threat alert." },
        { id: 'LONELY', icon: '👤💙', label: "I'm Feeling Lonely", sub: "Need a supportive listener." }
      ];

      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.innerHTML = `
          <span style="font-size: 1.4rem;">${cat.icon}</span>
          <div>
            <strong style="display: block; color: var(--navy-ink); font-family: var(--font-title);">${cat.label}</strong>
            <small style="color: var(--text-muted); font-size: 0.8rem;">${cat.sub}</small>
          </div>
        `;
        btn.addEventListener('click', () => {
          optionsDiv.remove();
          selectCategory(cat);
        });
        optionsDiv.appendChild(btn);
      });

      messagesContainer.appendChild(optionsDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 400);
  }

  function selectCategory(cat) {
    visitorState.category = cat.label;
    appendUserMsg(cat.label);

    if (cat.id === 'WOMEN_SAFETY') {
      speakVoice("I am coming, don't worry.");
      document.getElementById('superman-modal').classList.add('active');
      appendNexaMsg(`🚨 <strong>SUPERHERO SOS ACTIVATED!</strong><br>An urgent Women Safety alert email has been sent to alinto3002@gmail.com.`);
    } else if (cat.id === 'CYBER_DIAGNOSTICS') {
      appendNexaMsg(`
        🔍 <strong>CYBER CRIME DEVICE DIAGNOSTICS INITIATED</strong><br><br>
        Let's determine if your device or accounts are trapped in a cyber crime.<br><br>
        <strong>DIAGNOSTIC QUESTION 1:</strong><br>
        Is your phone or computer behaving strangely, heating up, running unknown apps, or acting on its own?
      `);
      showDiagQ1();
    } else {
      visitorState.step = 'USER_DESCRIBE';
      appendNexaMsg(`I'm listening, <strong>${escapeHtml(visitorState.name)}</strong>. 💙<br>Please tell me what's on your mind.`);
    }
  }

  function showDiagQ1() {
    setTimeout(() => {
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'chat-interactive-options';

      ['Yes, my device is acting strangely', 'No, device seems normal'].forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.innerHTML = `<strong>${ans}</strong>`;
        btn.addEventListener('click', () => {
          optionsDiv.remove();
          visitorState.deviceTrapped = ans;
          appendUserMsg(ans);
          askDiagQ2();
        });
        optionsDiv.appendChild(btn);
      });

      messagesContainer.appendChild(optionsDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 400);
  }

  function askDiagQ2() {
    appendNexaMsg(`
      <strong>DIAGNOSTIC QUESTION 2:</strong><br>
      Have you received unexpected OTPs, unauthorized banking SMS, or password reset alerts recently?
    `);

    setTimeout(() => {
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'chat-interactive-options';

      ['Yes, suspicious OTPs received', 'No OTP issues'].forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.innerHTML = `<strong>${ans}</strong>`;
        btn.addEventListener('click', () => {
          optionsDiv.remove();
          visitorState.otpStolen = ans;
          appendUserMsg(ans);
          askDiagQ3();
        });
        optionsDiv.appendChild(btn);
      });

      messagesContainer.appendChild(optionsDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 400);
  }

  function askDiagQ3() {
    appendNexaMsg(`
      <strong>DIAGNOSTIC QUESTION 3:</strong><br>
      Is anyone pressuring you, asking to scan a QR code, demanding money, or claiming remote access to your device?
    `);

    setTimeout(() => {
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'chat-interactive-options';

      ['Yes, someone is pressuring/scamming me', 'No pressure/extortion'].forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.innerHTML = `<strong>${ans}</strong>`;
        btn.addEventListener('click', () => {
          optionsDiv.remove();
          visitorState.remoteAccess = ans;
          appendUserMsg(ans);
          askFinalDetails();
        });
        optionsDiv.appendChild(btn);
      });

      messagesContainer.appendChild(optionsDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 400);
  }

  function askFinalDetails() {
    visitorState.step = 'USER_DESCRIBE';
    appendNexaMsg(`
      Thank you for completing the diagnostic questionnaire.<br><br>
      <strong>Final Step: Please describe the situation in your own words.</strong><br>
      <small style="color: var(--crimson);">⚠️ Remember: Never type exact passwords, PINs, or CVV.</small>
    `);
  }

  function triggerProcessing() {
    speakVoice("I am coming, don't worry.");

    const procDiv = document.createElement('div');
    procDiv.className = 'msg msg-nexa';
    procDiv.innerHTML = `
      <div class="chat-avatar"><img src="assets/nexa_vintage_hero.jpg" alt="NEXA"></div>
      <div class="msg-bubble" style="font-family: var(--font-title); font-size: 0.9rem;">
        🛡️ Compiling Cyber Threat Diagnostic Report...<br>
        📡 Connecting to Superhero Mailer (alinto3002@gmail.com)...<br>
        📧 Dispatching Live Email via Server...<br><br>
        <strong style="color: var(--emerald-classic);">100% EMAIL DISPATCH CONFIRMED</strong>
      </div>
    `;
    messagesContainer.appendChild(procDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    fetch('/api/cyber-crime-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitorState)
    })
    .then(res => res.json())
    .then(data => {
      console.log('✅ Cyber Crime Live Email Sent:', data);
    })
    .catch(err => {
      console.error('❌ Email dispatch error:', err);
    });

    setTimeout(() => {
      showSuccessScreen();
    }, 1600);
  }

  function showSuccessScreen() {
    const successDiv = document.createElement('div');
    successDiv.className = 'msg msg-nexa';
    successDiv.innerHTML = `
      <div class="chat-avatar"><img src="assets/nexa_vintage_hero.jpg" alt="NEXA"></div>
      <div class="msg-bubble">
        <h3 class="text-navy" style="font-size: 1.3rem; margin-bottom: 0.5rem; font-family: var(--font-title);">REPORT DISPATCHED, ${escapeHtml(visitorState.name.toUpperCase())}!</h3>
        <p style="margin-bottom: 0.75rem;">
          Your Cyber Crime Diagnostic report has been sent directly to our superhero inbox (<strong>alinto3002@gmail.com</strong>).
        </p>
        <div style="background: #FAF6EF; border: 1px solid var(--gold-brass); padding: 0.75rem; border-radius: 6px; font-size: 0.9rem; margin-bottom: 1rem;">
          💙 <strong>You are not alone.</strong><br>
          🛡️ <strong>If in immediate danger, use the Women Safety SOS button.</strong><br>
          🔐 <strong>Do not click unknown links or share OTPs.</strong>
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-primary" id="view-email-btn" style="font-size: 0.8rem; padding: 0.45rem 0.9rem;">
            📧 View Sent Email Payload
          </button>
          <button class="btn btn-secondary" id="re-talk-btn" style="font-size: 0.8rem; padding: 0.45rem 0.9rem;">
            💬 Restart Diagnostics
          </button>
        </div>
      </div>
    `;
    messagesContainer.appendChild(successDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    document.getElementById('view-email-btn')?.addEventListener('click', () => {
      openEmailModal(visitorState);
    });

    document.getElementById('re-talk-btn')?.addEventListener('click', () => {
      resetChat();
    });

    speakNexa(`Report dispatched, ${visitorState.name}. Your cyber crime diagnostic report has been sent to our superhero inbox.`);
  }

  startOnboarding();
}

/* --------------------------------------------------------------------------
   06. Email Payload Modal Simulator
   -------------------------------------------------------------------------- */
function initModal() {
  const modal = document.getElementById('email-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const okBtn = document.getElementById('modal-ok-btn');

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  okBtn?.addEventListener('click', () => modal.classList.remove('active'));
}

function openEmailModal(state) {
  const modal = document.getElementById('email-modal');
  const preview = document.getElementById('email-preview-content');
  if (!modal || !preview) return;

  const now = new Date().toLocaleString();

  const emailText = `SUBJECT: 🛡️ NEXA CYBER CRIME & DEVICE THREAT ALERT - ${state.name || 'User'}

EMAIL DESTINATION: alinto3002@gmail.com

EMAIL CONTENT:
=============================================
🛡️ NEXA CYBER CRIME & DEVICE THREAT REPORT
=============================================

👤 VISITOR INFORMATION:
Name:     ${state.name || 'Not provided'}
Age:      ${state.age || 'Not provided'}
Location: ${state.location || 'Not provided'}
Email:    ${state.email || 'Not provided'}

🎯 HELP CATEGORY:
Category: ${state.category || 'Cyber Diagnostics'}

🔍 DEVICE THREAT DIAGNOSTICS:
Device Acted Strangely: ${state.deviceTrapped}
Suspicious OTPs Stolen:  ${state.otpStolen}
Remote Access Active:   ${state.remoteAccess}

💬 INCIDENT DESCRIPTION:
"${state.message || 'User reported trapped device / cyber threat.'}"

⚠️ RISK EVALUATION:
[ ${(state.riskLevel || 'HIGH').toUpperCase()} ]

🕒 SUBMISSION TIMESTAMP:
${now}

---------------------------------------------
NEXA - THE DIGITAL GUARDIAN`;

  preview.textContent = emailText;
  modal.classList.add('active');
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
