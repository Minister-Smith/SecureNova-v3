import re

# 读取文件
with open(r'd:\移动硬盘\Learning\1-网安\SecureNova v3\learning-path\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 使用简单的字符串替换
# 将 <div> 替换为 <div class="command-item">
content = content.replace('<div>', '<div class="command-item">')

# 写入文件
with open(r'd:\移动硬盘\Learning\1-网安\SecureNova v3\learning-path\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('替换完成')
