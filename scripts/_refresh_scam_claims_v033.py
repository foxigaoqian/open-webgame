from pathlib import Path

replacements = {
    'examples/scam-artist-site/index.html': [
        ('upgrades, automation and beginner tips.', 'upgrades, Scam Society research and beginner tips.'),
        ('"gamePlatform":["Web browser","Windows","Linux"]', '"gamePlatform":["Web browser","Windows"]'),
        ('Add rooms, unlock new systems, automate collection, and push deeper into the prototype\'s progression.', 'Add rooms, improve the apartment, and push into Scam Society research to unlock more elaborate ways of scamming customers.'),
        ('<h3>Push toward automation</h3><p>The current prototype includes automated money collection systems that reduce repetitive clicking later in a run.</p>', '<h3>Use Scam Society research</h3><p>Trade the required documents for research points when Scam Society opens up, then use that progression to unlock more elaborate scams.</p>'),
        ('<li>Money collection automation.</li>', '<li>Different customer scam structures.</li>'),
        ('<p>No for the browser prototype. Windows and Linux builds also exist for players who prefer desktop play.</p>', '<p>No for the browser prototype. The Steam version is currently coming soon and lists Windows system requirements.</p>'),
    ],
    'examples/scam-artist-site/ja/index.html': [
        ('アップグレード、自動化、初心者向けのコツ', 'アップグレード、Scam Societyの研究、初心者向けのコツ'),
        ('"gamePlatform":["Web browser","Windows","Linux"]', '"gamePlatform":["Web browser","Windows"]'),
        ('部屋を増やし、新しい仕組みを解放し、収益回収を自動化しながら、さらに深い進行へ進みます。', '部屋を増やして改装を進め、Scam Societyの研究ポイントを使って、さらに手の込んだ詐欺の仕組みを解放していきます。'),
        ('<h3>自動化を目指す</h3><p>現在のプロトタイプには収益回収の自動化要素があり、後半の反復操作を減らしやすくなります。</p>', '<h3>Scam Societyの研究を進める</h3><p>Scam Societyが開放されたら、必要な書類を研究ポイントに交換し、より手の込んだ詐欺の仕組みを解放していきましょう。</p>'),
        ('<li>収益回収の自動化。</li>', '<li>さまざまな詐欺設備。</li>'),
        ('<p>ブラウザ版を遊ぶだけなら不要です。デスクトップ向けにはWindows版とLinux版もあります。</p>', '<p>ブラウザ版プロトタイプを遊ぶだけなら不要です。Steam版は現在「近日登場」で、Windowsのシステム要件が掲載されています。</p>'),
    ],
    'examples/scam-artist-site/ko/index.html': [
        ('업그레이드, 자동화, 초보자 팁', '업그레이드, Scam Society 연구, 초보자 팁'),
        ('"gamePlatform":["Web browser","Windows","Linux"]', '"gamePlatform":["Web browser","Windows"]'),
        ('방을 늘리고 새 시스템을 해금하며 수익 회수를 자동화해 더 깊은 진행으로 나아가세요.', '방을 확장하고 리노베이션을 진행한 뒤 Scam Society 연구 포인트를 활용해 더 정교한 사기 수단을 해금하세요.'),
        ('<h3>자동화를 목표로 하세요</h3><p>현재 프로토타입에는 돈 수집 자동화 시스템이 있어 진행 후반의 반복 클릭을 줄이는 데 도움이 됩니다.</p>', '<h3>Scam Society 연구를 활용하세요</h3><p>Scam Society가 열리면 필요한 문서를 연구 포인트로 교환하고, 그 진행을 통해 더 정교한 사기 수단을 해금하세요.</p>'),
        ('<li>수익 수집 자동화.</li>', '<li>다양한 사기 시설.</li>'),
        ('<p>브라우저 프로토타입을 플레이하는 데는 필요하지 않습니다. 데스크톱 이용자를 위한 Windows와 Linux 빌드도 있습니다.</p>', '<p>브라우저 프로토타입을 플레이하는 데는 필요하지 않습니다. Steam 버전은 현재 출시 예정으로 표시되며 Windows 시스템 요구 사항이 안내되어 있습니다.</p>'),
    ],
}

for filename, pairs in replacements.items():
    path = Path(filename)
    text = path.read_text(encoding='utf-8')
    for old, new in pairs:
        if old not in text:
            raise SystemExit(f'missing expected text in {filename}: {old[:80]}')
        text = text.replace(old, new, 1)
    path.write_text(text, encoding='utf-8')
    print('updated', filename)
