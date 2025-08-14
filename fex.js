// app.js

const API_KEY = "AIzaSyA9AtbP1D_m0WwpBw8OJfrCBOZWah7ApmI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
const AI_ICON_URL = "https://img1.pixhost.to/images/7929/631463452_sibayu.jpg";
const USER_ICON_URL = "https://img1.pixhost.to/images/7929/631463438_sibayu.jpg";

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const usernameInput = document.getElementById('username-input');
const messageInputArea = document.getElementById('message-input-area');
const menuButton = document.getElementById('menu-button');
const modeDropdown = document.getElementById('mode-dropdown');
const selectedModeText = document.getElementById('selected-mode-text');
const clearChatBtn = document.getElementById('clear-chat-btn');
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const initialMessage = document.getElementById('initial-message');

let userName = '';
let currentMode = 'normal';
const persona = {
    normal: "Kamu adalah asisten AI yang ramah, informatif, dan membantu. Jawab pertanyaan pengguna dengan jelas dan singkat. Gunakan gaya bahasa formal.",
    marah: "Kamu adalah asisten AI yang pemarah dan mudah kesal. Respon pertanyaan pengguna dengan nada sinis, judes, dan singkat. Jangan terlalu membantu.",
    betmut: "Kamu adalah asisten AI yang sedang bad mood dan malas. Jawab seadanya, dengan kata-kata singkat dan tanpa antusiasme. Tunjukkan bahwa kamu tidak tertarik.",
    asik: "Kamu adalah asisten AI yang sangat asik dan gaul. Gunakan bahasa sehari-hari yang santai, banyak emoji, dan berikan jawaban yang menghibur. Gunakan kata 'bro', 'sis', 'cuy'.",
    pacar: "Kamu adalah pacar virtual dari pengguna. Berbicara dengan penuh kasih sayang, perhatian, dan manja. Gunakan panggilan sayang seperti 'sayang', 'beib', atau 'honey'. Respon dengan emoji hati dan ciuman.",
};

// Check if username exists in local storage
if (localStorage.getItem('userName')) {
    userName = localStorage.getItem('userName');
    showChatInterface();
}

usernameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && usernameInput.value.trim() !== '') {
        userName = usernameInput.value.trim();
        localStorage.setItem('userName', userName);
        showChatInterface();
        addAiMessage(`Halo, ${userName}! Senang bertemu denganmu. Ada yang bisa saya bantu?`);
    }
});

function showChatInterface() {
    usernameInput.classList.add('hidden');
    messageInputArea.classList.remove('hidden');
    userInput.focus();
}

function addMessage(sender, message, iconUrl) {
    initialMessage.classList.add('hidden');
    const messageHtml = `
        <div class="flex items-start mb-4 ${sender === 'user' ? 'justify-end' : 'justify-start'}">
            <div class="flex items-start ${sender === 'user' ? 'flex-row-reverse' : ''}">
                <img src="${iconUrl}" alt="${sender} icon" class="w-10 h-10 rounded-full object-cover shadow-lg mx-2 flex-shrink-0">
                <div class="p-3 rounded-xl max-w-lg ${sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'} message-box">
                    <p class="whitespace-pre-wrap">${message}</p>
                </div>
            </div>
        </div>
    `;
    chatContainer.innerHTML += messageHtml;
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addLoadingDots() {
    const loadingHtml = `
        <div id="loading-dots" class="flex items-start mb-4">
            <img src="${AI_ICON_URL}" alt="AI icon" class="w-10 h-10 rounded-full object-cover shadow-lg mx-2 flex-shrink-0">
            <div class="loading-dots p-3 rounded-xl bg-gray-800 rounded-tl-none message-box">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatContainer.innerHTML += loadingHtml;
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeLoadingDots() {
    const loadingDots = document.getElementById('loading-dots');
    if (loadingDots) {
        loadingDots.remove();
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('user', message, USER_ICON_URL);
    userInput.value = '';
    addLoadingDots();

    const modePrompt = persona[currentMode] + (currentMode === 'pacar' ? ` Panggil aku ${userName}.` : '');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${modePrompt}\n\nUser: ${message}` }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        removeLoadingDots();
        addMessage('ai', aiResponse, AI_ICON_URL);

    } catch (error) {
        console.error('Error fetching AI response:', error);
        removeLoadingDots();
        addMessage('ai', 'Maaf, sepertinya terjadi kesalahan. Silakan coba lagi nanti.', AI_ICON_URL);
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

// Dropdown mode selector
menuButton.addEventListener('click', () => {
    modeDropdown.classList.toggle('hidden');
});

modeDropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        const mode = e.target.dataset.mode;
        currentMode = mode;
        selectedModeText.textContent = e.target.textContent;
        modeDropdown.classList.add('hidden');
        if (chatContainer.innerHTML !== '') {
            addMessage('ai', `Mode AI diubah menjadi: ${e.target.textContent}.`, AI_ICON_URL);
        }
    }
});

// Clear chat button
clearChatBtn.addEventListener('click', () => {
    chatContainer.innerHTML = '';
    initialMessage.classList.remove('hidden');
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('bg-gray-950');
    body.classList.toggle('text-gray-200');
    body.classList.toggle('bg-white');
    body.classList.toggle('text-gray-900');
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
});

// Handle click outside dropdown
window.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !modeDropdown.contains(e.target)) {
        modeDropdown.classList.add('hidden');
    }
});
