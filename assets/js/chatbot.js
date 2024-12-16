window.toggleChat = null;
window.handleSubmit = null;

const dialogflowConfig = {
    projectId: 'portfolio-bot-444903',
    sessionId: Math.random().toString(36).substring(7),
    languageCode: 'en-US'
};


// Enhanced responses object
const enhancedResponses = {
    experience: {
        triggers: ['experience', 'work', 'career', 'background', 'history'],
        responses: [
            " Wow, you're asking about quite the tech journey! Sai has crushed it with 4+ years in Full Stack Development, transforming DBS Bank's payment systems and revolutionizing EdTech at EdLight. We're talking about processing $1B+ in transactions and slashing processing times by 50%! Pretty impressive, right?",
            " Let me tell you about Sai's incredible tech adventure! From optimizing core banking systems at DBS Bank (improving performance by 45%!) to pioneering EdTech solutions, he's been on fire! Want to hear about his role as a FinTech innovator?",
            " Talk about a powerhouse portfolio! Sai's been crushing it in the tech world for 4+ years, earning titles like 'Super Rookie' and 'Star Performer' at DBS Bank. His magic touch has improved system efficiency by 40% and revolutionized payment processing. Shall we dive into the details?"
        ]
    },
    skills: {
        triggers: ['skills', 'technologies', 'tech stack', 'coding', 'languages', 'tools'],
        responses: [
            " Ready to be amazed? Sai's tech arsenal is seriously impressive! We're talking full-stack mastery with Java, Spring Boot, React, Angular, Python, and cloud tech. But here's the real kicker - he uses these to boost system performance by 40%+ consistently! Want to know more about any specific tech?",
            " Imagine having a Swiss Army knife of tech skills - that's Sai! From crafting lightning-fast React frontends to engineering robust Spring Boot microservices, he's got it all. Plus, he's a wizard with AI/ML tools! Which technology interests you most?",
            " Hold onto your hat - Sai's skill set is mind-blowing! He's not just proficient in multiple programming languages; he's using them to revolutionize FinTech and EdTech. Think payment systems with 99% accuracy and 35% better student engagement. Cool, right?"
        ]
    },
    education: {
        triggers: ['education', 'study', 'degree', 'university', 'academic', 'college'],
        responses: [
            " Check this out - Sai's rocking a Master's in Computer Science from Georgia State University with a stellar 3.93 GPA! But wait, there's more - he's constantly learning and implementing cutting-edge tech. Want to hear about his research interests?",
            " Talk about academic excellence! Sai combines theoretical mastery (3.93 GPA in MS Computer Science) with practical innovation. His research in AI accessibility is particularly fascinating. Shall I tell you more about his academic achievements?",
            " Sai's academic journey is impressive - MS in Computer Science with near-perfect grades, plus groundbreaking research in AI accessibility. He's the perfect blend of academic excellence and practical innovation. What aspect interests you most?"
        ]
    },
    projects: {
        triggers: ['projects', 'portfolio', 'achievements', 'work', 'build'],
        responses: [
            " Oh, you're in for a treat! Sai's project portfolio is mind-blowing! His SWIFT Payment Automation project handles $1B+ in transactions with 99% accuracy. Plus, he's developed AI tools that boost accessibility by 43%! Want to dive deeper into any of these?",
            " Let me tell you about some game-changing projects! From revolutionizing banking systems (46% faster!) to creating AI-powered accessibility tools, Sai's portfolio is packed with innovation. Which project catches your eye?",
            " Ready to be impressed? Sai's projects include a payment system processing billions in transactions, AI tools for accessibility, and EdTech platforms that boosted student engagement by 35%! Want the inside scoop on any of these?"
        ]
    },
    contact: {
        triggers: ['contact', 'hire', 'reach', 'email', 'connect', 'message'],
        responses: [
            " Looking to connect with Sai? Perfect timing! You can reach him at 404-729-2160 or connect on LinkedIn. He's always excited to discuss new opportunities and innovative ideas! Shall I share his LinkedIn profile?",
            " Want to bring Sai's innovation to your team? Great choice! You can reach him via email at patibandlasaipranithedu@gmail.com or connect on LinkedIn. He's always up for exciting tech challenges! How would you like to connect?",
            " Ready to collaborate with Sai? You're just a message away! Whether it's through LinkedIn, email, or a phone call (404-729-2160), he's always eager to discuss new opportunities. What's your preferred way to connect?"
        ]
    },
    default: {
        responses: [
            " Hey there! I'm super excited to tell you about Sai's amazing tech journey! Want to hear about his experience with billion-dollar payment systems, his 3.93 GPA Master's degree, or his innovative projects? Just ask away!",
            " Welcome! I'd love to share Sai's incredible tech story with you! From FinTech innovation to AI accessibility tools, there's so much to explore. What interests you most?",
            " Hi! Ready to discover how Sai is revolutionizing tech across FinTech and EdTech? Whether it's his projects, skills, or experience, I've got all the exciting details! What would you like to know?"
        ]
    }
};

