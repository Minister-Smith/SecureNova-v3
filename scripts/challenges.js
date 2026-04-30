document.addEventListener('DOMContentLoaded', () => {
    const challenges = {
        'sql-injection': {
            title: 'SQL注入入门',
            difficulty: 'Easy',
            description: '模拟一个登录验证接口，目标是提交一个能绕过密码校验的SQL注入payload。',
            instructions: '<p>登录表单直接将用户名和密码拼接到SQL查询中。请构造一个payload，让验证条件总是成立。</p>',
            taskHtml: '<label for="challengeInput">请输入Payload</label><input id="challengeInput" type="text" placeholder="例如: admin\' OR \'1\'=\'1\' --">',
            hint: '尝试使用单引号关闭字符串，并加入 OR 1=1 来使条件恒为真。',
            solution: 'admin\' OR \'1\'=\'1\' --',
            checker: (input) => {
                if (!input.trim()) return { success: false, message: '请输入攻击payload。' };
                const payload = input.toLowerCase();
                if (/or\s+[\'\"]?1[\'\"]?\s*=\s*[\'\"]?1[\'\"]?/.test(payload) || /\'\s*or\s*1=1/.test(payload) || /or\s+1=1/.test(payload)) {
                    return { success: true, message: '验证绕过成功，您已获取管理员访问权限。' };
                }
                return { success: false, message: '未检测到可用的SQL注入技巧，建议使用 OR 1=1 或 UNION SELECT 等payload。' };
            }
        },
        'xss-reflection': {
            title: 'XSS反射型',
            difficulty: 'Easy',
            description: '模拟搜索框回显漏洞，目标是输入payload触发浏览器警告。',
            instructions: '<p>请构造一个反射型XSS payload，页面会将你的输入直接写回到HTML中。</p>',
            taskHtml: '<label for="challengeInput">请输入XSS Payload</label><input id="challengeInput" type="text" placeholder="例如: &lt;script&gt;alert(1)&lt;/script&gt;">',
            hint: '常见payload包括 &lt;script&gt;alert(1)&lt;/script&gt; 或 <img src=x onerror=alert(1)>。',
            solution: '&lt;script&gt;alert(1)&lt;/script&gt;',
            checker: (input) => {
                if (!input.trim()) return { success: false, message: '请输入XSS payload。' };
                if (/(<script|onerror|onload|javascript:)/i.test(input)) {
                    return { success: true, message: '成功触发反射型XSS，攻击代码会被浏览器执行。' };
                }
                return { success: false, message: '未检测到有效的XSS触发方式，请尝试包含 <script> 或 onerror。' };
            }
        },
        'upload-bypass': {
            title: '文件上传绕过',
            difficulty: 'Medium',
            description: '前端只校验扩展名，后端也可能存在类型绕过漏洞。',
            instructions: '<p>请填写一个能够绕过前端检查并可能让服务器误判为安全图像的恶意文件名。</p>',
            taskHtml: '<label for="challengeInput">请输入文件名</label><input id="challengeInput" type="text" placeholder="例如: shell.php.jpg">',
            hint: '绕过检查的常见写法是 .php.jpg 或 .php 但同时让后端未严格校验文件头。',
            solution: 'shell.php.jpg',
            checker: (input) => {
                if (!input.trim()) return { success: false, message: '请输入要上传的文件名。' };
                if (/\.php(\.|$)|\.phtml(\.|$)|\.jsp(\.|$)|\.asp(\.|$)/i.test(input)) {
                    return { success: true, message: '文件名绕过成功，恶意脚本可能被上传并执行。' };
                }
                return { success: false, message: '未检测到危险扩展名，尝试使用 .php.jpg 或 .php 等绕过方式。' };
            }
        },
        'blind-sqli': {
            title: '盲注挑战',
            difficulty: 'Medium',
            description: '在没有回显的场景中，使用逻辑判断进行SQL盲注。',
            instructions: '<p>目标是通过盲注让条件成立。请输入会让查询结果为真但不依赖返回内容的payload。</p>',
            taskHtml: '<label for="challengeInput">请输入盲注payload</label><input id="challengeInput" type="text" placeholder="例如: 1\' AND 1=1 --">',
            hint: '盲注通常会用 AND 1=1 或 OR 1=1 让逻辑分支返回真。',
            solution: '1\' AND 1=1 --',
            checker: (input) => {
                if (!input.trim()) return { success: false, message: '请输入盲注payload。' };
                const payload = input.toLowerCase();
                if (/(and|or)\s+1\s*=\s*1/.test(payload) || /sleep\(/.test(payload)) {
                    return { success: true, message: '盲注payload有效，您已成功让条件成立。' };
                }
                return { success: false, message: '当前payload未触发盲注逻辑，请尝试 AND 1=1 或 OR 1=1。' };
            }
        },
        csrf: {
            title: 'CSRF攻击',
            difficulty: 'Medium',
            description: '构造一个会在用户不知情情况下提交危险请求的CSRF payload。',
            instructions: '<p>请生成一个可以自动提交到目标站点的HTML片段，利用受害者浏览器的身份登录发送请求。</p>',
            taskHtml: '<label for="challengeInput">请输入CSRF payload</label><textarea id="challengeInput" placeholder="例如: &lt;img src=\"http://example.com/transfer?amount=1000&to=attacker\" /&gt;"></textarea>',
            hint: '可以使用 <img> 或自动提交的 <form>，目标是让浏览器在用户登录状态下发送请求。',
            solution: '<img src="http://example.com/transfer?amount=1000&to=attacker">',
            checker: (input) => {
                if (!input.trim()) return { success: false, message: '请输入CSRF payload。' };
                if (/(<form|<img|<body|<script)/i.test(input) && /http[s]?:\/\//i.test(input) && /\?/i.test(input)) {
                    return { success: true, message: 'CSRF payload 构造成功，攻击可在受害者会话中执行。' };
                }
                return { success: false, message: '未检测到有效CSRF结构，请使用 <img> 或 <form> 且包含请求URL。' };
            }
        },
        ssrf: {
            title: 'SSRF进阶',
            difficulty: 'Hard',
            description: '利用服务端请求伪造访问内网或云元数据地址。',
            instructions: '<p>请填写一个可能被后端请求的内部URL，让服务端访问内部资源。</p>',
            taskHtml: '<label for="challengeInput">请输入目标URL</label><input id="challengeInput" type="text" placeholder="例如: http://127.0.0.1:8080/admin">',
            hint: '你可以尝试访问 127.0.0.1、localhost、169.254.169.254 等内部地址。',
            solution: 'http://127.0.0.1:8080/admin',
            checker: (input) => {
                if (!input.trim()) return { success: false, message: '请输入目标URL。' };
                if (/(127\.0\.0\.1|localhost|169\.254\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])|192\.168\.)/i.test(input)) {
                    return { success: true, message: 'SSRF payload 有效，服务端可能会访问内网地址。' };
                }
                return { success: false, message: '未检测到内网地址，请尝试使用 127.0.0.1、localhost 或 169.254.169.254。' };
            }
        },
        xxe: {
            title: 'XXE漏洞',
            difficulty: 'Hard',
            description: '利用XML外部实体注入读取服务器上的本地敏感文件。',
            instructions: '<p>请构造一个包含外部实体的XML片段，目标是让解析器读取本地敏感文件。</p>',
            taskHtml: '<label for="challengeInput">请输入XXE Payload</label><textarea id="challengeInput" placeholder="例如: <!DOCTYPE root [<!ENTITY xxe SYSTEM \\\"file:///etc/passwd\\\">]>\n<root>&xxe;</root>"></textarea>',
            hint: '通常需要 <!DOCTYPE ...> 和 <!ENTITY ... SYSTEM "file://..."> 来读取本地文件。',
            solution: '<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>',
            checker: (input) => {
                if (!input.trim()) return { success: false, message: '请输入XXE payload。' };
                if (/<!DOCTYPE[\s\S]*<!ENTITY[\s\S]*SYSTEM[\s\S]*file:\/\//i.test(input)) {
                    return { success: true, message: 'XXE payload 有效，解析器可能会加载本地文件。' };
                }
                return { success: false, message: '未检测到XXE结构，请使用 <!DOCTYPE> 与 <!ENTITY SYSTEM "file://...">。' };
            }
        },
        'command-injection': {
            title: '命令注入',
            difficulty: 'Hard',
            description: '在服务器执行命令时插入恶意指令，获取远程Shell。',
            instructions: '<p>请构造一个可以让命令链继续执行追加命令的payload。</p>',
            taskHtml: '<label for="challengeInput">请输入命令注入Payload</label><input id="challengeInput" type="text" placeholder="例如: ; ls -la">',
            hint: '通过 ;、&&、| 或 $() 等符号追加额外命令即可。',
            solution: '; ls -la',
            checker: (input) => {
                if (!input.trim()) return { success: false, message: '请输入命令注入payload。' };
                if (/;|&&|\||\$\(|\`/.test(input) && /\w/.test(input)) {
                    return { success: true, message: '命令注入 payload 有效，恶意指令可被追加执行。' };
                }
                return { success: false, message: '当前 payload 不包含常见注入符号，请尝试 ;、&&、| 或 $()。' };
            }
        }
    };

    const modal = document.getElementById('challengeModal');
    const titleEl = document.getElementById('challengeTitle');
    const difficultyEl = document.getElementById('challengeDifficulty');
    const descEl = document.getElementById('challengeDescription');
    const instrEl = document.getElementById('challengeInstructions');
    const taskArea = document.getElementById('challengeTaskArea');
    const resultEl = document.getElementById('challengeResult');
    const hintEl = document.getElementById('challengeHint');
    const solEl = document.getElementById('challengeSolution');
    const submitBtn = document.getElementById('submitChallengeBtn');
    const hintBtn = document.getElementById('showHintBtn');
    const solBtn = document.getElementById('showSolutionBtn');
    const closeBtn = document.getElementById('closeChallengeBtn');
    let activeChallenge = null;

    if (!modal || !titleEl || !difficultyEl || !descEl || !instrEl || !taskArea || !resultEl || !hintEl || !solEl || !submitBtn || !hintBtn || !solBtn || !closeBtn) {
        return;
    }

    function openChallenge(id) {
        const challenge = challenges[id];
        if (!challenge) return;
        activeChallenge = challenge;
        titleEl.textContent = challenge.title;
        difficultyEl.textContent = challenge.difficulty;
        descEl.textContent = challenge.description;
        instrEl.innerHTML = challenge.instructions;
        taskArea.innerHTML = challenge.taskHtml;
        resultEl.textContent = '点击“提交解答”开始验证。';
        resultEl.className = 'challenge-result';
        hintEl.textContent = challenge.hint;
        solEl.textContent = challenge.solution;
        hintEl.classList.add('hidden');
        solEl.classList.add('hidden');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeChallenge() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        activeChallenge = null;
    }

    function submitAnswer() {
        if (!activeChallenge) return;
        const inputEl = document.getElementById('challengeInput');
        if (!inputEl) return;
        const answer = inputEl.value.trim();
        const result = activeChallenge.checker(answer);
        resultEl.textContent = result.message;
        resultEl.className = `challenge-result ${result.success ? 'success' : 'error'}`;
    }

    function toggleHint() {
        if (!activeChallenge) return;
        hintEl.classList.toggle('hidden');
    }

    function toggleSolution() {
        if (!activeChallenge) return;
        solEl.classList.toggle('hidden');
    }

    document.querySelectorAll('a[data-challenge]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            openChallenge(link.dataset.challenge);
        });
    });

    submitBtn.addEventListener('click', submitAnswer);
    hintBtn.addEventListener('click', toggleHint);
    solBtn.addEventListener('click', toggleSolution);
    closeBtn.addEventListener('click', closeChallenge);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeChallenge();
    });
});
