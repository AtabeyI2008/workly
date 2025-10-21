/* Backend adapter snippet - auto-inserted
   If APP_CONFIG.BACKEND_ENABLED is true, use API.* to call backend, otherwise fallback to localStorage logic.
*/
if (typeof window.APP_CONFIG === 'undefined') {
  window.APP_CONFIG = { BACKEND_ENABLED: false, API_BASE: "/api", COMMISSION_RATE: 0.15 };
}
if (window.APP_CONFIG.BACKEND_ENABLED && typeof window.API === 'undefined') {
  console.warn("APP_CONFIG.BACKEND_ENABLED=true but API wrapper not loaded. Please include api.js after config.js");
}

// messages.js - Mesajlaşma Sistemi

class MessagingSystem {
    constructor() {
        this.currentUser = null;
        this.activeConversation = null;
        this.conversations = [];
        this.users = [];
        this.typingTimeout = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadConversations();
        this.loadUsers();
        this.setupRealTimeUpdates();
        console.log('💬 Messaging system initialized');
    }

    loadUserData() {
        // Get current user from auth system or localStorage
        if (window.authSystem && window.authSystem.currentUser) {
            this.currentUser = window.authSystem.currentUser;
        } else {
            const userData = localStorage.getItem('biznet_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        }

        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.updateUI();
    }

    updateUI() {
        // Update user info in navbar
        document.getElementById('userName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        
        const avatarImg = document.getElementById('avatarImg');
        if (avatarImg && this.currentUser.avatar) {
            avatarImg.src = this.currentUser.avatar;
        }
    }

    setupEventListeners() {
        // New chat button
        const newChatBtn = document.getElementById('newChatBtn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                this.showNewChatModal();
            });
        }

        // Message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('input', (e) => {
                this.handleMessageInput(e.target);
            });

            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Send message button
        const sendBtn = document.getElementById('sendMessageBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // File attachment
        const attachBtn = document.getElementById('attachFileBtn');
        if (attachBtn) {
            attachBtn.addEventListener('click', () => {
                this.showFileUploadModal();
            });
        }

        // Search conversations
        const searchConv = document.getElementById('searchConversations');
        if (searchConv) {
            searchConv.addEventListener('input', (e) => {
                this.searchConversations(e.target.value);
            });
        }

        // Search users
        const searchUsers = document.getElementById('searchUsers');
        if (searchUsers) {
            searchUsers.addEventListener('input', (e) => {
                this.searchUsers(e.target.value);
            });
        }

        // Modals
        const modalClose = document.querySelectorAll('.modal-close');
        modalClose.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Close info sidebar
        const closeInfoBtn = document.getElementById('closeInfoBtn');
        if (closeInfoBtn) {
            closeInfoBtn.addEventListener('click', () => {
                this.closeChatInfo();
            });
        }

        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#007bff';
                uploadArea.style.background = '#f0f8ff';
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = '';
                uploadArea.style.background = '';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '';
                uploadArea.style.background = '';
                this.handleFileUpload(e.dataTransfer.files[0]);
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        }

        // Upload options
        const uploadOptions = document.querySelectorAll('.upload-option');
        uploadOptions.forEach(option => {
            option.addEventListener('click', () => {
                const fileType = option.getAttribute('data-type');
                this.handleUploadOption(fileType);
            });
        });

