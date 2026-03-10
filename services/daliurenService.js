class DaLiuRenService {
    constructor() {
        this.solarTerms = [
            '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
            '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
            '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
            '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
        ];

        this.heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        this.earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

        this.stars = {
            '子': '神后',
            '丑': '大吉',
            '寅': '功曹',
            '卯': '太冲',
            '辰': '天罡',
            '巳': '太乙',
            '午': '胜光',
            '未': '小吉',
            '申': '传送',
            '酉': '从魁',
            '戌': '河魁',
            '亥': '登明'
        };

        this.gods = {
            '子': '贵人',
            '丑': '天厄',
            '寅': '天权',
            '卯': '天破',
            '辰': '天奸',
            '巳': '天文',
            '午': '天福',
            '未': '天驿',
            '申': '天孤',
            '酉': '天刃',
            '戌': '天艺',
            '亥': '天寿'
        };

        this.generals = {
            '子': '青龙', '丑': '朱雀', '寅': '勾陈', '卯': '腾蛇',
            '辰': '白虎', '巳': '玄武', '午': '太常', '未': '太阴',
            '申': '天后', '酉': '贵人', '戌': '天空', '亥': '太冲'
        };

        this.branchElements = {
            '寅': '木', '卯': '木',
            '巳': '火', '午': '火',
            '辰': '土', '戌': '土', '丑': '土', '未': '土',
            '申': '金', '酉': '金',
            '亥': '水', '子': '水'
        };

        this.hallDirections = {
            '青龙': '东', '朱雀': '南', '白虎': '西', '玄武': '北',
            '勾陈': '中', '腾蛇': '东南', '太常': '西南', '太阴': '西北',
            '天后': '东北', '贵人': '天', '天空': '地', '太冲': '人'
        };

        this.hallMeanings = {
            '东': '新生, начало, утро',
            '南': 'расцвет, полдень, успех',
            '西': 'закат, завершение, урожай',
            '北': 'ночь, покой, хранение',
            '中': 'центр, равновесие, гармония',
            '东南': 'рост, развитие, продвижение',
            '西南': 'зрелость, стабильность, забота',
            '西北': 'мудрость, опыт, авторитет',
            '东北': 'инициатива, новизна, прорыв',
            '天': 'духовность, высшие силы',
            '地': 'материальность, практичность',
            '人': 'отношения, социум, коммуникация'
        };

        this.branchToTrigram = {
            '子': '坎', '丑': '艮', '寅': '艮', '卯': '震',
            '辰': '震', '巳': '巽', '午': '离', '未': '坤',
            '申': '坤', '酉': '兑', '戌': '兑', '亥': '乾'
        };
    }

    calculate(data) {
        try {
            const { year, month, day, hour, question } = data;

            // Проверка входных данных
            if (!year || !month || !day) {
                throw new Error('Необходимо указать год, месяц и день');
            }

            // Расчет основных элементов
            const stemBranch = this.getStemBranch(year, month, day, hour);
            const fourPillars = this.getFourPillars(year, month, day, hour);
            const general = this.getGeneral(stemBranch.hour ? stemBranch.hour.branch : '子');
            const brightHall = this.getBrightHall(general);
            const twelveGongs = this.getTwelveGongs(stemBranch);
            const trigrams = this.getTrigrams(stemBranch);
            const auspiciousness = this.getAuspiciousness(twelveGongs, trigrams);

            return {
                datetime: {
                    year,
                    month,
                    day,
                    hour: hour || 'не указан'
                },
                question: question || 'Общий прогноз',
                stemBranch,
                fourPillars,
                general,
                brightHall,
                twelveGongs,
                trigrams,
                auspiciousness,
                interpretation: this.generateInterpretation(stemBranch, general, brightHall, twelveGongs, trigrams, auspiciousness, question)
            };
        } catch (error) {
            console.error('Ошибка в DaLiuRenService.calculate:', error);
            throw error;
        }
    }

    getStemBranch(year, month, day, hour) {
        // Упрощенный расчет для демонстрации
        const yearStem = this.heavenlyStems[(year - 4) % 10];
        const yearBranch = this.earthlyBranches[(year - 4) % 12];

        const monthStem = this.heavenlyStems[(year * 2 + month) % 10];
        const monthBranch = this.earthlyBranches[(month + 1) % 12];

        const dayStem = this.heavenlyStems[(year + month + day) % 10];
        const dayBranch = this.earthlyBranches[(year + month + day) % 12];

        let hourBranch = '子';
        let hourStem = '甲';
        if (hour && !isNaN(parseInt(hour))) {
            const hourNum = parseInt(hour);
            hourBranch = this.earthlyBranches[Math.floor(hourNum / 2) % 12];
            hourStem = this.heavenlyStems[(this.heavenlyStems.indexOf(dayStem) * 2 + Math.floor(hourNum / 2)) % 10];
        }

        return {
            year: { stem: yearStem, branch: yearBranch, full: yearStem + yearBranch },
            month: { stem: monthStem, branch: monthBranch, full: monthStem + monthBranch },
            day: { stem: dayStem, branch: dayBranch, full: dayStem + dayBranch },
            hour: hour ? { stem: hourStem, branch: hourBranch, full: hourStem + hourBranch } : null
        };
    }

    getFourPillars(year, month, day, hour) {
        const sb = this.getStemBranch(year, month, day, hour);

        return {
            year: sb.year.full,
            month: sb.month.full,
            day: sb.day.full,
            hour: sb.hour ? sb.hour.full : '--'
        };
    }

    getGeneral(hourBranch) {
        return {
            branch: hourBranch,
            name: this.generals[hourBranch] || '未知',
            element: this.getBranchElement(hourBranch)
        };
    }

    getBranchElement(branch) {
        return this.branchElements[branch] || '未知';
    }

    getBrightHall(general) {
        if (!general || !general.name) {
            return {
                direction: '中',
                meaning: 'центр, равновесие, гармония'
            };
        }

        const direction = this.hallDirections[general.name] || '中';
        return {
            direction,
            meaning: this.hallMeanings[direction] || 'нейтрально'
        };
    }

    getTwelveGongs(stemBranch) {
        const gongs = [];

        for (let i = 0; i < 12; i++) {
            const branch = this.earthlyBranches[i];
            const star = this.stars[branch];
            const god = this.gods[branch];

            gongs.push({
                branch,
                star,
                god,
                element: this.getBranchElement(branch),
                position: i + 1
            });
        }

        return gongs;
    }

    getTrigrams(stemBranch) {
        if (!stemBranch || !stemBranch.day || !stemBranch.hour) {
            return { upper: '乾', lower: '坤' };
        }

        const dayBranch = stemBranch.day.branch;
        const hourBranch = stemBranch.hour.branch;

        return {
            upper: this.branchToTrigram[dayBranch] || '乾',
            lower: this.branchToTrigram[hourBranch] || '坤'
        };
    }

    getAuspiciousness(twelveGongs, trigrams) {
        const goodBranches = ['子', '寅', '辰', '午', '申', '戌'];
        const badBranches = ['丑', '卯', '巳', '未', '酉', '亥'];

        const goodCount = twelveGongs.filter(g => goodBranches.includes(g.branch)).length;
        const badCount = twelveGongs.filter(g => badBranches.includes(g.branch)).length;

        let level;
        if (goodCount > badCount * 1.5) level = 'очень благоприятно';
        else if (goodCount > badCount) level = 'благоприятно';
        else if (goodCount === badCount) level = 'нейтрально';
        else if (badCount > goodCount * 1.5) level = 'неблагоприятно';
        else level = 'слегка неблагоприятно';

        return {
            level,
            goodCount,
            badCount,
            advice: this.getAdviceByLevel(level, trigrams)
        };
    }

    getAdviceByLevel(level, trigrams) {
        const advices = {
            'очень благоприятно': 'Время действовать! Все складывается наилучшим образом.',
            'благоприятно': 'Можно действовать, но с осторожностью.',
            'нейтрально': 'Наблюдайте и ждите. Не торопитесь с решениями.',
            'слегка неблагоприятно': 'Лучше отложить важные дела.',
            'неблагоприятно': 'Не действуйте. Время для отдыха и размышлений.'
        };

        return advices[level] || 'Доверьтесь интуиции.';
    }

    // ИСПРАВЛЕННАЯ функция generateInterpretation
    generateInterpretation(stemBranch, general, brightHall, twelveGongs, trigrams, auspiciousness, question) {
        try {
            // Проверяем и подготавливаем все значения с запасными вариантами
            const safeGeneral = general || { branch: '子', name: '青龙', element: '木' };
            const safeBrightHall = brightHall || { direction: '中', meaning: 'центр, равновесие' };
            safeBrightHall.meaning = safeBrightHall.meaning || 'нейтрально';

            const safeTrigrams = trigrams || { upper: '乾', lower: '坤' };
            const safeAuspiciousness = auspiciousness || {
                level: 'нейтрально',
                goodCount: 6,
                badCount: 6,
                advice: 'Доверьтесь интуиции.'
            };

            const hourInfo = stemBranch && stemBranch.hour ? stemBranch.hour : { branch: '子', full: '甲子' };

            return `
🌀 **ДА ЛЮ ЖЭНЬ - ВЕЛИКОЕ ТАЙНОЕ** 🌀

**Ваш вопрос:** "${question || 'Общий прогноз'}"

**ЧЕТЫРЕ СТОЛПА СУДЬБЫ**
${stemBranch ? `Год: ${stemBranch.year?.full || '--'}` : 'Год: --'}
${stemBranch ? `Месяц: ${stemBranch.month?.full || '--'}` : 'Месяц: --'}
${stemBranch ? `День: ${stemBranch.day?.full || '--'}` : 'День: --'}
${stemBranch && stemBranch.hour ? `Час: ${stemBranch.hour.full}` : 'Час: не указан'}

**ГЕНЕРАЛ ЧАСА**
${hourInfo.branch} - ${safeGeneral.name} (стихия ${safeGeneral.element})

**ЗАЛ СВЕТА**
Направление: ${safeBrightHall.direction}
Значение: ${safeBrightHall.meaning}

**ТРИГРАММЫ**
Верхняя: ${safeTrigrams.upper}
Нижняя: ${safeTrigrams.lower}
Соединение: ${safeTrigrams.upper} над ${safeTrigrams.lower}

**ДВЕНАДЦАТЬ ДВОРЦОВ**

${twelveGongs ? twelveGongs.slice(0, 6).map(g => `• ${g.branch} (${g.position}): ${g.star}, бог ${g.god}, стихия ${g.element}`).join('\n') : '• Данные недоступны'}

**БЛАГОПРИЯТНОСТЬ**
Уровень: ${safeAuspiciousness.level}
Совет: ${safeAuspiciousness.advice}

**ТОЛКОВАНИЕ ДЛЯ ВАШЕГО ВОПРОСА**

${this.getDetailedInterpretation(safeTrigrams, safeAuspiciousness, question)}

**СЕКРЕТНЫЙ СОВЕТ**

В Да Лю Жэнь говорят: "Небо даст, если человек готов принять". Сейчас ваша задача — быть открытым знакам судьбы. Внимательно смотрите на то, что происходит вокруг. Синхроничности не случайны.
            `;
        } catch (error) {
            console.error('Ошибка в generateInterpretation:', error);
            return 'Произошла ошибка при формировании толкования. Пожалуйста, попробуйте еще раз.';
        }
    }

    getDetailedInterpretation(trigrams, auspiciousness, question) {
        const interpretations = [
            'Судьба благоволит вам. То, о чем вы спрашиваете, имеет хорошие перспективы. Но помните: удача любит подготовленных.',
            'Ситуация сложная, но разрешимая. Вам нужно проявить гибкость и мудрость. Не действуйте напрямую — ищите обходные пути.',
            'Звезды говорят о необходимости ждать. Сейчас не время для активных действий. Наблюдайте и собирайте информацию.',
            'Ваш вопрос касается важного жизненного выбора. Триграммы указывают на необходимость баланса между сердцем и разумом.',
            'Боги благоприятствуют вашему начинанию. Но не забывайте о благодарности — поделитесь успехом с другими.',
            'В вашем деле есть скрытые препятствия. Будьте внимательны к мелочам — они решают все.',
            'Судьба готовит вам испытание. Оно нужно, чтобы вы стали сильнее. Не бойтесь трудностей.',
            'Время работает на вас. То, что кажется задержкой, на самом деле — защита. Доверьтесь потоку.'
        ];

        const trigramsUpper = trigrams?.upper || '乾';
        const trigramsLower = trigrams?.lower || '坤';
        const goodCount = auspiciousness?.goodCount || 6;

        const index = (trigramsUpper.charCodeAt(0) + trigramsLower.charCodeAt(0) + goodCount) % interpretations.length;
        return interpretations[index] || interpretations[0];
    }
}

module.exports = DaLiuRenService;