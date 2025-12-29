// Language Library / Thư viện ngôn ngữ
// Chỉ để xác nhận cấu trúc, chưa sử dụng để thay đổi

const languages = {
    vi: {
        name: 'Tiếng Việt',
        code: 'vi',
        translations: {
            // Navigation
            nav: {
                home: 'Trang chủ',
                videos: 'Danh sách video',
                flashcards: 'Từ vựng',
                myVideos: 'Video của tôi'
            },

            // Dashboard
            dashboard: {
                title: 'Ôn tập hàng ngày',
                wordsToReview: 'từ cần ôn tập',
                wordsMastered: 'từ đã thuộc',
                startReview: 'Bắt đầu ôn tập',
                uploadTitle: 'Luyện Shadowing để dễ dàng thông qua bất kỳ video nào bạn yêu thích',
                uploadText: 'Kéo và thả tại đây hoặc click để chọn file',
                uploadSubtext: 'Hỗ trợ video Youtube hoặc file MP4 từ máy tính của bạn',
                urlPlaceholder: 'Nhập URL Youtube hoặc tìm kiếm',
                createVideo: 'Tạo video',
                flashcardList: 'Danh sách Flashcard',
                flashcardSubtitle: 'Quản lý và ôn tập Flashcard của bạn'
            },

            // Video Player
            player: {
                subtitle: 'Phụ đề',
                rewind: 'Tua lại 5 giây',
                play: 'Phát',
                pause: 'Tạm dừng',
                forward: 'Tua đi 5 giây',
                noSubtitles: 'Không có phụ đề'
            },

            // Flashcards
            flashcard: {
                title: 'Từ vựng',
                add: 'Thêm',
                review: 'Ôn tập',
                learning: 'từ đang ôn',
                mastered: 'từ đã thuộc',
                vocabulary: 'Từ vựng',
                noWordsToReview: 'Không có từ vựng nào để ôn tập!'
            },

            // Dictionary
            dictionary: {
                listen: 'Nghe',
                copy: 'Sao chép',
                addToFlashcard: 'Thêm vào Flashcard',
                copied: 'Đã sao chép!',
                wordAdded: 'Đã thêm vào Flashcard!',
                wordExists: 'Từ này đã có trong danh sách!'
            },

            // Messages
            messages: {
                analyzing: 'Đang phân tích video... Vui lòng đợi.',
                analysisComplete: 'Phân tích hoàn tất!',
                backendNotRunning: 'Backend server chưa chạy. Vui lòng khởi động backend bằng lệnh: python backend/server.py',
                ffmpegNotInstalled: 'FFmpeg chưa được cài đặt. Xem hướng dẫn trong backend/README.md',
                errorAnalyzing: 'Lỗi khi phân tích video.'
            },

            // Stats
            stats: {
                streak: 'Streak',
                days: {
                    mon: 'Th2',
                    tue: 'Th3',
                    wed: 'Th4',
                    thu: 'Th5',
                    fri: 'Th6',
                    sat: 'Th7',
                    sun: 'CN'
                }
            }
        }
    },

    zh_TW: {
        name: '繁體中文',
        code: 'zh-TW',
        translations: {
            // Navigation
            nav: {
                home: '首頁',
                videos: '影片列表',
                flashcards: '詞彙',
                myVideos: '我的影片'
            },

            // Dashboard
            dashboard: {
                title: '每日複習',
                wordsToReview: '個單詞需要複習',
                wordsMastered: '個已掌握',
                startReview: '開始複習',
                uploadTitle: '練習跟讀，輕鬆學習任何你喜歡的影片',
                uploadText: '拖放到這裡或點擊選擇檔案',
                uploadSubtext: '支援 Youtube 影片或電腦中的 MP4 檔案',
                urlPlaceholder: '輸入 Youtube URL 或搜尋',
                createVideo: '建立影片',
                flashcardList: '單字卡列表',
                flashcardSubtitle: '管理和複習您的單字卡'
            },

            // Video Player
            player: {
                subtitle: '字幕',
                rewind: '後退 5 秒',
                play: '播放',
                pause: '暫停',
                forward: '前進 5 秒',
                noSubtitles: '沒有字幕'
            },

            // Flashcards
            flashcard: {
                title: '詞彙',
                add: '新增',
                review: '複習',
                learning: '個正在學習',
                mastered: '個已掌握',
                vocabulary: '詞彙',
                noWordsToReview: '沒有需要複習的詞彙！'
            },

            // Dictionary
            dictionary: {
                listen: '聆聽',
                copy: '複製',
                addToFlashcard: '加入單字卡',
                copied: '已複製！',
                wordAdded: '已加入單字卡！',
                wordExists: '這個詞已在列表中！'
            },

            // Messages
            messages: {
                analyzing: '正在分析影片... 請稍候。',
                analysisComplete: '分析完成！',
                backendNotRunning: '後端伺服器未運行。請使用以下命令啟動：python backend/server.py',
                ffmpegNotInstalled: '尚未安裝 FFmpeg。請參閱 backend/README.md 中的說明',
                errorAnalyzing: '分析影片時出錯。'
            },

            // Stats
            stats: {
                streak: '連勝',
                days: {
                    mon: '週一',
                    tue: '週二',
                    wed: '週三',
                    thu: '週四',
                    fri: '週五',
                    sat: '週六',
                    sun: '週日'
                }
            }
        }
    }
};

// Current language (default: Vietnamese)
let currentLanguage = 'vi';

// Helper function to get translation
function t(key) {
    const keys = key.split('.');
    let value = languages[currentLanguage].translations;

    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    return value;
}

// Function to change language
function changeLanguage(langCode) {
    if (languages[langCode]) {
        currentLanguage = langCode;
        // TODO: Update UI with new translations
        console.log(`Language changed to: ${languages[langCode].name}`);
    } else {
        console.error(`Language not found: ${langCode}`);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        languages,
        currentLanguage,
        t,
        changeLanguage
    };
}
