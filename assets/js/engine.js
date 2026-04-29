let currentChapter = "day1";
let currentNodeIndex = 0;

function loadGame() {
    const saved = localStorage.getItem('pku_rpg_save');
    if (saved) gameState = JSON.parse(saved);
    renderChapter();
}

function renderChapter() {
    const chapter = gameContent.chapters[currentChapter];
    const node = chapter.nodes[currentNodeIndex];

    document.getElementById('current-day').innerText = chapter.title;
    document.getElementById('npc-name').innerText = chapter.npc;
    document.getElementById('scene-desc').innerText = chapter.sceneDesc;
    
    // 渲染对话文本
    let html = `<p class='text-red-400 mb-2'>[当前位置: ${node.triggerText}]</p>`;
    html += `<p class='mb-4'>${node.content}</p>`;
    html += `<p class='text-yellow-400 border-l-2 border-yellow-600 pl-2'>${node.puzzle}</p>`;
    document.getElementById('dialogue-text').innerHTML = html;

    // 渲染选项
    const optContainer = document.getElementById('options-container');
    optContainer.innerHTML = '';
    node.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "px-4 py-2 border border-red-800 hover:bg-red-900 text-sm rounded transition";
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(opt, node.id);
        optContainer.appendChild(btn);
    });
}

function selectOption(opt, nodeId) {
    // 1. 检查是否已经解锁过该节点（防止刷分）
    const isAlreadySolved = gameState.unlockedClues.includes(opt.unlockClue);

    if (opt.score > 0) {
        alert("【解谜成功】 " + opt.feedback);
        if (!isAlreadySolved && opt.unlockClue) {
            gameState.theoryScore += opt.score;
            gameState.unlockedClues.push(opt.unlockClue);
        }
    } else {
        alert("【思维误区】 " + opt.feedback);
    }

    // 2. 推进剧情节点
    const chapter = gameContent.chapters[currentChapter];
    if (currentNodeIndex < chapter.nodes.length - 1) {
        currentNodeIndex++;
    } else {
        alert("恭喜！你完成了今日的田野调查。");
    }

    saveGame();
    renderChapter();
    updateUI();
}

function updateUI() {
    document.getElementById('stat-theory').innerText = gameState.theoryScore;
    const clueContainer = document.getElementById('clue-list');
    clueContainer.innerHTML = '';
    gameState.unlockedClues.forEach(id => {
        const data = gameContent.clues[id];
        if (data) {
            const div = document.createElement('div');
            div.className = "mb-2 p-2 bg-gray-800 border-l-2 border-red-600 text-[11px]";
            div.innerHTML = `<b class='text-red-500'>${data.title}:</b><br>${data.detail}`;
            clueContainer.appendChild(div);
        }
    });
}

// 初始化
window.onload = loadGame;
