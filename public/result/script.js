const DATA = {
    teams: [
        "기찾레어고대안손", "기필코투어", "김치말이국수", "선린미소녀수집모임",
        "toast", "세른(sern)", "코이코이", "이나경", "ABC 초콜릿",
        "개발자는익을수록허리를숙인다", "4makfox", "SPiCa", "디버깅하기 권법",
        "2026Semicolon", "Coders", "alszi", "Team Neung", "CUBEKO", "PALETTO"
    ],
    results: [
        { id: 3, name: "개발자는익을수록허리를숙인다", fb: "<br>팀 프로젝트에서의 갈등 해결은 간과하기 쉽지만 매우 중요한 부분이라는 점에서, Teamello가 문제 정의와 차별화를 잘 했다는 생각이 들었습니다. 자체적인 완성도나 사용성도 나무랄 데 없어 보입니다. 다만 기획에서의 아쉬움은 조금 있습니다. 갈등이라는 것이 팀 프로젝트를 처음 시작할 때에는 고려하기 힘들지만 과정이 지나갈수록 중요해진다는 점에서, 잠재 사용자들이 어떤 상황에서 Teamello를 찾게 될지 더 고민해보고 설득력을 갖추는 것이 필요해 보입니다." },
        { id: 2, name: "ABC 초콜릿", fb: "<br>청소년 근로에 대해 궁금해하거나 아르바이트를 시작하는 이들에게 TEENS는 하나의 좋은 솔루션이 될 것이라는 생각이 듭니다. 특히 공식 정보를 기반으로 근로계약서를 그 자리에서 작성하거나 계산을 할 수 있게 만들어 둔 것이 직관적으로 신뢰감을 준다는 점이 좋습니다. 수요가 늘 있는 분야라는 점에서 추후 확장 가능성도 충분합니다. 다만 구현한 기능에서 조금 아쉬움을 느꼈었는데, 임금 계산기의 경우 기존 아르바이트 구인구직 플랫폼에도 있는 내용인 것으로 알고 있습니다. 물론 아르바이트 정보 플랫폼이라면 임금 계산기쯤은 갖고 있는 게 좋다는 점에는 공감하지만, 조금 더 청소년 아르바이트에 특화된 서비스를 우선 개발했다면 어땠을까 하는 아쉬움이 들었습니다." },
        { id: 1, name: "PALETTO", fb: "<br>많은 기능들을 구현하셨고, 잘 구현하신 것 같습니다. 서비스가 상당히 완성도 있다는 인상을 받았습니다. 교수자와 학습자 모두 사용할 수 있는 올인원 교육 플랫폼으로서 상당한 완성도와 오랜 고민의 흔적이 느껴집니다. 조금 더 발전시킨다면 현장에서 활용할 수 있을 정도의 완성도를 갖추게 될 것 같습니다." }
    ]
};

let current = 0;
let isLocked = false; 
const slides = document.querySelectorAll('.slide');
const navLayer = document.querySelector('.nav-layer');
const firedSlides = new Set();

function init() {
    // 1. 티커 데이터 생성
    for(let i=1; i<=4; i++) {
        const t = document.getElementById(`ticker-${i}`);
        const shuffled = [...DATA.teams].sort(() => Math.random() - 0.5);
        const content = shuffled.map(n => `<span>${n}</span>`).join('');
        t.innerHTML = content + content + content; // 3배 복제로 끊김 방지
    }

    // 2. 수상 데이터 삽입
    DATA.results.forEach(res => {
        document.getElementById(`name-${res.id}`).textContent = res.name;
        document.getElementById(`fb-${res.id}`).innerHTML = res.fb;
    });

    // 3. 프로그레스 바 생성
    const pb = document.getElementById('progress-bar');
    slides.forEach((_, i) => {
        const bar = document.createElement('div');
        bar.className = 'progress-bar-segment';
        bar.innerHTML = `<div class="progress-fill" id="fill-${i}"></div>`;
        pb.appendChild(bar);
    });

    update();
}

function update() {
    slides.forEach((s, i) => {
        s.classList.toggle('active', i === current);
        document.getElementById(`fill-${i}`).style.width = i <= current ? '100%' : '0%';
    });

    const currentSlideEl = slides[current];
    const overlay = currentSlideEl.querySelector('.announce-overlay');

    // 발표 슬라이드(인덱스 2, 3, 4) 처리
    if (current >= 2 && !firedSlides.has(current)) {
        if (overlay) {
            lockNav(true);
            overlay.classList.add('tension'); // 진동 추가
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
            
            setTimeout(() => {
                overlay.style.transition = 'opacity 0.1s ease-in';
                overlay.style.opacity = '0';
                
                setTimeout(() => { 
                    overlay.style.display = 'none'; 
                    fire(current === 4); // 폭죽 실행
                    firedSlides.add(current);
                    
                    // 폭죽 연출을 위해 0.8초간 추가 잠금
                    setTimeout(() => {
                        lockNav(false);
                    }, 800);
                }, 100);
            }, 2300); // 2.3초간 긴장감 유지
        }
    } else if (overlay) {
        overlay.style.display = 'none';
        lockNav(false);
    }
}

function lockNav(lock) {
    isLocked = lock;
    if (lock) navLayer.classList.add('locked');
    else navLayer.classList.remove('locked');
}

function fire(isGold) {
    const particleCount = isGold ? 220 : 120;
    
    // 폭죽 중력(gravity)을 높여 빠르게 떨어지게 설정
    confetti({
        particleCount: particleCount,
        spread: 85,
        origin: { y: 0.55 },
        colors: isGold ? ['#f9ca24', '#ffffff', '#ff9f43'] : ['#bc13fe', '#08f7fe', '#ffffff'],
        zIndex: 1000,
        gravity: 1.6, // 기본 1.0보다 빠르게 하강
        ticks: 200,
        scalar: isGold ? 1.5 : 1.2
    });
}

// 클릭 이벤트
document.getElementById('next').addEventListener('click', () => { 
    if(!isLocked && current < slides.length - 1) { 
        current++; 
        update(); 
    }
});
document.getElementById('prev').addEventListener('click', () => { 
    if(!isLocked && current > 0) { 
        current--; 
        update(); 
    }
});

// 키보드 지원 (선택사항)
document.addEventListener('keydown', (e) => {
    if(isLocked) return;
    if(e.key === "ArrowRight") document.getElementById('next').click();
    if(e.key === "ArrowLeft") document.getElementById('prev').click();
});

init();
