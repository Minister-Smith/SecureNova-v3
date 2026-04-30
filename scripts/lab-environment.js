document.addEventListener('DOMContentLoaded', () => {
    const experiments = [
        {
            id: 'xss',
            name: 'XSS 跨站脚本',
            icon: '<i class="fas fa-code"></i>',
            desc: '注入恶意脚本窃取会话或Cookie',
            risk: '高危',
            typeTag: '前端',
            themeClass: 'theme-xss',
            intro: `<div class="info-box"><h4><i class="fas fa-bug"></i> 跨站脚本 (XSS)</h4><p>攻击者在网页中注入恶意JS代码，当其他用户访问时执行，可盗取Cookie、截图、钓鱼等。</p></div><div class="info-box"><h4>📌 类型</h4><ul><li><strong>反射型</strong> — URL参数直接反射</li><li><strong>存储型</strong> — 持久化在数据库</li><li><strong>DOM型</strong> — 前端DOM污染</li></ul></div><div class="info-box"><h4>📎 Payload 示例</h4><div class="code-block">&lt;script&gt;alert(document.cookie)&lt;/script&gt;<br>&lt;img src=x onerror=alert('XSS')&gt;</div></div>`,
            practice: (inputElId, resultId) => `
                <div class="info-box"><h4><i class="fas fa-dice-d6"></i> 反射型XSS模拟</h4><p>在下方输入框中尝试注入JavaScript代码，模拟搜索框回显漏洞。</p><div class="input-group"><label>🔍 搜索内容</label><input type="text" id="${inputElId}" placeholder='例如: &lt;script&gt;alert("XSS")&lt;/script&gt;' value="Hello"></div><button class="btn-run" id="runBtn_${inputElId}">💥 测试注入</button><div class="tip-box"><p>💡 提示: 输入 &lt;img src=x onerror=alert(1)&gt; 或 &lt;script&gt;alert(document.cookie)&lt;/script&gt;</p></div><div class="result" id="${resultId}">等待测试...</div></div>`,
            fix: `<div class="info-box"><h4><i class="fas fa-shield-haltered"></i> 防御措施</h4><ul><li>对输出进行HTML实体编码 (例如 &lt; 转 &amp;lt;)</li><li>使用CSP（内容安全策略）限制脚本源</li><li>Set-Cookie 添加 HttpOnly; Secure 标志</li></ul></div><div class="code-block">// 前端编码示例\nfunction escapeHtml(str) {\n  return str.replace(/[&<>]/g, function(m) {\n    if(m === '&') return '&amp;';\n    if(m === '<') return '&lt;';\n    if(m === '>') return '&gt;';\n    return m;\n  });\n}</div>`,
            check: (input) => /<script|onerror|onload|javascript:|alert\(|prompt\(|onclick/i.test(input)
        },
        {
            id: 'sqli',
            name: 'SQL 注入',
            icon: '<i class="fas fa-database"></i>',
            desc: '绕过认证或拖库的经典漏洞',
            risk: '高危',
            typeTag: '数据库',
            themeClass: 'theme-sqli',
            intro: `<div class="info-box"><h4>什么是SQL注入？</h4><p>通过拼接SQL语句，改变原始查询逻辑，可获取管理员权限或窃取数据。</p></div><div class="info-box"><h4>🔓 万能密码示例</h4><div class="code-block">' OR '1'='1' -- <br>admin' --<br>admin' UNION SELECT 1,password,3 FROM users--</div></div>`,
            practice: (inputElId, resultId) => `<div class="info-box"><h4>🔐 登录绕过实验室</h4><p>模拟后台登录，尝试使用SQL注入绕过密码验证。</p><div class="input-group"><label>👤 用户名</label><input type="text" id="${inputElId}" placeholder="admin' OR '1'='1"></div><button class="btn-run" id="runBtn_${inputElId}">🚀 登录</button><div class="result" id="${resultId}"></div><div class="tip-box"><p>经典Payload: admin' OR 1=1 --  或 任意用户名加 ' OR '1'='1</p></div></div>`,
            fix: `<div class="info-box"><h4>🛡️ 预编译/参数化查询</h4><p>永远不要直接拼接SQL，使用PDO或ORM</p><div class="code-block">$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");<br>$stmt->execute([$username]);</div></div>`,
            check: (input) => /('.*OR.*=.*')|(--|\bUNION\b|;.*DROP)/i.test(input)
        },
        {
            id: 'csrf',
            name: 'CSRF 请求伪造',
            icon: '<i class="fas fa-exchange-alt"></i>',
            desc: '伪造用户请求执行敏感操作',
            risk: '中危',
            typeTag: '认证',
            themeClass: 'theme-csrf',
            intro: `<div class="info-box"><h4>🤖 跨站请求伪造</h4><p>利用受害者已认证身份，在不知情下发起恶意请求。</p><p>经典场景: 修改密码/邮箱/转账。</p></div>`,
            practice: (inputElId, resultId) => `<div class="info-box"><h4>📧 修改邮箱（CSRF模拟）</h4><p>假设用户已登录，构造恶意请求修改邮箱。</p><div class="input-group"><label>新邮箱地址</label><input type="email" id="${inputElId}" value="attacker@evil.com"></div><button class="btn-run" id="runBtn_${inputElId}">📩 修改邮箱</button><div class="result" id="${resultId}"></div><div class="tip-box"><p>真实CSRF攻击需要诱使受害者点击链接或访问恶意站点，此处模拟后端校验缺失。</p></div></div>`,
            fix: `<div class="info-box"><h4>🔐 CSRF Token + SameSite</h4><ul><li>表单中加入不可预测Token并校验</li><li>设置Cookie SameSite=Lax或Strict</li><li>验证Referer/Origin头</li></ul><div class="code-block">&lt;input type="hidden" name="csrf_token" value="随机字符串"&gt;</div></div>`,
            check: (input) => input.includes('@') && input.includes('.')
        },
        {
            id: 'upload',
            name: '文件上传漏洞',
            icon: '<i class="fas fa-upload"></i>',
            desc: '上传恶意脚本获取Webshell',
            risk: '高危',
            typeTag: '文件',
            themeClass: 'theme-upload',
            intro: `<div class="info-box"><h4>📂 危险的上传</h4><p>未校验文件类型/扩展名导致攻击者可上传PHP、JSP等后门文件。</p><div class="code-block">&lt;?php system($_GET['cmd']); ?&gt;   // webshell</div></div>`,
            practice: (inputElId, resultId) => `<div class="info-box"><h4>📁 模拟上传点（绕过前端）</h4><p>尝试提交恶意文件名.<span class="upload-bypass-highlight">.php.jpg</span> 或直接上传 .php 文件。</p><div class="input-group"><label>📎 文件名</label><input type="text" id="${inputElId}" placeholder="shell.php"></div><button class="btn-run" id="runBtn_${inputElId}">⬆️ 上传文件</button><div class="result" id="${resultId}"></div><div class="tip-box"><p>常见绕过: shell.php, shell.php.jpg, 修改Content-Type</p></div></div>`,
            fix: `<div class="info-box"><h4>✅ 白名单+重命名</h4><ul><li>仅允许安全扩展名 jpg/png/gif/pdf</li><li>服务器端校验MIME类型 & 文件头签名</li><li>存储目录禁止执行脚本权限</li></ul></div>`,
            check: (input) => /\.(php|phtml|jsp|asp|aspx|cgi)$/i.test(input)
        },
        {
            id: 'lfi',
            name: '文件包含漏洞',
            icon: '<i class="fas fa-file-invoice"></i>',
            desc: '读取系统敏感文件',
            risk: '高危',
            typeTag: '路径遍历',
            themeClass: 'theme-lfi',
            intro: `<div class="info-box"><h4>🗂️ 本地文件包含(LFI)</h4><p>动态文件包含时未过滤路径，导致读取/etc/passwd或执行日志文件中的恶意代码。</p></div>`,
            practice: (inputElId, resultId) => `<div class="info-box"><h4>📄 页面包含功能</h4><p>尝试使用路径遍历读取敏感文件: ../../../../etc/passwd</p><div class="input-group"><label>文件路径</label><input type="text" id="${inputElId}" value="about.txt"></div><button class="btn-run" id="runBtn_${inputElId}">📖 包含文件</button><div class="result" id="${resultId}"></div><div class="tip-box"><p>Payload: ../../config.php 或 /var/log/apache/access.log</p></div></div>`,
            fix: `<div class="info-box"><h4>🔒 禁用动态包含 & 白名单</h4><ul><li>固定包含列表，禁止用户控制路径</li><li>使用realpath校验根目录</li><li>关闭allow_url_include</li></ul></div>`,
            check: (input) => /(\.\.\/|\.\.\\|etc\/passwd|\.\.\/\.\.\/)/i.test(input)
        },
        {
            id: 'ssrf',
            name: 'SSRF 服务端请求伪造',
            icon: '<i class="fas fa-globe"></i>',
            desc: '利用服务端访问内网资源',
            risk: '高危',
            typeTag: '内网探测',
            themeClass: 'theme-ssrf',
            intro: `<div class="info-box"><h4>🌐 SSRF漏洞</h4><p>服务端未校验用户提供的URL，导致可请求内网服务、读取云元数据等。</p></div>`,
            practice: (inputElId, resultId) => `<div class="info-box"><h4>🌍 内网探测模拟</h4><p>输入内网地址尝试探测本地服务: http://127.0.0.1:8080/admin</p><div class="input-group"><label>目标URL</label><input type="text" id="${inputElId}" value="http://169.254.169.254/latest/meta-data/"></div><button class="btn-run" id="runBtn_${inputElId}">📡 请求抓取</button><div class="result" id="${resultId}"></div><div class="tip-box"><p>内网目标: 127.0.0.1, localhost, 169.254.169.254 (云元数据)</p></div></div>`,
            fix: `<div class="info-box"><h4>✅ 内网IP黑名单+域名白名单</h4><ul><li>解析域名后校验IP是否为私有地址/回环</li><li>限制请求协议仅http/https</li><li>禁止302跳转到内网</li></ul></div>`,
            check: (input) => /(127\.0\.0\.1|localhost|169\.254|10\.|172\.(1[6-9]|2[0-9]|3[0-1])|192\.168\.)/i.test(input)
        }
    ];

    const detailPanel = document.getElementById('expDetail');
    const introPane = document.getElementById('tab-intro');
    const practicePane = document.getElementById('tab-practice');
    const fixPane = document.getElementById('tab-fix');
    const expGrid = document.getElementById('expGrid');

    if (!detailPanel || !introPane || !practicePane || !fixPane || !expGrid) {
        return;
    }

    function buildCards() {
        expGrid.innerHTML = '';
        experiments.forEach((exp) => {
            const card = document.createElement('div');
            card.className = 'exp-card';
            card.setAttribute('data-id', exp.id);
            card.innerHTML = `
                <div class="icon-wrapper ${exp.themeClass}">
                    ${exp.icon}
                </div>
                <h3>${exp.name}</h3>
                <p>${exp.desc}</p>
                <div class="tags"><span class="tag high">${exp.risk}</span><span class="tag">${exp.typeTag}</span></div>
            `;
            card.addEventListener('click', (event) => {
                event.stopPropagation();
                openExpDetail(exp.id);
            });
            expGrid.appendChild(card);
        });
    }

    function openExpDetail(expId) {
        const exp = experiments.find((item) => item.id === expId);
        if (!exp) return;

        introPane.innerHTML = exp.intro;
        fixPane.innerHTML = exp.fix;

        const uniqueInputId = `exp_input_${expId}_${Date.now()}`;
        const uniqueResultId = `exp_result_${expId}_${Date.now()}`;
        practicePane.innerHTML = exp.practice(uniqueInputId, uniqueResultId);

        const runBtn = document.getElementById(`runBtn_${uniqueInputId}`);
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                const inputElem = document.getElementById(uniqueInputId);
                const resultDiv = document.getElementById(uniqueResultId);
                if (!inputElem || !resultDiv) return;
                const userInput = inputElem.value;
                const isVuln = exp.check(userInput);
                if (isVuln) {
                    resultDiv.className = 'result danger';
                    resultDiv.innerHTML = `<i class="fas fa-skull-crossbones"></i> ✅ 漏洞利用成功！${getDangerMsg(expId)}<br><strong>Payload:</strong> ${escapeHtml(userInput)}<br><span class="result-note">说明存在安全隐患，请学习修复方案。</span>`;
                } else {
                    resultDiv.className = 'result success';
                    resultDiv.innerHTML = `<i class="fas fa-shield-virus"></i> 未检测到明显的攻击特征。${getSafeMsg(expId)}<br><strong>输入:</strong> ${escapeHtml(userInput)}`;
                }
            });
        }

        detailPanel.classList.add('show');
        activateTab('intro');
    }

    function getDangerMsg(expId) {
        const map = {
            xss: '恶意脚本被执行',
            sqli: '登录绕过成功，获取管理员权限',
            csrf: '伪造请求已修改敏感信息',
            upload: 'Webshell上传成功，服务器沦陷',
            lfi: '敏感文件内容泄露',
            ssrf: '内网资源被访问'
        };
        return map[expId] || '漏洞存在!';
    }

    function getSafeMsg(expId) {
        const map = {
            xss: '输入转义后安全',
            sqli: '参数化查询阻止注入',
            csrf: 'CSRF Token阻止伪造请求',
            upload: '白名单阻止恶意文件',
            lfi: '路径限制通过',
            ssrf: '内网地址被拦截'
        };
        return map[expId] || '安全策略生效';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, (match) => {
            if (match === '&') return '&amp;';
            if (match === '<') return '&lt;';
            if (match === '>') return '&gt;';
            return match;
        });
    }

    function activateTab(tabId) {
        const tabs = document.querySelectorAll('.exp-tab[data-tab]');
        const panes = [introPane, practicePane, fixPane];
        const tabNames = ['intro', 'practice', 'fix'];
        tabs.forEach((tab) => {
            const tabVal = tab.getAttribute('data-tab');
            tab.classList.toggle('active', tabVal === tabId);
        });
        panes.forEach((pane, index) => {
            pane.classList.toggle('active', tabNames[index] === tabId);
        });
    }

    function tabHandler(event) {
        const tab = event.currentTarget.getAttribute('data-tab');
        if (tab) activateTab(tab);
    }

    function closeDetail() {
        detailPanel.classList.remove('show');
    }

    function bindTabs() {
        document.querySelectorAll('.exp-tab[data-tab]').forEach((button) => {
            button.addEventListener('click', tabHandler);
        });
        const closeBtn = document.getElementById('closeDetailBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeDetail);
        }
    }

    buildCards();
    bindTabs();
});
