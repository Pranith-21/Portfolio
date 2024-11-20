// First declare the functions in the global scope
window.toggleChat = null;
window.handleSubmit = null;

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Import Google Generative AI
    let genAI;
    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const API_KEY = "AIzaSyDKBaD6a8rwA-BX1hNEEMW4QipYP7OSkb0";
        genAI = new GoogleGenerativeAI(API_KEY);
    } catch (error) {
        console.warn("AI functionality not available:", error);
    }

    // Context for the AI
    const contextPrompt = `You are an AI assistant for Sai's portfolio website. You should:
    1. Be professional and friendly
    2. Give concise answers about Sai's experience, skills, projects, and education
    3. Use emojis sparingly but effectively
    4. Share relevant details from his portfolio including:
       - 4+ years of Full Stack Development experience
       - Work at DBS Bank and EdLight
       - Masters in Computer Science with 3.93 GPA
       - Expertise in Java, Spring Boot, React, Angular, Python
       - Notable projects like SWIFT Payment Automation
    5. Keep responses clear and engaging`;

    // Select DOM elements
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.querySelector('.chatbot-messages');
    const messageInput = document.querySelector('.chatbot-input');
    const robotContainer = document.querySelector('.robot-container');
    let isTyping = false;

    // Initialize chat state
    const chatState = {
        isOpen: false,
        hasInitialMessage: false
    };

    // Define toggleChat function and make it globally available
    window.toggleChat = function() {
        chatState.isOpen = !chatState.isOpen;

        if (chatState.isOpen) {
            chatWindow.style.display = 'flex';
            setTimeout(() => chatWindow.classList.add('active'), 10);
            robotContainer.classList.add('hidden');

            if (!chatState.hasInitialMessage) {
                addMessage("Hi! 👋 I'm Sai's AI assistant. I can help you learn more about his experience, projects, or skills. What would you like to know?", 'bot');
                chatState.hasInitialMessage = true;
            }

            if (messageInput) {
                messageInput.focus();
            }
        } else {
            chatWindow.classList.remove('active');
            setTimeout(() => chatWindow.style.display = 'none', 300);
            robotContainer.classList.remove('hidden');
        }
    };

    // Generate AI response
    async function generateAIResponse(prompt) {
        if (!genAI) {
            return getBotResponse(prompt); // Fallback to default responses
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(
                `${contextPrompt}\n\nHuman: ${prompt}\n\nAssistant:`
            );
            return result.response.text();
        } catch (error) {
            console.error("Error generating AI response:", error);
            return getBotResponse(prompt); // Fallback to default responses
        }
    }

    // Define handleSubmit function and make it globally available
    window.handleSubmit = async function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();

        if (message) {
            addMessage(message, 'user');
            messageInput.value = '';
            showTypingIndicator();

            try {
                const response = await generateAIResponse(message);
                hideTypingIndicator();
                addMessage(response, 'bot');
            } catch (error) {
                hideTypingIndicator();
                const fallbackResponse = getBotResponse(message);
                addMessage(fallbackResponse, 'bot');
            }
        }
    };

    // Helper function to add messages
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;

        if (sender === 'bot') {
            const reactionsDiv = document.createElement('div');
            reactionsDiv.className = 'message-reactions';

            const reactions = [
                { emoji: '👍' },
                { emoji: '👎' }
            ];

            reactions.forEach(({ emoji }) => {
                const button = document.createElement('button');
                button.className = 'reaction-btn';
                button.textContent = emoji;
                button.onclick = function(e) {
                    const buttons = reactionsDiv.querySelectorAll('.reaction-btn');
                    buttons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    this.style.animation = 'none';
                    this.offsetHeight;
                    this.style.animation = 'bounce 0.3s ease';
                };
                reactionsDiv.appendChild(button);
            });

            contentDiv.appendChild(reactionsDiv);
        }

        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Helper functions for typing indicator
    function showTypingIndicator() {
        if (!isTyping) {
            isTyping = true;
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator';
            typingDiv.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        isTyping = false;
    }

    // Default response generator
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
            return "Sai has over 4 years of experience in Full Stack Development, including significant work at DBS Bank and EdLight. He specializes in FinTech solutions and payment systems. Would you like to know more about a specific role or project?";
        }

        if (lowerMessage.includes('skills') || lowerMessage.includes('technologies')) {
            return "Sai is proficient in various technologies including Java, Spring Boot, React, Angular, Python, and Cloud technologies. He has expertise in both frontend and backend development. What specific skills would you like to know more about?";
        }

        if (lowerMessage.includes('education') || lowerMessage.includes('study')) {
            return "Sai holds a Master's in Computer Science from Georgia State University with a 3.93 GPA. He also has a Bachelor's in Information Technology from JNTU. Would you like more details about his academic achievements?";
        }

        if (lowerMessage.includes('contact') || lowerMessage.includes('hire')) {
            return "You can reach Sai at 4047292160 or connect with him on LinkedIn. Would you like his contact information?";
        }

        if (lowerMessage.includes('projects')) {
            return "Sai has worked on several impressive projects, including SWIFT Payment Automation at DBS Bank and AI-powered accessibility tools. Which project would you like to learn more about?";
        }

        return "I can tell you about Sai's experience, skills, projects, education, or help you get in touch with him. What would you like to know?";
    }

    // Set up escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatState.isOpen) {
            window.toggleChat();
        }
    });

    // Initialize chat window as hidden
    if (chatWindow) {
        chatWindow.style.display = 'none';
    }
});