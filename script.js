// Navegação suave
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Highlight da navegação baseado na seção atual
    function updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Atualizar navegação no scroll
    window.addEventListener('scroll', updateActiveNav);

    // Animação de entrada para os cards da timeline
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos da timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Observar cards de informação
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        observer.observe(item);
    });

    // Efeito parallax suave no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const decorations = document.querySelectorAll('.decoration-circle');
            decorations.forEach((decoration, index) => {
                const speed = 0.5 + (index * 0.1);
                decoration.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });

    // Expandir/contrair detalhes dos cards (funcionalidade futura)
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevenir expansão se clicar em links ou botões
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            // Adicionar classe para destacar card selecionado
            dayCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Adicionar estilos para card selecionado
    const style = document.createElement('style');
    style.textContent = `
        .day-card.selected {
            border: 2px solid #6366f1;
            box-shadow: 0 20px 60px rgba(99, 102, 241, 0.2);
        }
        
        .nav-link.active {
            color: #6366f1;
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);

    // Contador animado para datas (efeito visual)
    function animateCounters() {
        const markers = document.querySelectorAll('.day-number');
        
        markers.forEach(marker => {
            const finalNumber = parseInt(marker.textContent);
            let currentNumber = 0;
            const increment = finalNumber / 20;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    currentNumber = finalNumber;
                    clearInterval(timer);
                }
                marker.textContent = Math.floor(currentNumber).toString().padStart(2, '0');
            }, 50);
        });
    }

    // Iniciar animação dos contadores quando a seção da agenda for visível
    const agendaSection = document.querySelector('.agenda');
    const agendaObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                agendaObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    agendaObserver.observe(agendaSection);

    // Adicionar efeito de hover nos activity-items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(5px)';
        });
    });

    // Função para destacar horários atuais (se for durante a semana pedagógica)
    function highlightCurrentTime() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = domingo, 1 = segunda, etc.
        
        // Verificar se é durante a semana pedagógica (7-11 de julho)
        const currentMonth = now.getMonth(); // 6 = julho (0-indexed)
        const currentDate = now.getDate();
        
        if (currentMonth === 6 && currentDate >= 7 && currentDate <= 11) {
            const dayIndex = currentDate - 7; // 0-4 para segunda-sexta
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            if (timelineItems[dayIndex]) {
                timelineItems[dayIndex].classList.add('current-day');
                
                // Destacar horário atual
                const activities = timelineItems[dayIndex].querySelectorAll('.activity-item');
                activities.forEach(activity => {
                    const timeText = activity.querySelector('.time').textContent;
                    const timeMatch = timeText.match(/(\d+)h/);
                    
                    if (timeMatch) {
                        const activityHour = parseInt(timeMatch[1]);
                        if (currentHour >= activityHour && currentHour < activityHour + 2) {
                            activity.classList.add('current-activity');
                        }
                    }
                });
            }
        }
    }

    // Adicionar estilos para destacar dia/horário atual
    const currentStyle = document.createElement('style');
    currentStyle.textContent = `
        .timeline-item.current-day .timeline-marker {
            animation: pulse 2s infinite;
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
        }
        
        .activity-item.current-activity {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border-left-color: #ffffff;
        }
        
        .activity-item.current-activity .time,
        .activity-item.current-activity .content i {
            color: #ffffff;
        }
        
        @keyframes pulse {
            0% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.1); }
            100% { transform: translateX(-50%) scale(1); }
        }
    `;
    document.head.appendChild(currentStyle);

    // Executar função de destaque
    highlightCurrentTime();

    // Atualizar a cada minuto
    setInterval(highlightCurrentTime, 60000);

    console.log('🎓 Site da Semana Pedagógica Amadeus carregado com sucesso!');
});

