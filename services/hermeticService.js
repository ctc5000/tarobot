class HermeticService {
    constructor() {
        this.principles = [
            {
                number: 1,
                name: 'Ментализм',
                latin: 'The ALL is Mind',
                description: 'Всё есть Мысль. Вселенная представляет собой мысленный образ.',
                teaching: 'Все, что вы видите в материальном мире, сначала существовало как мысль. Ваша реальность — отражение ваших убеждений.',
                application: 'Осознайте силу своих мыслей. То, во что вы верите, становится вашей реальностью.',
                affirmation: 'Я — творец своей реальности. Мои мысли формируют мой мир.'
            },
            {
                number: 2,
                name: 'Соответствие',
                latin: 'As above, so below',
                description: 'Что наверху, то и внизу. Что внутри, то и снаружи.',
                teaching: 'Законы, действующие на одном уровне реальности, действуют и на всех других уровнях. Микрокосм повторяет макрокосм.',
                application: 'Изучая себя, вы познаете Вселенную. Изменяя себя, вы меняете мир вокруг.',
                affirmation: 'Я — отражение Вселенной. Во мне, как в капле, отражается весь океан бытия.'
            },
            {
                number: 3,
                name: 'Вибрация',
                latin: 'Nothing rests; everything moves; everything vibrates.',
                description: 'Ничто не покоится, всё движется, всё вибрирует.',
                teaching: 'Разница между материей, энергией и духом — только в частоте вибрации. Всё суть энергия.',
                application: 'Меняя свою вибрацию через мысли, эмоции, действия, вы притягиваете соответствующие события.',
                affirmation: 'Я настраиваю свою вибрацию на гармонию и любовь.'
            },
            {
                number: 4,
                name: 'Полярность',
                latin: 'Everything is dual; everything has poles; everything has its pair of opposites.',
                description: 'Всё двойственно, всё имеет полюса, всё имеет свою противоположность.',
                teaching: 'Противоположности — это две крайности одного и того же. Жара и холод — градусы температуры. Любовь и ненависть — градусы чувства.',
                application: 'Чтобы изменить негативное, не боритесь с ним — просто повышайте его "градус" до позитивного.',
                affirmation: 'Я принимаю единство противоположностей. Всё есть одно.'
            },
            {
                number: 5,
                name: 'Ритм',
                latin: 'Everything flows, out and in; everything has its tides; all things rise and fall.',
                description: 'Всё течёт, всё втекает и вытекает; всё имеет свои приливы и отливы.',
                teaching: 'Всё в природе подчиняется ритму: день сменяет ночь, прилив — отлив, вдох — выдох. За подъемом следует спад.',
                application: 'В трудные времена помните, что за спадом последует подъем. Не цепляйтесь за пики — они временны.',
                affirmation: 'Я теку в ритме Вселенной. Я принимаю циклы жизни.'
            },
            {
                number: 6,
                name: 'Причина и следствие',
                latin: 'Every Cause has its Effect; every Effect has its Cause.',
                description: 'Каждое следствие имеет свою причину, каждая причина — своё следствие.',
                teaching: 'Случайностей не существует. Всё происходит по закону. То, что вы называете "удачей" — результат ранее приложенных усилий.',
                application: 'Чтобы изменить следствия в своей жизни, найдите и измените их причины.',
                affirmation: 'Я — причина своей жизни. Я создаю следствия, которые выбираю.'
            },
            {
                number: 7,
                name: 'Пол',
                latin: 'Gender is in everything; everything has its Masculine and Feminine Principles.',
                description: 'Пол во всём; всё имеет мужское и женское начало.',
                teaching: 'Творение возможно только через союз противоположностей. В каждом мужчине есть женское начало, в каждой женщине — мужское.',
                application: 'Развивайте в себе оба начала: активность и восприимчивость, силу и гибкость, действие и принятие.',
                affirmation: 'Я объединяю в себе мужское и женское в совершенной гармонии.'
            }
        ];
    }

    calculate(data) {
        const { principleNumber, question, birthDate } = data;

        let principle;
        if (principleNumber && principleNumber >= 1 && principleNumber <= 7) {
            principle = this.principles[principleNumber - 1];
        } else {
            // Если принцип не указан, выбираем на основе даты
            const day = birthDate ? parseInt(birthDate.split('.')[0]) : new Date().getDate();
            principle = this.principles[(day % 7)];
        }

        // Определяем текущий ритм (упрощенно)
        const rhythm = this.getCurrentRhythm();

        // Анализ полярностей для вопроса
        const polarity = this.analyzePolarity(question, principle);

        // Причинно-следственные связи
        const causality = this.analyzeCausality(question, principle);

        return {
            principle: {
                number: principle.number,
                name: principle.name,
                latin: principle.latin,
                description: principle.description,
                teaching: principle.teaching,
                application: principle.application,
                affirmation: principle.affirmation
            },
            rhythm,
            polarity,
            causality,
            interpretation: this.generateInterpretation(principle, rhythm, polarity, causality, question)
        };
    }

    getCurrentRhythm() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDate();
        const month = now.getMonth() + 1;

        // Определяем фазу ритма
        let phase;
        if (hour < 6) phase = 'ночь — время покоя и внутренней работы';
        else if (hour < 12) phase = 'утро — время начинаний и активности';
        else if (hour < 18) phase = 'день — время реализации и достижений';
        else phase = 'вечер — время подведения итогов и отдыха';

        // Определяем направление ритма
        const direction = (day % 2 === 0) ? 'восходящий' : 'нисходящий';

        return {
            phase,
            direction,
            advice: direction === 'восходящий'
                ? 'Сейчас благоприятное время для начинаний. Энергия растет.'
                : 'Сейчас время завершать и отпускать. Новая энергия придет после паузы.'
        };
    }

    analyzePolarity(question, principle) {
        if (!question) {
            return {
                thesis: 'Ваш текущий полюс',
                antithesis: 'Противоположный полюс',
                synthesis: 'Путь к балансу'
            };
        }

        // Анализируем вопрос на полярности (упрощенно)
        const polarities = [
            { thesis: 'действие', antithesis: 'покой', synthesis: 'осознанное действие' },
            { thesis: 'дать', antithesis: 'взять', synthesis: 'равноценный обмен' },
            { thesis: 'контроль', antithesis: 'доверие', synthesis: 'гибкое управление' },
            { thesis: 'знание', antithesis: 'вера', synthesis: 'мудрость' },
            { thesis: 'индивидуальность', antithesis: 'единство', synthesis: 'гармоничные отношения' }
        ];

        const polarity = polarities[question.length % polarities.length];

        return {
            thesis: polarity.thesis,
            antithesis: polarity.antithesis,
            synthesis: polarity.synthesis,
            explanation: `В вашем вопросе присутствует напряжение между ${polarity.thesis} и ${polarity.antithesis}. Истина в их единстве — ${polarity.synthesis}.`
        };
    }

    analyzeCausality(question, principle) {
        if (!question) {
            return {
                visibleCause: 'То, что вы видите',
                hiddenCause: 'То, что скрыто',
                effect: 'Результат'
            };
        }

        // Упрощенный анализ
        const causes = [
            { visible: 'внешние обстоятельства', hidden: 'внутренние убеждения', effect: 'изменение реальности' },
            { visible: 'действия других', hidden: 'ваши ожидания', effect: 'отношения' },
            { visible: 'прошлый опыт', hidden: 'интерпретация опыта', effect: 'будущие возможности' },
            { visible: 'материальные условия', hidden: 'духовные ценности', effect: 'качество жизни' }
        ];

        const cause = causes[question.length % causes.length];

        return {
            visibleCause: cause.visible,
            hiddenCause: cause.hidden,
            effect: cause.effect,
            explanation: `Видимая причина — ${cause.visible}. Но истинная причина — ${cause.hidden}. Изменив это, вы измените ${cause.effect}.`
        };
    }

    generateInterpretation(principle, rhythm, polarity, causality, question) {
        return `
⚜️ **СЕМЬ ГЕРМЕТИЧЕСКИХ ПРИНЦИПОВ** ⚜️

**Избранный принцип: ${principle.number}. ${principle.name}**
*${principle.latin}*

${principle.description}

**УЧЕНИЕ**
${principle.teaching}

**ПРИМЕНЕНИЕ В ЖИЗНИ**
${principle.application}

**АФФИРМАЦИЯ**
*"${principle.affirmation}"*

**ТЕКУЩИЙ РИТМ**
${rhythm.phase}
Направление: ${rhythm.direction}
${rhythm.advice}

**ПОЛЯРНОСТЬ В ВАШЕМ ВОПРОСЕ**
${polarity.explanation || 'Осознайте единство противоположностей в вашей ситуации.'}

**ПРИЧИНА И СЛЕДСТВИЕ**
${causality.explanation || 'Всё, что происходит в вашей жизни, имеет причину. Найдите её.'}

**СОВЕТ ГЕРМЕТИЗМА**

*"Познай самого себя, и ты познаешь Вселенную и богов."*

Принцип ${principle.name} сейчас особенно важен для вас. ${principle.application}

${question ? `В вашем вопросе о "${question}" ключевым является понимание того, что ${principle.number === 1 ? 'реальность начинается с мысли' :
            principle.number === 2 ? 'внутреннее отражается во внешнем' :
                principle.number === 3 ? 'всё есть вибрация' :
                    principle.number === 4 ? 'противоположности едины' :
                        principle.number === 5 ? 'всё подчиняется ритму' :
                            principle.number === 6 ? 'вы — причина своей жизни' :
                                'баланс мужского и женского'} .` : ''}

**МЕДИТАЦИЯ ДНЯ**

Закройте глаза. Сделайте глубокий вдох. Представьте, что вы — центр Вселенной. Вокруг вас вращаются миры, но вы неподвижны. Вы — наблюдатель. Вы — свидетель. Вы — чистое сознание. И в этом сознании рождается истина: *${principle.affirmation}*
        `;
    }
}

module.exports = HermeticService;