        // Send file button
        const sendFileBtn = document.getElementById('sendFileBtn');
        if (sendFileBtn) {
            sendFileBtn.addEventListener('click', () => {
                this.sendFileMessage();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Window click for modals
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    loadConversations() {
        // Load conversations from localStorage or create sample data
        const savedConversations = localStorage.getItem(`biznet_conversations_${this.currentUser.id}`);
        
        if (savedConversations) {
            this.conversations = JSON.parse(savedConversations);
        } else {
            // Create sample conversations
            this.conversations = this.createSampleConversations();
            this.saveConversations();
        }

        this.renderConversations();
    }

    createSampleConversations() {
        const sampleUsers = [
            {
                id: 2,
                firstName: 'Əli',
                lastName: 'Hüseynov',
                userType: 'freelancer',
                avatar: '',
                profession: 'Veb Developer',
                online: true
            },
            {
                id: 3,
                firstName: 'Aytac',
                lastName: 'Əliyeva',
                userType: 'business',
                avatar: '',
                companyName: 'Tech Solutions MMC',
                online: false
            },
            {
                id: 4,
                firstName: 'Rəşad',
                lastName: 'Quliyev',
                userType: 'restaurant',
                avatar: '',
                companyName: 'Şəhər Restoranı',
                online: true
            }
        ];

        const sampleMessages = [
            {
                id: 1,
                conversationId: 1,
                senderId: 2,
                text: 'Salam! Veb developer axtarırdığınızı gördüm. Layihə haqqında ətraflı məlumat verə bilərsinizmi?',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                type: 'text'
            },
            {
                id: 2,
                conversationId: 1,
                senderId: this.currentUser.id,
                text: 'Salam Əli! Bəli, yeni korporativ vebsayt üçün developer axtarıram. 5-10 səhifəlik informativ sayt olacaq.',
                timestamp: new Date(Date.now() - 3500000).toISOString(),
                type: 'text'
            },
            {
                id: 3,
                conversationId: 2,
                senderId: 3,
                text: 'Xoş gördük! Şirkətimiz üçün freelance designer axtarırdıq. Portfolio-nuzu göndərə bilərsinizmi?',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                type: 'text'
            },
            {
                id: 4,
                conversationId: 3,
                senderId: 4,
                text: 'Restoranımız üçün part-time ofisiant axtarırıq. Maraqlanırsınızsa, ətraflı məlumat verim.',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                type: 'text'
            }
        ];

        return [
            {
                id: 1,
                participant: sampleUsers[0],
                lastMessage: sampleMessages[0],
                unreadCount: 2,
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                participant: sampleUsers[1],
                lastMessage: sampleMessages[2],
                unreadCount: 0,
                updatedAt: new Date(Date.now() - 7200000).toISOString()
            },
            {
                id: 3,
                participant: sampleUsers[2],
                lastMessage: sampleMessages[3],
                unreadCount: 1,
                updatedAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }

    loadUsers() {
        // Load all users for new chat
        const allUsers = JSON.parse(localStorage.getItem('biznet_users')) || [];
        
        // Filter out current user and create sample users if none exist
        this.users = allUsers.filter(user => user.id !== this.currentUser.id);
        
        if (this.users.length === 0) {
            this.users = this.createSampleUsers();
        }
    }

    createSampleUsers() {
        return [
            {
                id: 2,
                firstName: 'Əli',
                lastName: 'Hüseynov',
                email: 'eli@example.com',
                userType: 'freelancer',
                profession: 'Veb Developer',
                online: true,
                avatar: ''
            },
            {
                id: 3,
                firstName: 'Aytac',
                lastName: 'Əliyeva',
                email: 'aytac@example.com',
                userType: 'business',
                companyName: 'Tech Solutions MMC',
                online: false,
                avatar: ''
            },
            {
                id: 4,
                firstName: 'Rəşad',
                lastName: 'Quliyev',
                email: 'resad@example.com',
                userType: 'restaurant',
                companyName: 'Şəhər Restoranı',
                online: true,
                avatar: ''
            },
            {
                id: 5,
                firstName: 'Ləman',
                lastName: 'Məmmədova',
                email: 'leman@example.com',
                userType: 'freelancer',
                profession: 'UI/UX Designer',
                online: true,
                avatar: ''
            },
            {
                id: 6,
                firstName: 'Orxan',
                lastName: 'İbrahimov',
                email: 'orxan@example.com',
                userType: 'business',
                companyName: 'Digital Agency',
                online: false,
                avatar: ''
            }
        ];
    }

    renderConversations() {
        const conversationsList = document.getElementById('conversationsList');
        if (!conversationsList) return;

        if (this.conversations.length === 0) {
            conversationsList.innerHTML = `
                <div class="no-conversations">
                    <p>Hələ ki, heç bir söhbətiniz yoxdur</p>
                    <button class="btn-primary" onclick="messagingSystem.showNewChatModal()">
                        İlk söhbəti başlat
                    </button>
                </div>
            `;
            return;
        }

        conversationsList.innerHTML = this.conversations.map(conv => `
            <div class="conversation-item ${this.activeConversation?.id === conv.id ? 'active' : ''}" 
                 onclick="messagingSystem.selectConversation(${conv.id})">
                <div class="conversation-avatar">
                    <img src="${conv.participant.avatar || '/api/placeholder/50/50'}" alt="${conv.participant.firstName}">
                    <span class="online-status ${conv.participant.online ? '' : 'offline'}"></span>
                </div>
                <div class="conversation-content">
                    <div class="conversation-header">
                        <h4 class="conversation-name">
                            ${conv.participant.firstName} ${conv.participant.lastName}
                        </h4>
                        <span class="conversation-time">
                            ${this.formatTime(conv.lastMessage.timestamp)}
                        </span>
                    </div>
                    <div class="conversation-preview">
                        <span class="conversation-message">
                            ${conv.lastMessage.text}
                        </span>
                        ${conv.unreadCount > 0 ? `
                            <span class="unread-badge">${conv.unreadCount}</span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    selectConversation(conversationId) {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        this.activeConversation = conversation;
        
        // Mark as read
        conversation.unreadCount = 0;
        this.saveConversations();
        this.renderConversations();

        // Show chat area
        document.getElementById('noChatSelected').style.display = 'none';
        document.getElementById('activeChat').style.display = 'flex';

        // Update chat header
        this.updateChatHeader(conversation.participant);
        
        // Load messages
        this.loadMessages(conversation.id);
        
        // Update chat info
        this.updateChatInfo(conversation.participant);
    }

    updateChatHeader(participant) {
        document.getElementById('partnerName').textContent = 
            `${participant.firstName} ${participant.lastName}`;
        
        document.getElementById('partnerType').textContent = 
            this.getUserTypeText(participant.userType, participant);
        
        document.getElementById('partnerAvatar').src = 
            participant.avatar || '/api/placeholder/45/45';
        
        document.getElementById('onlineStatus').className = 
            `online-status ${participant.online ? '' : 'offline'}`;
    }

    loadMessages(conversationId) {
        // Load messages from localStorage or create sample messages
        const savedMessages = localStorage.getItem(`biznet_messages_${conversationId}`);
        let messages = [];

        if (savedMessages) {
            messages = JSON.parse(savedMessages);
        } else {
            // Create sample messages for this conversation
            messages = this.createSampleMessages(conversationId);
            this.saveMessages(conversationId, messages);
        }

        this.renderMessages(messages);
    }

    createSampleMessages(conversationId) {
        const baseMessages = [
            {
                id: 1,
                conversationId: conversationId,
                senderId: this.activeConversation.participant.id,
                text: 'Salam! Necəsən?',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                type: 'text'
            },
            {
                id: 2,
                conversationId: conversationId,
                senderId: this.currentUser.id,
                text: 'Salam! Yaxşıyam, sən necəsən? Layihə necə gedir?',
                timestamp: new Date(Date.now() - 3500000).toISOString(),
                type: 'text'
            },
            {
                id: 3,
                conversationId: conversationId,
                senderId: this.activeConversation.participant.id,
                text: 'Yaxşı gedir, təşəkkürlər! Yeni dizayn konseptlərini hazırlayıram, tezliklə göndərəcəm.',
                timestamp: new Date(Date.now() - 3400000).toISOString(),
                type: 'text'
            }
        ];

        return baseMessages;
    }

    renderMessages(messages) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = messages.map(message => `
            <div class="message ${message.senderId === this.currentUser.id ? 'sent' : 'received'}">
                ${message.senderId !== this.currentUser.id ? `
                    <img class="message-avatar" 
                         src="${this.activeConversation.participant.avatar || '/api/placeholder/35/35'}" 
                         alt="Avatar">
                ` : ''}
                
                <div class="message-content">
                    ${message.type === 'text' ? `
                        <p class="message-text">${message.text}</p>
                    ` : message.type === 'file' ? `
                        <div class="file-message">
                            <i class="fas fa-file-pdf file-icon"></i>
                            <div class="file-info">
                                <div class="file-name">${message.fileName}</div>
                                <div class="file-size">${this.formatFileSize(message.fileSize)}</div>
                            </div>
                            <button class="download-btn" onclick="messagingSystem.downloadFile('${message.fileUrl}')">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    ` : ''}
                    
                    <div class="message-time">
                        ${this.formatTime(message.timestamp)}
                    </div>
                </div>

                ${message.senderId === this.currentUser.id ? `
                    <img class="message-avatar" 
                         src="${this.currentUser.avatar || '/api/placeholder/35/35'}" 
                         alt="Avatar">
                ` : ''}
            </div>
        `).join('');

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleMessageInput(input) {
        // Enable/disable send button
        const sendBtn = document.getElementById('sendMessageBtn');
        if (sendBtn) {
            sendBtn.disabled = !input.value.trim();
        }

        // Auto-resize textarea
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';

        // Simulate typing
        if (this.activeConversation) {
            this.simulateTyping();
        }
    }

    simulateTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            
            // Clear previous timeout
            if (this.typingTimeout) {
                clearTimeout(this.typingTimeout);
            }
            
            // Hide after 3 seconds
            this.typingTimeout = setTimeout(() => {
                typingIndicator.style.display = 'none';
            }, 3000);
        }
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const text = messageInput.value.trim();
        
        if (!text || !this.activeConversation) return;

        const message = {
            id: Date.now(),
            conversationId: this.activeConversation.id,
            senderId: this.currentUser.id,
            text: text,
            timestamp: new Date().toISOString(),
            type: 'text'
        };

        // Add message to conversation
        this.addMessageToConversation(message);
        
        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        // Disable send button
        const sendBtn = document.getElementById('sendMessageBtn');
        if (sendBtn) {
            sendBtn.disabled = true;
        }

        // Simulate reply after 2 seconds
        setTimeout(() => {
            this.simulateReply();
        }, 2000);
    }

    addMessageToConversation(message) {
        // Save message
        const savedMessages = localStorage.getItem(`biznet_messages_${message.conversationId}`);
        let messages = savedMessages ? JSON.parse(savedMessages) : [];
        
        messages.push(message);
        this.saveMessages(message.conversationId, messages);
        
        // Update conversation last message
        const conversation = this.conversations.find(c => c.id === message.conversationId);
        if (conversation) {
            conversation.lastMessage = message;
            conversation.updatedAt = new Date().toISOString();
            this.saveConversations();
        }

        // Re-render messages
        this.renderMessages(messages);
    }

    simulateReply() {
        if (!this.activeConversation) return;

        const replies = [
            'Başa düşdüm, təşəkkürlər!',
            'Bu mənim üçün yaxşı işdir',
            'Daha ətraflı məlumat verə bilərsən?',
            'Sabah görüşək və müzakirə edək',
            'Portfolio-ma baxa bilərsən'
        ];

        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMessage = {
            id: Date.now(),
            conversationId: this.activeConversation.id,
            senderId: this.activeConversation.participant.id,
            text: randomReply,
            timestamp: new Date().toISOString(),
            type: 'text'
        };

        this.addMessageToConversation(replyMessage);
    }

    showNewChatModal() {
        const modal = document.getElementById('newChatModal');
        if (modal) {
            this.renderUsersList();
            modal.style.display = 'block';
        }
    }

    renderUsersList() {
        const usersList = document.getElementById('usersList');
        if (!usersList) return;

        usersList.innerHTML = this.users.map(user => `
            <div class="user-item" onclick="messagingSystem.startConversation(${user.id})">
                <img src="${user.avatar || '/api/placeholder/40/40'}" alt="${user.firstName}">
                <div class="user-details">
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <span>${this.getUserTypeText(user.userType, user)}</span>
                </div>
            </div>
        `).join('');
    }

    startConversation(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        // Check if conversation already exists
        let conversation = this.conversations.find(c => c.participant.id === userId);
        
        if (!conversation) {
            // Create new conversation
            conversation = {
                id: Date.now(),
                participant: user,
                lastMessage: {
                    id: Date.now(),
                    conversationId: Date.now(),
                    senderId: this.currentUser.id,
                    text: 'Söhbət başladıldı',
                    timestamp: new Date().toISOString(),
                    type: 'text'
                },
                unreadCount: 0,
                updatedAt: new Date().toISOString()
            };

            this.conversations.unshift(conversation);
            this.saveConversations();
        }

        this.closeModals();
        this.selectConversation(conversation.id);
        this.renderConversations();
    }

    showFileUploadModal() {
        const modal = document.getElementById('fileUploadModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    handleUploadOption(fileType) {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.accept = this.getFileAccept(fileType);
            fileInput.click();
        }
    }

    getFileAccept(fileType) {
        const accepts = {
            'image': 'image/*',
            'document': '.pdf,.doc,.docx,.txt',
            'other': '*'
        };
        return accepts[fileType] || '*';
    }

    handleFileUpload(file) {
        if (!file) return;

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('Fayl ölçüsü 10MB-dan çox ola bilməz', 'error');
            return;
        }

        // Show file preview
        this.showFilePreview(file);
    }

    showFilePreview(file) {
        const preview = document.getElementById('filePreviewModal');
        if (!preview) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `
                <div class="file-preview">
                    <div class="preview-item">
                        <i class="fas fa-file"></i>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${this.formatFileSize(file.size)}</div>
                        </div>
                    </div>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }

    sendFileMessage() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        
        if (!file || !this.activeConversation) return;

        const message = {
            id: Date.now(),
            conversationId: this.activeConversation.id,
            senderId: this.currentUser.id,
            type: 'file',
            fileName: file.name,
            fileSize: file.size,
            fileUrl: URL.createObjectURL(file),
            timestamp: new Date().toISOString()
        };

        this.addMessageToConversation(message);
        this.closeModals();
        
        // Reset file input
        fileInput.value = '';
        document.getElementById('filePreviewModal').innerHTML = '';
    }

    downloadFile(fileUrl) {
        // Simulate file download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'download';
        link.click();
    }

    searchConversations(query) {
        const filtered = this.conversations.filter(conv => 
            conv.participant.firstName.toLowerCase().includes(query.toLowerCase()) ||
            conv.participant.lastName.toLowerCase().includes(query.toLowerCase()) ||
            conv.lastMessage.text.toLowerCase().includes(query.toLowerCase())
        );

        this.renderFilteredConversations(filtered);
    }

    renderFilteredConversations(conversations) {
        const conversationsList = document.getElementById('conversationsList');
        if (!conversationsList) return;

        conversationsList.innerHTML = conversations.map(conv => `
            <div class="conversation-item ${this.activeConversation?.id === conv.id ? 'active' : ''}" 
                 onclick="messagingSystem.selectConversation(${conv.id})">
                <div class="conversation-avatar">
                    <img src="${conv.participant.avatar || '/api/placeholder/50/50'}" alt="${conv.participant.firstName}">
                    <span class="online-status ${conv.participant.online ? '' : 'offline'}"></span>
                </div>
                <div class="conversation-content">
                    <div class="conversation-header">
                        <h4 class="conversation-name">
                            ${conv.participant.firstName} ${conv.participant.lastName}
                        </h4>
                        <span class="conversation-time">
                            ${this.formatTime(conv.lastMessage.timestamp)}
                        </span>
                    </div>
                    <div class="conversation-preview">
                        <span class="conversation-message">
                            ${conv.lastMessage.text}
                        </span>
                        ${conv.unreadCount > 0 ? `
                            <span class="unread-badge">${conv.unreadCount}</span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    searchUsers(query) {
        const filtered = this.users.filter(user =>
            user.firstName.toLowerCase().includes(query.toLowerCase()) ||
            user.lastName.toLowerCase().includes(query.toLowerCase()) ||
            (user.profession && user.profession.toLowerCase().includes(query.toLowerCase())) ||
            (user.companyName && user.companyName.toLowerCase().includes(query.toLowerCase()))
        );

        this.renderFilteredUsers(filtered);
    }

    renderFilteredUsers(users) {
        const usersList = document.getElementById('usersList');
        if (!usersList) return;

        usersList.innerHTML = users.map(user => `
            <div class="user-item" onclick="messagingSystem.startConversation(${user.id})">
                <img src="${user.avatar || '/api/placeholder/40/40'}" alt="${user.firstName}">
                <div class="user-details">
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <span>${this.getUserTypeText(user.userType, user)}</span>
                </div>
            </div>
        `).join('');
    }

    updateChatInfo(participant) {
        const infoContent = document.getElementById('chatInfoContent');
        if (!infoContent) return;

        infoContent.innerHTML = `
            <div class="partner-details-info">
                <img src="${participant.avatar || '/api/placeholder/80/80'}" alt="${participant.firstName}">
                <h4>${participant.firstName} ${participant.lastName}</h4>
                <span class="partner-type">${this.getUserTypeText(participant.userType, participant)}</span>
                <span class="online-status ${participant.online ? '' : 'offline'}">
                    ${participant.online ? 'Onlayn' : 'Oflayn'}
                </span>
            </div>
            
            <div class="contact-info">
                <h5>Əlaqə məlumatları</h5>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${participant.email}</span>
                </div>
                ${participant.phone ? `
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${participant.phone}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="chat-actions-list">
                <button class="chat-action-btn" onclick="messagingSystem.clearChat()">
                    <i class="fas fa-trash"></i>
                    Söhbəti təmizlə
                </button>
                <button class="chat-action-btn delete" onclick="messagingSystem.deleteChat()">
                    <i class="fas fa-times-circle"></i>
                    Söhbəti sil
                </button>
            </div>
        `;
    }

    clearChat() {
        if (!this.activeConversation) return;

        if (confirm('Bu söhbəti təmizləmək istədiyinizə əminsiniz?')) {
            localStorage.removeItem(`biznet_messages_${this.activeConversation.id}`);
            this.loadMessages(this.activeConversation.id);
            this.showNotification('Söhbət təmizləndi', 'success');
        }
    }

    deleteChat() {
        if (!this.activeConversation) return;

        if (confirm('Bu söhbəti silmək istədiyinizə əminsiniz?')) {
            this.conversations = this.conversations.filter(c => c.id !== this.activeConversation.id);
            this.saveConversations();
            
            localStorage.removeItem(`biznet_messages_${this.activeConversation.id}`);
            
            this.activeConversation = null;
            document.getElementById('noChatSelected').style.display = 'flex';
            document.getElementById('activeChat').style.display = 'none';
            
            this.renderConversations();
            this.showNotification('Söhbət silindi', 'success');
        }
    }

    closeChatInfo() {
        const infoSidebar = document.querySelector('.chat-info-sidebar');
        if (infoSidebar) {
            infoSidebar.style.display = 'none';
        }
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    setupRealTimeUpdates() {
        // Simulate real-time updates (online status, new messages)
        setInterval(() => {
            this.simulateOnlineStatus();
        }, 30000);
    }

    simulateOnlineStatus() {
        // Randomly change online status for demo
        this.conversations.forEach(conv => {
            if (Math.random() > 0.7) {
                conv.participant.online = !conv.participant.online;
            }
        });
        this.renderConversations();
    }

    // Utility methods
    getUserTypeText(userType, user) {
        const types = {
            'freelancer': user.profession || 'Freelancer',
            'business': user.companyName || 'Biznes',
            'restaurant': user.companyName || 'Restoran',
            'retail': user.companyName || 'Market',
            'client': 'Müştəri'
        };
        return types[userType] || userType;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) { // 1 minute
            return 'indi';
        } else if (diff < 3600000) { // 1 hour
            return Math.floor(diff / 60000) + ' dəq';
        } else if (diff < 86400000) { // 1 day
            return date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit' });
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    saveConversations() {
        localStorage.setItem(`biznet_conversations_${this.currentUser.id}`, JSON.stringify(this.conversations));
    }

    saveMessages(conversationId, messages) {
        localStorage.setItem(`biznet_messages_${conversationId}`, JSON.stringify(messages));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }

    logout() {
        if (window.authSystem) {
            window.authSystem.handleLogout();
        } else {
            localStorage.removeItem('biznet_user');
            sessionStorage.removeItem('biznet_user');
            window.location.href = 'login.html';
        }
    }
}

// Global functions
function startNewChat() {
    if (window.messagingSystem) {
        window.messagingSystem.showNewChatModal();
    }
}

// Initialize system
document.addEventListener('DOMContentLoaded', () => {
    window.messagingSystem = new MessagingSystem();
});