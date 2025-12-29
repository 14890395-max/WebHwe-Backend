// Main Application Logic

class WebHweApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentVideo = null;
        this.currentSubtitleIndex = 0;
        this.flashcardSets = mockFlashcardSets;
        this.currentFlashcardSet = null;
        this.currentCardIndex = 0;
        this.isCardFlipped = false;

        this.init();
    }

    init() {
        this.loadVideosFromLocalStorage();
        this.setupNavigation();
        this.setupUploadArea();
        this.setupVideoCards();
        this.setupFlashcardSets();
        this.setupDictionaryPopup();
        this.setupReviewMode();
        this.loadUserStats();

        console.log('WebHwe App Initialized');
    }

    // Navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateTo(page);

                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
        }
    }

    // Upload Area
    setupUploadArea() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleVideoUpload(file);
            }
        });

        // Drag & Drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--color-primary)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'rgba(22, 160, 133, 0.3)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(22, 160, 133, 0.3)';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('video/')) {
                this.handleVideoUpload(file);
            }
        });
    }


    async handleVideoUpload(file) {
        console.log('Video uploaded:', file.name);

        // Show loading state
        this.showToast('Đang phân tích video... Vui lòng đợi.', 10000);

        try {
            // Create FormData to send file
            const formData = new FormData();
            formData.append('video', file);

            // Tự động chọn URL backend: Nếu chạy trên localhost thì dùng port 5000, 
            // nếu chạy trên Cloud (Firebase) thì dùng link Render (bạn sẽ điền sau khi deploy)
            const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000'
                : 'https://webhwe-backend.onrender.com'; // Thay bằng link thật của bạn ở đây

            // Call backend API
            const response = await fetch(`${BACKEND_URL}/api/analyze-video`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            // Success! Save the analyzed data
            console.log('Analysis complete:', result);

            // Create a new video entry
            const videoId = 'video_' + Date.now();
            const newVideo = {
                id: videoId,
                title: file.name,
                url: URL.createObjectURL(file),
                thumbnail: 'https://via.placeholder.com/640x360/1a1a2e/16a085?text=Uploaded+Video',
                duration: '00:00',
                uploadedAt: 'Just now',
                subtitles: result.subtitles
            };

            // Add to mockVideos (in real app, would save to database)
            mockVideos.push(newVideo);

            // Update dictionary with new words
            result.subtitles.forEach(subtitle => {
                subtitle.words.forEach(word => {
                    if (!dictionaryData[word.text]) {
                        dictionaryData[word.text] = {
                            pinyin: word.pinyin,
                            hanViet: word.hanViet || '',
                            meaning: word.meaning,
                            explanation: `(Tự động tra cứu) Hán Việt: ${word.hanViet || '...'}. Nghĩa: ${word.meaning}`
                        };
                    }
                });
            });

            // Save to localStorage
            this.saveVideosToLocalStorage();

            this.showToast('✅ Phân tích hoàn tất!', 3000);

            // Navigate to Videos page and show the new video
            setTimeout(() => {
                this.navigateTo('videos');
                this.renderVideoGrid();

                // Update nav active state
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                document.querySelector('[data-page="videos"]').classList.add('active');
            }, 1000);

        } catch (error) {
            console.error('Error analyzing video:', error);

            let errorMessage = 'Lỗi khi phân tích video. ';

            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Backend server chưa chạy. Vui lòng khởi động backend bằng lệnh: python backend/server.py';
            } else if (error.message.includes('ffmpeg')) {
                errorMessage += 'FFmpeg chưa được cài đặt. Xem hướng dẫn trong backend/README.md';
            } else {
                errorMessage += error.message;
            }

            alert(errorMessage);
        }
    }

    // Video Cards
    setupVideoCards() {
        this.renderVideoGrid();

        // Also setup flashcard set cards
        const setCards = document.querySelectorAll('.flashcard-set-card');
        setCards.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.getAttribute('data-video');
                this.openVideoPlayer(videoId);
            });
        });
    }

    renderVideoGrid() {
        const videoGrid = document.querySelector('.video-grid');
        if (!videoGrid) return;

        videoGrid.innerHTML = mockVideos.map(video => `
            <div class="video-card" data-video-id="${video.id}">
                <button class="btn-delete-video" data-video-id="${video.id}" title="Xóa video">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title || 'Video'}">
                    <span class="duration">${video.duration || '0:00'}</span>
                </div>
                <div class="video-info">
                    <h3>${video.title || 'Untitled Video'}</h3>
                    <p class="video-meta">${video.uploadedAt || 'Just now'}</p>
                </div>
            </div>
        `).join('');

        // Use Event Delegation for all clicks in the grid
        videoGrid.onclick = (e) => {
            const deleteBtn = e.target.closest('.btn-delete-video');
            const videoCard = e.target.closest('.video-card');

            if (deleteBtn) {
                e.stopPropagation();
                const videoId = deleteBtn.getAttribute('data-video-id');
                if (confirm('Bạn có chắc chắn muốn xóa video này không?')) {
                    this.deleteVideo(videoId);
                }
                return;
            }

            if (videoCard) {
                const videoId = videoCard.getAttribute('data-video-id');
                this.openVideoPlayer(videoId);
            }
        };
    }

    deleteVideo(videoId) {
        // Find index of video
        const index = mockVideos.findIndex(v => v.id === videoId);
        if (index !== -1) {
            mockVideos.splice(index, 1);
            this.saveVideosToLocalStorage();
            this.renderVideoGrid();
            this.showToast('✅ Đã xóa video thành công!');
        }
    }

    openVideoPlayer(videoId) {
        this.currentVideo = mockVideos.find(v => v.id === videoId);
        if (!this.currentVideo) return;

        this.navigateTo('player');
        this.loadVideoSource();
        this.setupPlayer();
        this.renderTranscript();
    }

    loadVideoSource() {
        const videoPlayer = document.getElementById('videoPlayer');
        const source = videoPlayer.querySelector('source');

        if (this.currentVideo.url) {
            source.src = this.currentVideo.url;
            videoPlayer.load();
        }
    }

    setupPlayer() {
        const videoPlayer = document.getElementById('videoPlayer');

        // Note: In real app, we'd load actual video
        // For demo, we'll just simulate with timeupdate events

        videoPlayer.addEventListener('timeupdate', () => {
            this.updateSubtitles(videoPlayer.currentTime);
        });

        // Simulate first subtitle
        this.updateSubtitles(0);
    }

    updateSubtitles(currentTime) {
        if (!this.currentVideo || !this.currentVideo.subtitles) return;

        const currentSubtitle = this.currentVideo.subtitles.find(sub =>
            currentTime >= sub.startTime && currentTime < sub.endTime
        );

        if (!currentSubtitle) return;

        // Update subtitle bar
        this.renderSubtitleBar(currentSubtitle, currentTime);

        // Highlight active transcript item
        this.highlightTranscriptItem(currentSubtitle.id);
    }

    renderSubtitleBar(subtitle, currentTime) {
        const pinyinEl = document.getElementById('subtitlePinyin');
        const hanziEl = document.getElementById('subtitleHanzi');

        // Render Pinyin line
        pinyinEl.innerHTML = subtitle.words.map(word =>
            `<span class="word-token ${this.isWordActive(word, currentTime) ? 'active' : ''}">${word.pinyin}</span>`
        ).join(' ');

        // Render Hanzi line with click handlers
        hanziEl.innerHTML = subtitle.words.map(word =>
            `<span class="word-token ${this.isWordActive(word, currentTime) ? 'active' : ''}" 
                   data-word="${word.text}">${word.text}</span>`
        ).join(' ');

        // Add click handlers to words
        hanziEl.querySelectorAll('.word-token').forEach(token => {
            token.addEventListener('click', (e) => {
                const word = e.target.getAttribute('data-word');
                this.showDictionaryPopup(word);

                // Pause video
                const videoPlayer = document.getElementById('videoPlayer');
                videoPlayer.pause();
            });
        });
    }

    isWordActive(word, currentTime) {
        return currentTime >= word.start && currentTime < word.end;
    }

    renderTranscript() {
        const transcriptList = document.getElementById('transcriptList');

        if (!this.currentVideo || !this.currentVideo.subtitles) {
            transcriptList.innerHTML = '<p style="padding: 16px; color: var(--color-text-muted);">Không có phụ đề</p>';
            return;
        }

        transcriptList.innerHTML = this.currentVideo.subtitles.map(sub => `
            <div class="transcript-item" data-subtitle-id="${sub.id}" data-start="${sub.startTime}">
                <div class="transcript-time">${this.formatTime(sub.startTime)}</div>
                <div class="transcript-text">${sub.text}</div>
            </div>
        `).join('');

        // Add click handlers
        transcriptList.querySelectorAll('.transcript-item').forEach(item => {
            item.addEventListener('click', () => {
                const startTime = parseFloat(item.getAttribute('data-start'));
                const videoPlayer = document.getElementById('videoPlayer');
                videoPlayer.currentTime = startTime;
                videoPlayer.play();
            });
        });
    }

    highlightTranscriptItem(subtitleId) {
        document.querySelectorAll('.transcript-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`[data-subtitle-id="${subtitleId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Dictionary Popup
    setupDictionaryPopup() {
        const popup = document.getElementById('dictionaryPopup');
        const closeBtn = popup.querySelector('.btn-close-popup');
        const addBtn = document.getElementById('btnAddWord');
        const speakBtn = document.getElementById('btnSpeak');
        const copyBtn = document.getElementById('btnCopy');

        closeBtn.addEventListener('click', () => {
            this.hideDictionaryPopup();
        });

        addBtn.addEventListener('click', () => {
            const word = document.getElementById('popupWord').textContent;
            this.addToFlashcard(word);
        });

        speakBtn.addEventListener('click', () => {
            const word = document.getElementById('popupWord').textContent;
            this.speakWord(word);
        });

        copyBtn.addEventListener('click', () => {
            const word = document.getElementById('popupWord').textContent;
            navigator.clipboard.writeText(word);
            this.showToast('Đã sao chép!');
        });

        // Close on backdrop click
        popup.querySelector('.popup-backdrop').addEventListener('click', () => {
            this.hideDictionaryPopup();
        });
    }

    showDictionaryPopup(word) {
        const popup = document.getElementById('dictionaryPopup');
        const wordData = dictionaryData[word];

        if (!wordData) {
            console.log('Word not found in dictionary:', word);
            return;
        }

        document.getElementById('popupWord').textContent = word;
        document.getElementById('popupPinyin').textContent = wordData.pinyin;
        document.getElementById('popupHanViet').textContent = wordData.hanViet || '';
        document.getElementById('popupMeaning').textContent = wordData.meaning;
        document.getElementById('popupExplanation').textContent = wordData.explanation;

        popup.classList.remove('hidden');
    }

    hideDictionaryPopup() {
        const popup = document.getElementById('dictionaryPopup');
        popup.classList.add('hidden');
    }

    speakWord(word) {
        // Use browser's speech synthesis
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }

    // Flashcard Management
    setupFlashcardSets() {
        const reviewBtns = document.querySelectorAll('.btn-review');
        reviewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const setId = btn.getAttribute('data-set-id');
                this.openReviewMode(setId);
            });
        });
    }

    addToFlashcard(word) {
        const wordData = dictionaryData[word];
        if (!wordData) return;

        // Get or create flashcard set for current video
        const videoId = this.currentVideo?.id || 'doraemon';

        if (!this.flashcardSets[videoId]) {
            this.flashcardSets[videoId] = {
                id: videoId,
                videoId: videoId,
                title: this.currentVideo?.title || 'Unknown Video',
                cards: []
            };
        }

        // Check if word already exists
        const exists = this.flashcardSets[videoId].cards.some(card => card.word === word);

        if (!exists) {
            this.flashcardSets[videoId].cards.push({
                word: word,
                pinyin: wordData.pinyin,
                meaning: wordData.meaning,
                explanation: wordData.explanation,
                mastered: false
            });

            this.showToast(`Đã thêm "${word}" vào Flashcard!`);
            this.saveToLocalStorage();
        } else {
            this.showToast('Từ này đã có trong danh sách!');
        }

        this.hideDictionaryPopup();
    }

    // Review Mode
    setupReviewMode() {
        const closeBtn = document.getElementById('btnCloseReview');
        const prevBtn = document.getElementById('btnPrev');
        const nextBtn = document.getElementById('btnNext');
        const flashcard = document.getElementById('flashcard');

        closeBtn.addEventListener('click', () => {
            this.navigateTo('flashcards');
        });

        prevBtn.addEventListener('click', () => {
            this.previousCard();
        });

        nextBtn.addEventListener('click', () => {
            this.nextCard();
        });

        flashcard.addEventListener('click', () => {
            this.flipCard();
        });
    }

    openReviewMode(setId) {
        this.currentFlashcardSet = this.flashcardSets[setId];
        if (!this.currentFlashcardSet || this.currentFlashcardSet.cards.length === 0) {
            alert('Không có từ vựng nào để ôn tập!');
            return;
        }

        this.currentCardIndex = 0;
        this.isCardFlipped = false;
        this.navigateTo('review');
        this.renderCurrentCard();
        this.renderVocabList();
    }

    renderCurrentCard() {
        if (!this.currentFlashcardSet) return;

        const card = this.currentFlashcardSet.cards[this.currentCardIndex];
        const flashcard = document.getElementById('flashcard');

        document.getElementById('cardWord').textContent = card.word;
        document.getElementById('cardMeaning').textContent = card.meaning;
        document.getElementById('cardCounter').textContent = this.currentCardIndex + 1;

        // Reset flip state
        if (this.isCardFlipped) {
            flashcard.classList.remove('flipped');
            this.isCardFlipped = false;
        }
    }

    renderVocabList() {
        if (!this.currentFlashcardSet) return;

        const vocabList = document.getElementById('vocabList');

        vocabList.innerHTML = this.currentFlashcardSet.cards.map((card, index) => `
            <div class="vocab-item ${index === this.currentCardIndex ? 'active' : ''}" data-index="${index}">
                <span class="vocab-item-number">${index + 1}</span>
                <div>
                    <div class="vocab-item-word">${card.word}</div>
                    <div class="vocab-item-pinyin">${card.pinyin}</div>
                    <div class="vocab-item-meaning">${card.meaning}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        vocabList.querySelectorAll('.vocab-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-index'));
                this.currentCardIndex = index;
                this.renderCurrentCard();
                this.renderVocabList();
            });
        });
    }

    flipCard() {
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.toggle('flipped');
        this.isCardFlipped = !this.isCardFlipped;
    }

    previousCard() {
        if (!this.currentFlashcardSet) return;

        this.currentCardIndex = (this.currentCardIndex - 1 + this.currentFlashcardSet.cards.length) % this.currentFlashcardSet.cards.length;
        this.renderCurrentCard();
        this.renderVocabList();
    }

    nextCard() {
        if (!this.currentFlashcardSet) return;

        this.currentCardIndex = (this.currentCardIndex + 1) % this.currentFlashcardSet.cards.length;
        this.renderCurrentCard();
        this.renderVocabList();
    }

    // User Stats
    loadUserStats() {
        // Load from localStorage or use mock data
        const saved = localStorage.getItem('webhwe-stats');
        const stats = saved ? JSON.parse(saved) : mockUserStats;

        // Update UI
        this.updateStreakDisplay(stats.streak);
    }

    updateStreakDisplay(streak) {
        const stars = document.querySelectorAll('.streak-stars .star');
        stars.forEach((star, index) => {
            if (streak.days[index].active) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Persistence
    saveToLocalStorage() {
        localStorage.setItem('webhwe-flashcards', JSON.stringify(this.flashcardSets));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('webhwe-flashcards');
        if (saved) {
            this.flashcardSets = JSON.parse(saved);
        }
    }

    saveVideosToLocalStorage() {
        // Save videos array to localStorage
        localStorage.setItem('webhwe-videos', JSON.stringify(mockVideos));
    }

    loadVideosFromLocalStorage() {
        const saved = localStorage.getItem('webhwe-videos');
        if (saved) {
            const savedVideos = JSON.parse(saved);
            // Merge with mockVideos, keeping saved ones
            savedVideos.forEach(video => {
                if (!mockVideos.find(v => v.id === video.id)) {
                    mockVideos.push(video);
                }
            });
        }
    }

    // Utilities
    showToast(message, duration = 2000) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 32px;
            right: 32px;
            background: var(--color-primary);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// Add animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WebHweApp();
});
