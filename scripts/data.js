// Mock Data for the Application

const mockVideos = [];

const mockSubtitles = [];

const mockFlashcardSets = {};

// User Stats
const mockUserStats = {
    streak: {
        current: 4,
        days: [
            { day: 'Th3', active: true },
            { day: 'Th4', active: true },
            { day: 'Th5', active: true },
            { day: 'Th6', active: true },
            { day: 'Th7', active: false },
            { day: 'CN', active: false }
        ]
    },
    totalWords: 4,
    masteredWords: 0,
    learningWords: 4
};

// Dictionary Data (for quick lookup)
const dictionaryData = {
    '可是': { pinyin: 'kě shì', hanViet: 'Khả thị', meaning: 'nhưng', explanation: '可是 dùng để chỉ sự đối lập, tương tự như "nhưng" trong tiếng Việt.' },
    '死者': { pinyin: 'sǐ zhě', hanViet: 'Tử giả', meaning: 'người chết', explanation: '死者 chỉ những người đã qua đời, những người đã chết.' },
    '都': { pinyin: 'dōu', hanViet: 'Đô', meaning: 'đều', explanation: 'Trong câu này, "都" dùng để chỉ tính toàn thể, nghĩa là "tất cả; mọi người".' },
    '被': { pinyin: 'bèi', hanViet: 'Bị', meaning: 'bị', explanation: '被 là trợ từ chỉ bị động trong tiếng Trung.' },
    '故人': { pinyin: 'gù rén', hanViet: 'Cố nhân', meaning: 'người cũ', explanation: '故人 chỉ người quen cũ, bạn bè cũ hoặc người đã mất.' },
    '包围': { pinyin: 'bāo wéi', hanViet: 'Bao vi', meaning: 'bao vây', explanation: '包围 nghĩa là vây quanh, bao quanh.' },
    '了': { pinyin: 'le', hanViet: 'Liễu', meaning: 'rồi (hoàn thành)', explanation: '了 là trợ từ chỉ hoàn thành hoặc thay đổi trạng thái.' },
    '密道': { pinyin: 'mì dào', hanViet: 'Mật đạo', meaning: 'đường bí mật', explanation: '密道 là con đường bí mật, đường ngầm.' },
    '源': { pinyin: 'yuán', hanViet: 'Nguyên', meaning: 'nguồn', explanation: '源 nghĩa là nguồn gốc, khởi nguồn.' },
    '之': { pinyin: 'zhī', hanViet: 'Chi', meaning: 'của (văn ngôn)', explanation: '之 là trợ từ văn ngôn, tương đương với "的" trong tiếng Trung hiện đại.' },
    '笔': { pinyin: 'bǐ', hanViet: 'Bút', meaning: 'bút', explanation: '笔 nghĩa đen là cái bút, công cụ viết.' },
    '大人': { pinyin: 'dà rén', hanViet: 'Đại nhân', meaning: 'người lớn', explanation: '大人 có thể chỉ người lớn tuổi hoặc là cách xưng hô tôn trọng.' },
    '春': { pinyin: 'chūn', hanViet: 'Xuân', meaning: 'xuân', explanation: '春 nghĩa là mùa xuân.' },
    '已': { pinyin: 'yǐ', hanViet: 'Dĩ', meaning: 'đã', explanation: '已 là trạng từ chỉ đã hoàn thành.' },
    '至': { pinyin: 'zhì', hanViet: 'Chí', meaning: 'đến', explanation: '至 nghĩa là đến, tới (thường dùng trong văn ngôn).' },
    '此': { pinyin: 'cǐ', hanViet: 'Thử', meaning: 'đây', explanation: '此 là đại từ chỉ định, nghĩa là "này, đây".' },
    '不能': { pinyin: 'bù néng', hanViet: 'Bất năng', meaning: 'không thể', explanation: '不能 nghĩa là không có khả năng làm gì đó.' },
    '再': { pinyin: 'zài', hanViet: 'Tái', meaning: 'lại', explanation: '再 nghĩa là lại, tiếp tục (trong tương lai).' },
    '做': { pinyin: 'zuò', hanViet: 'Tố', meaning: 'làm', explanation: '做 là động từ chỉ hành động làm việc gì đó.' }
};

// Export data for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockVideos,
        mockSubtitles,
        mockFlashcardSets,
        mockUserStats,
        dictionaryData
    };
}
