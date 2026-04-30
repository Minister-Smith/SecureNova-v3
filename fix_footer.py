import os

# 学习路径目录
dir_path = r'd:\移动硬盘\Learning\1-网安\SecureNova v3\learning-path'

# 页脚模板
footer_template = '''    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>快速链接</h4>
                <ul>
                    <li><a href="../index.html">首页</a></li>
                    <li><a href="../learning-path/index.html">学习路径</a></li>
                    <li><a href="../lab-environment/index.html">实验环境</a></li>
                    <li><a href="../challenges/index.html">挑战题目</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>学习资源</h4>
                <ul>
                    <li><a href="../resources/index.html">推荐书籍</a></li>
                    <li><a href="../resources/index.html">在线平台</a></li>
                    <li><a href="../resources/index.html">社区论坛</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>联系我们</h4>
                <ul>
                    <li><i class="fas fa-envelope"></i> ms3079266256@outlook.com</li>
                    <li><i class="fas fa-github"></i> 1047683038</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 SecureNova. All rights reserved.</p>
        </div>
    </footer>'''

# 处理所有HTML文件
for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        filepath = os.path.join(dir_path, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 找到页脚部分并替换
        start_idx = content.find('<footer>')
        end_idx = content.find('</footer>') + len('</footer>')
        
        if start_idx != -1 and end_idx != -1:
            new_content = content[:start_idx] + footer_template + content[end_idx:]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'已修复: {filename}')

print('所有页脚修复完成！')