// Initialize chat state and references
const chatState = {
    isOpen: false,
    hasInitialMessage: false,
    conversationHistory: []
};

let isTyping = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.querySelector('.chatbot-messages');
    const messageInput = document.querySelector('.chatbot-input');
    const robotContainer = document.querySelector('.robot-container');

    try {
        const { SessionsClient } = require('@google-cloud/dialogflow').v2;
        const dialogflow = new SessionsClient();
        const sessionPath = dialogflow.projectAgentSessionPath(
            dialogflowConfig.projectId,
            dialogflowConfig.sessionId
        );
    } catch (error) {
        console.error('Failed to initialize Dialogflow:', error);
    }

    // Toggle chat window
    window.toggleChat = function() {
        chatState.isOpen = !chatState.isOpen;

        if (chatState.isOpen) {
            chatWindow.style.display = 'flex';
            setTimeout(() => chatWindow.classList.add('active'), 10);
            robotContainer.classList.add('hidden');

            if (!chatState.hasInitialMessage) {
                const initialMessage = getRandomResponse(enhancedResponses.default.responses);
                addMessage(initialMessage, 'bot');
                chatState.hasInitialMessage = true;
            }

            messageInput?.focus();
        } else {
            chatWindow.classList.remove('active');
            setTimeout(() => chatWindow.style.display = 'none', 300);
            robotContainer.classList.remove('hidden');
        }
    };

    // Handle message submission
    window.handleSubmit = async function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();

        if (message) {
            // Add user message
            addMessage(message, 'user');
            messageInput.value = '';

            // Show typing indicator
            showTypingIndicator();

            // Generate response with delay for natural feel
            setTimeout(() => {
                const response = generateResponse(message);
                hideTypingIndicator();
                addMessage(response, 'bot');

                // Add to conversation history
                chatState.conversationHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: response }
                );
            }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        }
    };

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender} animate__animated animate__fadeIn`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;

        if (sender === 'bot') {
            // Add reactions for bot messages
            const reactionsDiv = document.createElement('div');
            reactionsDiv.className = 'message-reactions animate__animated animate__fadeIn';

            const reactions = [
                { emoji: '👍', label: 'Helpful' },
                { emoji: '👎', label: 'Not Helpful' }
            ];

            reactions.forEach(({ emoji, label }) => {
                const button = document.createElement('button');
                button.className = 'reaction-btn';
                button.innerHTML = `${emoji}<span class="reaction-tooltip">${label}</span>`;
                button.onclick = function() {
                    handleReaction(this, text, emoji);
                };
                reactionsDiv.appendChild(button);
            });

            contentDiv.appendChild(reactionsDiv);
        }

        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle message reactions
    function handleReaction(button, message, reaction) {
        const buttons = button.parentElement.querySelectorAll('.reaction-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Animate reaction
        button.style.animation = 'none';
        button.offsetHeight;
        button.style.animation = 'bounce 0.3s ease';

        // Log reaction (can be extended to analytics)
        console.log(`Reaction ${reaction} for message: ${message}`);
    }

    // Show typing indicator
    function showTypingIndicator() {
        if (!isTyping) {
            isTyping = true;
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator animate__animated animate__fadeIn';
            typingDiv.innerHTML = `
                <div class="typing-bubble">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        isTyping = false;
    }

    // Generate response based on user input
    function generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Find matching category
        for (const category in enhancedResponses) {
            if (category !== 'default' &&
                enhancedResponses[category].triggers?.some(trigger => lowerMessage.includes(trigger))) {
                return getRandomResponse(enhancedResponses[category].responses);
            }
        }

        // Default response if no category matches
        return getRandomResponse(enhancedResponses.default.responses);
    }

    // Get random response from array
    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Set up keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatState.isOpen) {
            window.toggleChat();
        }
        if (e.key === 'Enter' && !e.shiftKey && chatState.isOpen) {
            const form = document.querySelector('.chatbot-input-area');
            if (form) {
                e.preventDefault();
                window.handleSubmit(e);
            }
        }
    });

    // Initialize chat window as hidden
    if (chatWindow) {
        chatWindow.style.display = 'none';
    }
});