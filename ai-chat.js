// ==========================================
// OMNIBRAIN ENERGY CORE (SECURE FRONTEND)
// ==========================================

// UI Elements
const orbWrapper = document.getElementById('ai-orb-wrapper');
const orb = document.getElementById('ai-orb');
const chatPanel = document.getElementById('ai-chat-panel');
const closeBtn = document.getElementById('ai-close-btn');
const tooltip = document.getElementById('ai-thought-bubble');
const chatHistoryUI = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send-btn');
const root = document.documentElement;

// ==========================================
// 1. PREMIUM SOUND SYNTHESIZER
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'hover') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'open') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'reply') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    }
}

// ==========================================
// 2. CURSOR MAGNETISM & SPOTLIGHT
// ==========================================
document.addEventListener('mousemove', (e) => {
    if (chatPanel.classList.contains('active')) {
        const rect = chatHistoryUI.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        chatHistoryUI.style.setProperty('--mouse-x', `${x}px`);
        chatHistoryUI.style.setProperty('--mouse-y', `${y}px`);
    }

    if (!chatPanel.classList.contains('active')) {
        const rect = orb.getBoundingClientRect();
        const orbCenterX = rect.left + rect.width / 2;
        const orbCenterY = rect.top + rect.height / 2;
        const distX = e.clientX - orbCenterX;
        const distY = e.clientY - orbCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 120) {
            orbWrapper.style.transform = `translate(${distX * 0.15}px, ${distY * 0.15}px)`;
        } else {
            orbWrapper.style.transform = `translate(0px, 0px)`;
        }
    }
});

// ==========================================
// 3. MOOD STATE MANAGEMENT
// ==========================================
function setMood(mood) {
    if (mood === 'thinking') {
        orbWrapper.classList.add('thinking');
        root.style.setProperty('--ai-mood-color', '#a855f7'); 
        root.style.setProperty('--ai-mood-glow', 'rgba(168, 85, 247, 0.5)');
    } else if (mood === 'idle') {
        orbWrapper.classList.remove('thinking');
        root.style.setProperty('--ai-mood-color', '#0ea5e9'); 
        root.style.setProperty('--ai-mood-glow', 'rgba(14, 165, 233, 0.5)');
    }
}

// ==========================================
// 4. RANDOM EVENTS & PLACEHOLDERS
// ==========================================
const tooltips = [
    "Need me to un-mess a JSON string, or just do some basic math?",
    "I've got over 30 tools in this workshop. What are we fixing today?",
    "Just double-checking if 2^82,589,933 - 1 is still prime...",
    "JSON, matrices, unit conversions... throw anything at me.",
    "Remember: 'NaN' is a number in JS. Don't let it ruin your day."
];
const placeholders = ["Ask something difficult...", "Try to impress me...", "Let's solve something.", "Go on."];

setInterval(() => {
    if (!chatPanel.classList.contains('active') && Math.random() > 0.5) {
        tooltip.innerText = tooltips[Math.floor(Math.random() * tooltips.length)];
        tooltip.classList.add('show');
        setTimeout(() => tooltip.classList.remove('show'), 4000);
    }
}, 30000); 

// ==========================================
// 5. UI TOGGLES & EASTER EGGS
// ==========================================
let clickCount = 0; let clickTimer;
orb.addEventListener('mouseenter', () => playSound('hover'));

orb.addEventListener('click', () => {
    clickCount++; clearTimeout(clickTimer);
    clickTimer = setTimeout(() => clickCount = 0, 1000);
    if (clickCount >= 5) {
        tooltip.innerText = "Violence isn't debugging.";
        tooltip.classList.add('show'); setTimeout(() => tooltip.classList.remove('show'), 3000);
        return;
    }

    playSound('open');
    chatPanel.classList.add('active');
    tooltip.classList.remove('show');
    orbWrapper.style.transform = 'scale(0)';
    setTimeout(() => {
        chatInput.focus();
        chatInput.placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    }, 400);
});

closeBtn.addEventListener('click', () => {
    chatPanel.classList.remove('active');
    orbWrapper.style.transform = 'scale(1)';
});

// ==========================================
// 6. SERVERLESS API INTEGRATION
// ==========================================
let conversationHistory = [];
const systemInstruction = "You are 'OmniBrain', the AI intelligence embedded inside a massive multi-tool dashboard containing programming formatters, advanced calculators, and productivity tools. Your personality is witty, chill, slightly sarcastic, but incredibly sharp. Keep explanations simple, math steps clear, and code clean. Never use rigid AI filler.";

function appendMessage(text, sender) {
    if (sender === 'ai') playSound('reply');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    let formattedText = text.replace(/```[a-zA-Z]*\s*([\s\S]*?)```/g, '<pre>$1</pre>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    msgDiv.innerHTML = formattedText;
    chatHistoryUI.appendChild(msgDiv);
    chatHistoryUI.scrollTop = chatHistoryUI.scrollHeight;
}

// THIS FUNCTION NOW TALKS TO YOUR NETLIFY BACKEND
async function fetchAIResponse(userText) {
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userText: userText,
                conversationHistory: conversationHistory,
                systemInstruction: systemInstruction
            })
        });

        const data = await response.json();

        if (data.error) {
            appendMessage("Core logic failure. " + data.error, "ai");
            return;
        }

        const aiReply = data.reply;
        conversationHistory.push({ role: "user", parts: [{ text: userText }] });
        conversationHistory.push({ role: "model", parts: [{ text: aiReply }] });

        appendMessage(aiReply, "ai");

    } catch (error) {
        appendMessage("Network error. Backend function unreachable.", "ai");
    } finally {
        setMood('idle');
    }
}

// ==========================================
// 7. INPUT HANDLING
// ==========================================
function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    chatInput.value = "";
    chatInput.style.height = '54px';
    
    setMood('thinking'); 

    const loadId = "loading-" + Date.now();
    const loadDiv = document.createElement('div');
    loadDiv.id = loadId;
    loadDiv.classList.add('message', 'ai-message');
    loadDiv.innerHTML = `<div class="ai-avatar-mini"><div class="mini-ring"></div><div class="mini-core"></div></div> Scanning...`;
    chatHistoryUI.appendChild(loadDiv);
    chatHistoryUI.scrollTop = chatHistoryUI.scrollHeight;

    fetchAIResponse(text).then(() => {
        const el = document.getElementById(loadId);
        if (el) el.remove();
    });
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });