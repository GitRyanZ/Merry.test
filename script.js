// 全局变量
let currentQuestion = 0;
let questions = [];
let answers = [];
let startTime;
let optionsShowTime; // 添加选项显示时间变量
let totalTime = 20 * 60 * 1000; // 20分钟
let questionTimer;
let examTimer;

// 禁用右键菜单和复制
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());

// 页面离开提示
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '';
});

// 表单验证和开始考试
document.getElementById('startExam').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const studentNumber = document.getElementById('studentNumber').value;

    if (!name || !studentNumber) {
        alert('请填写完整信息！');
        return;
    }

    // 保存学生信息
    localStorage.setItem('studentInfo', JSON.stringify({
        name,
        studentNumber,
        startTime: new Date().toISOString()
    }));

    // 初始化考试
    initExam();
});

// 初始化考试
function initExam() {
    // 题库
    questions = [
        {
            id: 1,
            question: "Which is the \"hand\" radical",
            options: ["犭", "扌", "手", "木"],
            correctAnswer: "B"
        },
        {
            id: 2,
            question: "Identify the \"food\" radical",
            options: ["欠", "饣", "尔", "攵"],
            correctAnswer: "B"
        },
        {
            id: 3,
            question: "Select the \"speech\" radical",
            options: ["讠", "礻", "忄", "说"],
            correctAnswer: "A"
        },
        {
            id: 4,
            question: "Which is the \"standing-heart\" radical",
            options: ["小", "忄", "心", "亻"],
            correctAnswer: "B"
        },
        {
            id: 5,
            question: "Select the \"bamboo\" radical",
            options: ["艹", "竹", "⺮", "丬"],
            correctAnswer: "A"
        },
        {
            id: 6,
            question: "Identify the radical of \"head\"",
            options: ["斗", "头", "求", "乛"],
            correctAnswer: "B"
        },
        {
            id: 7,
            question: "Which is the radical of \"electricity\"",
            options: ["由", "电", "点", "丂"],
            correctAnswer: "B"
        },
        {
            id: 8,
            question: "Which is the radical of \"bird\"",
            options: ["鸟", "马", "飞", "角"],
            correctAnswer: "A"
        },
        {
            id: 9,
            question: "Select the radical of \"inch\"",
            options: ["寸", "可", "一", "十"],
            correctAnswer: "A"
        },
        {
            id: 10,
            question: "Identify the radical of \"car\"",
            options: ["乐", "东", "车", "六"],
            correctAnswer: "C"
        },
        {
            id: 11,
            question: "Which is the \"eye\" radical",
            options: ["目", "日", "且", "眼"],
            correctAnswer: "A"
        },
        {
            id: 12,
            question: "Select the \"knife\" radical",
            options: ["力", "斤", "刀", "我"],
            correctAnswer: "C"
        },
        {
            id: 13,
            question: "Identify the radical of \"ten\"",
            options: ["十", "<img src='radical_13b.png' alt='radical 13b' class='radical-image'>", "干", "彐"],
            correctAnswer: "A",
            hasImage: true
        },
        {
            id: 14,
            question: "Select the radical of \"eight\"",
            options: ["人", "入", "八", "乂"],
            correctAnswer: "C"
        },
        {
            id: 15,
            question: "Find the radical of \"open\"",
            options: ["开", "井", "升", "打"],
            correctAnswer: "A"
        },
        {
            id: 16,
            question: "Chose the radical of \"half\"",
            options: ["立", "哈", "平", "半"],
            correctAnswer: "D"
        },
        {
            id: 17,
            question: "Select the radical of \"seven\"",
            options: ["匕", "七", "也", "二"],
            correctAnswer: "B"
        },
        {
            id: 18,
            question: "Identify the \"end\" radical",
            options: ["末", "未", "巫", "囚"],
            correctAnswer: "A"
        },
        {
            id: 19,
            question: "Find the \"mouth\" radical",
            options: ["口", "囗", "曰", "白"],
            correctAnswer: "A"
        },
        {
            id: 20,
            question: "Chose the radical of \"nine\"",
            options: ["三", "儿", "九", "几"],
            correctAnswer: "C"
        },
        {
            id: 21,
            question: "Which is the \"wood\" radical",
            options: ["禾", "木", "十", "伞"],
            correctAnswer: "B"
        },
        {
            id: 22,
            question: "Find the \"grass\" radical",
            options: ["艹", "⺮", "草", "龷"],
            correctAnswer: "A"
        },
        {
            id: 23,
            question: "Select the \"double-people\" radical",
            options: ["彳", "人", "亻", "文"],
            correctAnswer: "A"
        },
        {
            id: 24,
            question: "Chose the \"ice\" radical",
            options: ["冫", "氵", "灬", "丷"],
            correctAnswer: "A"
        },
        {
            id: 25,
            question: "Which is the \"small\" radical",
            options: ["京", "小", "示", "忄"],
            correctAnswer: "B"
        },
        {
            id: 26,
            question: "Select the \"west\" radical",
            options: ["面", "覀", "酉", "西"],
            correctAnswer: "D"
        },
        {
            id: 27,
            question: "Chose the \"cloud\" radical",
            options: ["去", "云", "区", "辶"],
            correctAnswer: "B"
        },
        {
            id: 28,
            question: "Find the \"learn\" radical",
            options: ["冖", "宀", "<img src='learn_radical.png' alt='learn radical' class='radical-image'>", "爫"],
            correctAnswer: "C",
            hasImage: true
        },
        {
            id: 29,
            question: "Select the \"rice\" radical",
            options: ["米", "来", "未", "火"],
            correctAnswer: "A"
        },
        {
            id: 30,
            question: "Which is the \"sky\" radical",
            options: ["大", "矢", "天", "上"],
            correctAnswer: "C"
        }
    ];

    // 随机排序题目，但保留原始ID
    questions.sort(() => Math.random() - 0.5);
    
    // 开始考试计时
    startTime = Date.now();
    startExamTimer();
    
    // 显示第一题
    showQuestion(0);
}

