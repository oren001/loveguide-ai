class LoveGuide {
    constructor() {
        this.selectedProfile = null;
        this.sharingContent = null;
        this.setupEventListeners();
        this.loadMessages();
    }

    setupEventListeners() {
        // Profile selection
        document.querySelectorAll('.profile-btn').forEach(button => {
            button.addEventListener('click', () => this.selectProfile(button.dataset.profile));
        });

        // Message sending
        document.getElementById('send-button').addEventListener('click', () => this.sendMessage());
        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Sharing panel actions
        document.getElementById('share-approve').addEventListener('click', () => this.approveSharing());
        document.getElementById('share-edit').addEventListener('click', () => this.editSharing());
        document.getElementById('share-cancel').addEventListener('click', () => this.cancelSharing());
    }

    selectProfile(profile) {
        this.selectedProfile = profile;
        
        // Update UI
        document.querySelectorAll('.profile-btn').forEach(button => {
            button.classList.toggle('active', button.dataset.profile === profile);
        });
        document.querySelector('.selected-profile').textContent = `Selected: ${profile}`;
        
        // Save to localStorage
        localStorage.setItem('selectedProfile', profile);
        
        // Reload messages to update UI
        this.loadMessages();

        // Add welcome message if this is first time
        const hasWelcomed = localStorage.getItem(`welcomed_${profile}`);
        if (!hasWelcomed) {
            this.addLoveGuideMessage(
                `Hello ${profile}, I'm your LoveGuide AI. I'm here to help you navigate your relationship. ` +
                `You can share your thoughts, concerns, or questions with me, and I'll provide guidance and support. ` +
                `Everything you share is private unless you choose to share it with your partner.`
            );
            localStorage.setItem(`welcomed_${profile}`, 'true');
        }
    }

    async sendMessage() {
        if (!this.selectedProfile) {
            alert('Please select a profile first');
            return;
        }

        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (!message) return;

        try {
            // Add user message to UI immediately
            const userMessageId = this.addUserMessage(message);
            input.value = '';

            // Send to server
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    author: this.selectedProfile,
                    text: message,
                    type: 'user'
                })
            });

            if (!response.ok) throw new Error('Failed to send message');
            
            // Generate LoveGuide response
            await this.generateLoveGuideResponse(message, userMessageId);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    }

    addUserMessage(text) {
        const messagesDiv = document.getElementById('messages');
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        messageElement.dataset.id = Date.now().toString();
        
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = `${this.selectedProfile} - ${this.formatDate(new Date())}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        messageElement.appendChild(header);
        messageElement.appendChild(content);
        messagesDiv.appendChild(messageElement);
        
        // Scroll to bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        return messageElement.dataset.id;
    }

    addLoveGuideMessage(text, suggestion = null) {
        const messagesDiv = document.getElementById('messages');
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message loveguide';
        messageElement.dataset.id = Date.now().toString();
        
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = `LoveGuide - ${this.formatDate(new Date())}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        messageElement.appendChild(header);
        messageElement.appendChild(content);
        
        // Add suggestion if provided
        if (suggestion) {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'message-suggestion';
            suggestionElement.textContent = suggestion;
            
            const actionsElement = document.createElement('div');
            actionsElement.className = 'message-actions';
            
            const shareButton = document.createElement('button');
            shareButton.className = 'action-btn';
            shareButton.textContent = 'Share with Partner';
            shareButton.addEventListener('click', () => this.showSharingPanel(suggestion));
            
            actionsElement.appendChild(shareButton);
            
            messageElement.appendChild(suggestionElement);
            messageElement.appendChild(actionsElement);
        }
        
        messagesDiv.appendChild(messageElement);
        
        // Scroll to bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    async generateLoveGuideResponse(userMessage, userMessageId) {
        try {
            // In a real implementation, this would call an AI API
            // For now, we'll simulate a response with some delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simple response logic based on message content
            let response = '';
            let suggestion = null;
            
            // Check for keywords to simulate AI understanding
            if (userMessage.toLowerCase().includes('angry') || 
                userMessage.toLowerCase().includes('upset') || 
                userMessage.toLowerCase().includes('mad')) {
                response = `I understand you're feeling upset. It's important to acknowledge these emotions. Can you tell me more about what triggered these feelings?`;
            } 
            else if (userMessage.toLowerCase().includes('communicate') || 
                     userMessage.toLowerCase().includes('talk') || 
                     userMessage.toLowerCase().includes('tell')) {
                response = `Communication is key in relationships. When you speak with your partner, try using "I" statements to express your feelings without blame.`;
                
                // Add sharing suggestion
                suggestion = `${this.selectedProfile} has been working on improving communication. Would you like to share some communication techniques with your partner?`;
            }
            else if (userMessage.toLowerCase().includes('listen') || 
                     userMessage.toLowerCase().includes('hear') || 
                     userMessage.toLowerCase().includes('understand')) {
                response = `Active listening is a powerful tool. Try to understand your partner's perspective before responding. This shows respect and builds trust.`;
            }
            else if (userMessage.toLowerCase().includes('love') || 
                     userMessage.toLowerCase().includes('care') || 
                     userMessage.toLowerCase().includes('feel')) {
                response = `Expressing your feelings is important. Have you told your partner directly how you feel about them recently?`;
                
                // Add sharing suggestion
                suggestion = `${this.selectedProfile} has been reflecting on expressing feelings more openly. Would you like to share this insight with your partner?`;
            }
            else {
                response = `Thank you for sharing that with me. How does this situation make you feel, and what would you like to see change?`;
            }
            
            // Add LoveGuide response to UI
            this.addLoveGuideMessage(response, suggestion);
            
            // Send to server
            await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    author: 'LoveGuide',
                    text: response,
                    type: 'ai',
                    suggestion: suggestion,
                    related_to: userMessageId
                })
            });
        } catch (error) {
            console.error('Error generating response:', error);
            this.addLoveGuideMessage('I apologize, but I encountered an error. Please try again.');
        }
    }

    showSharingPanel(content) {
        this.sharingContent = content;
        
        // Update sharing panel content
        document.getElementById('sharing-content').textContent = content;
        
        // Show the panel
        const panel = document.getElementById('sharing-panel');
        panel.classList.remove('hidden');
    }

    approveSharing() {
        if (!this.sharingContent) return;
        
        // In a real implementation, this would send the content to the partner
        this.addLoveGuideMessage(`I've shared your insight with your partner. This can help build understanding between you.`);
        
        // Hide the panel
        this.hideSharingPanel();
    }

    editSharing() {
        if (!this.sharingContent) return;
        
        // Populate the input with the content for editing
        document.getElementById('message-input').value = this.sharingContent;
        document.getElementById('message-input').focus();
        
        // Hide the panel
        this.hideSharingPanel();
    }

    cancelSharing() {
        // Hide the panel
        this.hideSharingPanel();
    }

    hideSharingPanel() {
        const panel = document.getElementById('sharing-panel');
        panel.classList.add('hidden');
        this.sharingContent = null;
    }

    async loadMessages() {
        if (!this.selectedProfile) return;
        
        try {
            const response = await fetch('/api/messages');
            if (!response.ok) throw new Error('Failed to load messages');
            
            const messages = await response.json();
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = '';
            
            messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = `message ${message.author === this.selectedProfile ? 'sent' : 
                                                   message.author === 'LoveGuide' ? 'loveguide' : 'received'}`;
                messageElement.dataset.id = message.id;
                
                const header = document.createElement('div');
                header.className = 'message-header';
                header.textContent = `${message.author} - ${this.formatDate(message.timestamp)}`;
                
                const content = document.createElement('div');
                content.className = 'message-content';
                content.textContent = message.text;
                
                messageElement.appendChild(header);
                messageElement.appendChild(content);
                
                if (message.suggestion) {
                    const suggestionElement = document.createElement('div');
                    suggestionElement.className = 'message-suggestion';
                    suggestionElement.textContent = message.suggestion;
                    
                    const actionsElement = document.createElement('div');
                    actionsElement.className = 'message-actions';
                    
                    const shareButton = document.createElement('button');
                    shareButton.className = 'action-btn';
                    shareButton.textContent = 'Share with Partner';
                    shareButton.addEventListener('click', () => this.showSharingPanel(message.suggestion));
                    
                    actionsElement.appendChild(shareButton);
                    
                    messageElement.appendChild(suggestionElement);
                    messageElement.appendChild(actionsElement);
                }
                
                messagesDiv.appendChild(messageElement);
            });
            
            // Scroll to bottom
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } catch (error) {
            console.error('Error loading messages:', error);
            document.getElementById('messages').innerHTML = 
                '<div class="error">Failed to load messages. Please refresh the page.</div>';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }
}

// Initialize LoveGuide when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const loveGuide = new LoveGuide();
    
    // Restore selected profile if available
    const savedProfile = localStorage.getItem('selectedProfile');
    if (savedProfile) {
        loveGuide.selectProfile(savedProfile);
    }
});