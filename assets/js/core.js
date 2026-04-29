// --- 燕园调查局 核心逻辑引擎 ---

// 1. 初始存档数据
let gameState = {
    day: 1,
    theoryScore: 0,
    methodScore: 0,
    unlockedClues: [],
    currentScene: "start"
};

// 2. 知识点数据库 (示例)
const knowledgeBase = {
    "day1_01": { title: "社会学", content: "社会学是关于社会良性运行和协调发展的条件和机制的综合性具体社会科学。" },
    "day1_02": { title: "实证主义", content: "孔德提出，主张用自然科学的方法来研究社会现象。" }
};

// 3. 剧情文本库
const storyScript = {
    "start": {
        text: "导师看着你：'探员，欢迎来到这片迷雾。在深入北大社会学森林之前，你必须先掌握最基础的法术——什么是社会学？'",
        options: [
            { text: "请教导师（获取名词解释）", action: "get_clue" },
            { text: "跳过寒暄（直接开始解谜）", action: "start_puzzle" }
        ]
    }
};

// 4. 引擎初始化
function initGame() {
    // 尝试读取本地存档
    const savedData = localStorage.getItem('pku_game_save');
    if (savedData) {
        gameState = JSON.parse(savedData);
    }
    renderScene();
    updateUI();
}

// 5. 渲染场景与对话
function renderScene() {
    const scene = storyScript[gameState.currentScene];
    if (scene) {
        document.getElementById('dialogue-text').innerText = scene.text;
        const optContainer = document.getElementById('options-container');
        optContainer.innerHTML = ''; // 清空选项

        scene.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "px-6 py-2 border border-red-600 hover:bg-red-900 transition rounded";
            btn.innerText = opt.text;
            btn.onclick = () => handleAction(opt.action);
            optContainer.appendChild(btn);
        });
    }
}

// 6. 处理动作
function handleAction(action) {
    if (action === "get_clue") {
        // 解锁第一个知识点
        gameState.theoryScore += 5;
        gameState.unlockedClues.push("day1_01");
        alert("系统提示：你学会了第一个魔法【社会学定义】！");
        saveGame();
        updateUI();
    }
}

// 7. 更新界面显示
function updateUI() {
    document.getElementById('stat-theory').innerText = gameState.theoryScore;
    document.getElementById('current-day').innerText = `Day ${gameState.day.toString().padStart(2, '0')}: 初心启程`;
    
    // 更新左侧线索列表
    const clueList = document.getElementById('clue-list');
    clueList.innerHTML = '';
    gameState.unlockedClues.forEach(cid => {
        const clue = knowledgeBase[cid];
        const div = document.createElement('div');
        div.className = "text-[10px] bg-red-900 bg-opacity-30 p-2 rounded border border-red-800";
        div.innerHTML = `<b>${clue.title}:</b> ${clue.content}`;
        clueList.appendChild(div);
    });
}

// 8. 存档功能
function saveGame() {
    localStorage.setItem('pku_game_save', JSON.stringify(gameState));
}

// 启动！
initGame();