// 显示题目
function showQuestion(index) {
    const container = document.querySelector('.container');
    const currentQ = questions[index];
    
    container.innerHTML = `
        <div class="exam-container">
            <div class="timer" id="examTimer"></div>
            <div class="question">Question ${index + 1}: ${currentQ.question}</div>
            <div class="options" id="options"></div>
        </div>
    `;

    // 5秒后显示选项
    setTimeout(() => {
        showOptions(index);
    }, 5000);
}

// 显示选项
function showOptions(index) {
    const optionsContainer = document.getElementById('options');
    optionsContainer.style.display = 'block';
    
    // 记录选项显示时间
    optionsShowTime = Date.now();
    
    const currentQ = questions[index];
    
    currentQ.options.forEach((option, i) => {
        const button = document.createElement('button');
        button.className = 'option';
        if (currentQ.hasImage && option.startsWith('<img')) {
            button.innerHTML = `${String.fromCharCode(65 + i)}. ${option}`;
        } else {
            button.textContent = `${String.fromCharCode(65 + i)}. ${option}`;
        }
        button.onclick = () => {
            // 移除其他选项的选中状态
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // 添加当前选项的选中状态
            button.classList.add('selected');
            selectAnswer(index, i);
        };
        optionsContainer.appendChild(button);
    });

    // 添加下一题按钮
    const nextButton = document.createElement('button');
    nextButton.className = 'btn-primary next-btn';
    nextButton.textContent = 'Next';
    nextButton.onclick = () => {
        // 记录答题时间
        const answerTime = Date.now() - optionsShowTime;
        if (answers[index]) {
            answers[index].timeSpent = answerTime;
        } else {
            // 如果没有选择答案，记录为超时
            answers[index] = {
                questionIndex: index,
                timeSpent: 10000, // 10秒
                answered: false
            };
        }
        nextQuestion();
    };
    optionsContainer.appendChild(nextButton);

    // 启动10秒答题计时
    startQuestionTimer(index);
}

