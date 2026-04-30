import re

# 读取文件
with open(r'd:\移动硬盘\Learning\1-网安\SecureNova v3\learning-path\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到所有 knowledge-card 块
cards = re.findall(r'<div class="knowledge-card">([\s\S]*?)</div>', content)

missing_class = 0
for i, card in enumerate(cards):
    # 找到所有没有 class 属性的 div
    divs = re.findall(r'<div(?!\s+class=)', card)
    if divs:
        missing_class += len(divs)
        print(f'知识卡片 {i+1} 中有 {len(divs)} 个 div 缺少 class 属性')

if missing_class == 0:
    print('所有知识卡片内的 div 都已添加 class 属性！')
else:
    print(f'发现 {missing_class} 个 div 缺少 class 属性')