// 选择答案
function selectAnswer(questionIndex, optionIndex) {
    const answer = {
        questionIndex,
        selectedOption: optionIndex,
        answered: true
    };
    answers[questionIndex] = answer;
}

// 下一题
function nextQuestion() {
    clearInterval(questionTimer);
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else {
        showPasswordVerification();
    }
}

// 开始考试计时器
function startExamTimer() {
    examTimer = setInterval(() => {
        const timeLeft = totalTime - (Date.now() - startTime);
        if (timeLeft <= 0) {
            clearInterval(examTimer);
            showPasswordVerification();
        }
        document.getElementById('examTimer').textContent = 
            `Timer: ${Math.floor(timeLeft / 60000)}:${((timeLeft % 60000) / 1000).toFixed(0).padStart(2, '0')}`;
    }, 1000);
}

// 开始题目计时器
function startQuestionTimer(index) {
    let timeLeft = 10000;
    questionTimer = setInterval(() => {
        timeLeft -= 1000;
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            // 记录为超时
            answers[index] = {
                questionIndex: index,
                timeSpent: 10000, // 10秒
                answered: false
            };
            nextQuestion();
        }
    }, 1000);
}

// 显示密码验证页面
function showPasswordVerification() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="password-container">
            <h2>End Exam</h2>
            <input type="password" id="password" class="password-input" placeholder="请输入教师密码">
            <button class="btn-primary" onclick="verifyPassword()">验证</button>
        </div>
    `;
}

// 验证密码
function verifyPassword() {
    const password = document.getElementById('password').value;
    if (password === '980430') {
        showResults();
    } else {
        alert('密码错误，请重试！');
    }
}

// 显示成绩页面
function showResults() {
    const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
    const container = document.querySelector('.container');
    
    // 计算得分
    const score = answers.reduce((total, answer) => {
        return total + (answer && answer.answered && questions[answer.questionIndex].correctAnswer === 
            String.fromCharCode(65 + answer.selectedOption) ? 1 : 0);
    }, 0);

    // 计算平均耗时
    const totalTimeSpent = answers.reduce((total, answer) => total + (answer ? answer.timeSpent : 10000), 0);
    const avgTime = totalTimeSpent / 30; // 直接除以30题

    container.innerHTML = `
        <h2>考试结果</h2>
        <table class="results-table">
            <tr>
                <th>学生姓名</th>
                <td>${studentInfo.name}</td>
            </tr>
            <tr>
                <th>学生编号</th>
                <td>${studentInfo.studentNumber}</td>
            </tr>
            <tr>
                <th>总得分</th>
                <td>${score}</td>
            </tr>
            <tr>
                <th>平均每题耗时</th>
                <td>${(avgTime / 1000).toFixed(2)}秒</td>
            </tr>
        </table>
        <button class="btn-primary export-btn" onclick="exportResults()">导出为CSV</button>
    `;
}

// 导出成绩
function exportResults() {
    const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
    const totalTimeSpent = answers.reduce((total, answer) => total + (answer ? answer.timeSpent : 10000), 0);
    const avgTime = totalTimeSpent / 30;
    
    const csvContent = [
        ['学生姓名', '学生编号', '总得分', '平均每题耗时'],
        [
            studentInfo.name,
            studentInfo.studentNumber,
            answers.reduce((total, answer) => total + (answer && answer.answered && questions[answer.questionIndex].correctAnswer === 
                String.fromCharCode(65 + answer.selectedOption) ? 1 : 0), 0),
            (avgTime / 1000).toFixed(2)
        ]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `考试结果_${studentInfo.name}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
} 