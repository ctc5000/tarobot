// modules/Numerology/Services/ForecastService.js

const NumerologyService = require('../../../services/numerology');
const TarotService = require('../../../services/tarotService');

class ForecastService {
    constructor() {
        this.numerologyService = new NumerologyService();
        this.tarotService = new TarotService();
    }

    /**
     * Преобразование даты из YYYY-MM-DD в DD.MM.YYYY
     */
    formatDateForCalculation(dateStr) {
        if (!dateStr) return null;
        if (dateStr.includes('.')) return dateStr;
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    /**
     * Редукция числа с сохранением мастер-чисел 11, 22
     */
    reduceNumber(num) {
        if (num === 11 || num === 22) return num;
        while (num > 9) {
            num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }

    /**
     * Расчет универсального числа даты (сумма всех цифр)
     */
    calculateUniversalNumber(targetDate) {
        if (!targetDate) return null;
        const [day, month, year] = targetDate.split('.');
        const sum = parseInt(day) + parseInt(month) + parseInt(year);
        return this.reduceNumber(sum);
    }

    /**
     * Полный расчет чисел дня с учетом персональных данных человека
     */
    calculateDayNumbers(targetDate, personNumbers) {
        if (!targetDate) return null;
        const [day, month, year] = targetDate.split('.');

        // 1. Универсальное число дня
        const universalSum = parseInt(day) + parseInt(month) + parseInt(year);
        const universalNumber = this.reduceNumber(universalSum);

        // 2. Личное число дня (универсальное + число судьбы)
        const personalSum = universalSum + personNumbers.fate;
        const personalNumber = this.reduceNumber(personalSum);

        // 3. Число выражения дня (универсальное + число имени)
        const expressionSum = universalSum + personNumbers.name;
        const expressionNumber = this.reduceNumber(expressionSum);

        // 4. Число рода дня (универсальное + число фамилии)
        const familySum = universalSum + personNumbers.surname;
        const familyNumber = this.reduceNumber(familySum);

        // 5. Число кармы дня (универсальное + число отчества)
        const karmaSum = universalSum + personNumbers.patronymic;
        const karmaNumber = this.reduceNumber(karmaSum);

        // 6. Число ахиллесовой пяты дня (разница между max и min)
        const dayNumbers = [personalNumber, expressionNumber, familyNumber, karmaNumber];
        const achillesNumber = Math.max(...dayNumbers) - Math.min(...dayNumbers);

        // 7. Число управления днем (сумма всех персональных чисел дня)
        const controlSum = personalNumber + expressionNumber + familyNumber + karmaNumber;
        const controlNumber = this.reduceNumber(controlSum);

        return {
            universal: universalNumber,
            personal: personalNumber,
            expression: expressionNumber,
            family: familyNumber,
            karma: karmaNumber,
            achilles: achillesNumber,
            control: controlNumber,
            dayOfMonth: parseInt(day),
            month: parseInt(month),
            year: parseInt(year)
        };
    }

    /**
     * Получение подробного описания для числа дня с учетом персональных данных
     */
    getDayDescription(numbers, personNumbers, targetDate) {
        const { universal, personal, expression, family, karma, achilles, control } = numbers;

        const baseDescriptions = {
            1: {
                name: 'Единица',
                element: 'Огонь',
                planet: 'Солнце',
                keywords: ['Лидерство', 'Инициатива', 'Независимость', 'Сила воли'],
                positive: 'День новых начинаний. Вы полны энергии и решимости. Отлично подходит для активных действий, старта проектов, принятия важных решений.',
                negative: 'Избегайте излишней самоуверенности и конфликтов. Не навязывайте свое мнение другим.',
                career: 'Успех в руководящей деятельности. Хороший день для презентаций и переговоров.',
                love: 'Проявляйте инициативу в отношениях. Для одиноких – отличный день для знакомств.',
                health: 'Высокий энергетический потенциал. Займитесь спортом или активным отдыхом.',
                finance: 'Благоприятный день для финансовых начинаний, инвестиций, крупных покупок.'
            },
            2: {
                name: 'Двойка',
                element: 'Вода',
                planet: 'Луна',
                keywords: ['Дипломатия', 'Сотрудничество', 'Чувствительность', 'Гармония'],
                positive: 'День партнерства и дипломатии. Хорошо для переговоров, совместной работы, укрепления отношений.',
                negative: 'Избегайте нерешительности и излишней эмоциональности. Не позволяйте другим манипулировать вами.',
                career: 'Успех в командной работе. Хороший день для консультаций и поиска компромиссов.',
                love: 'Время для романтики и чувственных разговоров. Укрепите связь с партнером.',
                health: 'Обратите внимание на эмоциональное состояние. Полезны водные процедуры, медитация.',
                finance: 'Избегайте рискованных вложений. Хороший день для консультаций с финансовыми советниками.'
            },
            3: {
                name: 'Тройка',
                element: 'Воздух',
                planet: 'Юпитер',
                keywords: ['Творчество', 'Общение', 'Оптимизм', 'Самовыражение'],
                positive: 'Творческий день. Ваша креативность на высоте. Хорошо для общения, презентаций, самовыражения.',
                negative: 'Избегайте поверхностности и разбросанности. Не распыляйтесь на множество дел.',
                career: 'Успех в творческих профессиях, маркетинге, PR. Хороший день для мозговых штурмов.',
                love: 'Легкость и флирт. Отличный день для свиданий и романтических сюрпризов.',
                health: 'Энергия на подъеме. Займитесь танцами, йогой, творчеством.',
                finance: 'Удачные спонтанные решения. Возможны неожиданные денежные поступления.'
            },
            4: {
                name: 'Четверка',
                element: 'Земля',
                planet: 'Уран',
                keywords: ['Порядок', 'Стабильность', 'Дисциплина', 'Практичность'],
                positive: 'День порядка и структуры. Хорошо для планирования, организации, завершения дел.',
                negative: 'Избегайте ригидности и застоя. Не цепляйтесь за устаревшие методы.',
                career: 'Успех в рутинной работе, бухгалтерии, администрировании. Хороший день для наведения порядка.',
                love: 'Стабильность в отношениях. Хороший день для семейных дел, совместного планирования.',
                health: 'Обратите внимание на опорно-двигательный аппарат. Полезны физические упражнения.',
                finance: 'День накопления и экономии. Хорошее время для планирования бюджета.'
            },
            5: {
                name: 'Пятерка',
                element: 'Воздух',
                planet: 'Меркурий',
                keywords: ['Перемены', 'Свобода', 'Путешествия', 'Авантюры'],
                positive: 'День перемен и новых возможностей. Будьте открыты к спонтанным решениям и приключениям.',
                negative: 'Избегайте безрассудства и непостоянства. Не бросайте начатое на полпути.',
                career: 'Успех в командировках, переговорах, торговле. Хороший день для расширения горизонтов.',
                love: 'Новые знакомства, флирт. Для пар – внесите разнообразие в отношения.',
                health: 'Высокая подвижность. Полезны путешествия, активный отдых, смена обстановки.',
                finance: 'Неожиданные доходы, но и незапланированные траты. Будьте внимательны с деньгами.'
            },
            6: {
                name: 'Шестерка',
                element: 'Земля',
                planet: 'Венера',
                keywords: ['Гармония', 'Семья', 'Забота', 'Ответственность'],
                positive: 'День семьи и гармонии. Хорошо для домашних дел, общения с близкими, благотворительности.',
                negative: 'Избегайте гиперопеки и жертвенности. Не берите на себя чужие проблемы.',
                career: 'Успех в сфере услуг, образования, медицины. Хороший день для помощи коллегам.',
                love: 'Гармония и романтика. Отличный день для семейных ужинов, признаний в любви.',
                health: 'Обратите внимание на питание. Полезны домашняя еда, релаксация, спа-процедуры.',
                finance: 'Траты на семью и дом. Благоприятное время для покупок для близких.'
            },
            7: {
                name: 'Семерка',
                element: 'Вода',
                planet: 'Нептун',
                keywords: ['Анализ', 'Мудрость', 'Духовность', 'Интуиция'],
                positive: 'День анализа и познания. Хорошо для учебы, исследований, медитации, уединения.',
                negative: 'Избегайте изоляции и подозрительности. Не замыкайтесь в себе.',
                career: 'Успех в науке, аналитике, IT. Хороший день для глубоких исследований и размышлений.',
                love: 'Время для глубоких разговоров. Поймите истинные желания партнера.',
                health: 'Обратите внимание на нервную систему. Полезны медитация, тишина, прогулки в одиночестве.',
                finance: 'День анализа финансов. Хорошее время для проверки счетов, планирования инвестиций.'
            },
            8: {
                name: 'Восьмерка',
                element: 'Земля',
                planet: 'Сатурн',
                keywords: ['Власть', 'Успех', 'Изобилие', 'Достижения'],
                positive: 'День успеха и достижений. Хорошо для карьерных вопросов, финансовых операций, важных решений.',
                negative: 'Избегайте властности и меркантильности. Не ставьте деньги выше отношений.',
                career: 'Успех в бизнесе, финансах, управлении. Отличный день для заключения сделок.',
                love: 'Статус и отношения. Хороший день для обсуждения совместных целей и планов.',
                health: 'Обратите внимание на позвоночник и суставы. Полезны умеренные физические нагрузки.',
                finance: 'День больших денег. Удачное время для инвестиций, крупных покупок, финансовых операций.'
            },
            9: {
                name: 'Девятка',
                element: 'Огонь',
                planet: 'Марс',
                keywords: ['Завершение', 'Мудрость', 'Сострадание', 'Трансформация'],
                positive: 'День завершения и отпускания. Хорошо подводить итоги, прощать, освобождаться от лишнего.',
                negative: 'Избегайте фатализма и пессимизма. Не зацикливайтесь на потерях.',
                career: 'Успех в завершении проектов. Хороший день для передачи дел, увольнения, выхода на пенсию.',
                love: 'Время отпустить прошлые отношения. Простите и отпустите обиды.',
                health: 'День очищения. Полезны детокс, голодание, очистительные процедуры.',
                finance: 'Завершение финансовых циклов. Хорошее время для отдачи долгов, закрытия кредитов.'
            },
            11: {
                name: 'Мастер-число 11',
                element: 'Дух',
                planet: 'Прозерпина',
                keywords: ['Интуиция', 'Вдохновение', 'Просветление', 'Духовность'],
                positive: 'День прозрения и интуиции. Прислушивайтесь к знакам и внутреннему голосу.',
                negative: 'Избегайте иллюзий и нервного перенапряжения. Не принимайте поспешных решений.',
                career: 'Успех в творчестве, психологии, эзотерике. Хороший день для инновационных идей.',
                love: 'Духовная связь. Возможны судьбоносные встречи, глубокое понимание партнера.',
                health: 'Обратите внимание на нервную систему. Полезны медитация, дыхательные практики.',
                finance: 'Интуитивные финансовые решения. Доверяйте чутью, но проверяйте факты.'
            },
            22: {
                name: 'Мастер-число 22',
                element: 'Материя',
                planet: 'Вулкан',
                keywords: ['Созидание', 'Масштаб', 'Мастерство', 'Реализация'],
                positive: 'День великих свершений. Ваши идеи сегодня имеют силу воплотиться в реальность.',
                negative: 'Избегайте грандиозных планов без подготовки. Не берите на себя слишком много.',
                career: 'Успех в масштабных проектах, строительстве, организации. Хороший день для долгосрочного планирования.',
                love: 'Создание прочного фундамента отношений. Обсуждайте совместное будущее.',
                health: 'Обратите внимание на опорно-двигательный аппарат. Полезны йога, пилатес.',
                finance: 'Масштабные финансовые решения. Удачное время для крупных инвестиций.'
            }
        };

        const base = baseDescriptions[universal] || {
            name: `Число ${universal}`,
            element: 'Неизвестно',
            planet: 'Неизвестно',
            keywords: ['Анализ', 'Внимание', 'Осознанность'],
            positive: 'День требует внимательности и осознанности. Прислушивайтесь к себе.',
            negative: 'Избегайте поспешных решений. Доверяйте, но проверяйте.',
            career: 'Стандартный рабочий день. Будьте внимательны к деталям.',
            love: 'Обычный день в отношениях. Уделите внимание партнеру.',
            health: 'Следите за самочувствием. Не переутомляйтесь.',
            finance: 'Будьте внимательны с финансами. Избегайте крупных трат.'
        };

        const personalInfluence = this.getPersonalInfluence(personal, personNumbers);
        const expressionMeaning = this.getExpressionMeaning(expression, personNumbers);
        const familyInfluence = this.getFamilyInfluence(family, personNumbers);
        const karmaInfluence = this.getKarmaInfluence(karma, personNumbers);

        return {
            universal: {
                number: universal,
                ...base
            },
            personal: {
                number: personal,
                influence: personalInfluence
            },
            expression: {
                number: expression,
                meaning: expressionMeaning
            },
            family: {
                number: family,
                influence: familyInfluence
            },
            karma: {
                number: karma,
                influence: karmaInfluence
            },
            achilles: {
                number: achilles,
                meaning: this.getAchillesMeaning(achilles, personNumbers)
            },
            control: {
                number: control,
                meaning: this.getControlMeaning(control, personNumbers)
            },
            dateInfo: {
                dayOfMonth: numbers.dayOfMonth,
                month: numbers.month,
                year: numbers.year,
                dayOfWeek: this.getDayOfWeek(targetDate),
                lunarDay: this.getLunarDay(targetDate),
                season: this.getSeason(numbers.month)
            }
        };
    }

    getPersonalInfluence(personalNumber, personNumbers) {
        const influences = {
            1: `Сегодня вы особенно активны и решительны. Ваше число судьбы ${personNumbers.fate} усиливает лидерские качества.`,
            2: `Сегодня важна дипломатия. Ваше число имени ${personNumbers.name} делает вас особенно чувствительным к другим.`,
            3: `Ваша креативность сегодня на пике. Число ${personNumbers.name} вдохновляет на творчество.`,
            4: `Сегодня вы практичны и организованы. Число фамилии ${personNumbers.surname} дает вам структурное мышление.`,
            5: `Ваша жажда перемен сегодня особенно сильна. Число судьбы ${personNumbers.fate} подталкивает к приключениям.`,
            6: `Сегодня вы особенно заботливы. Число ${personNumbers.patronymic} усиливает вашу эмпатию.`,
            7: `Ваш аналитический ум сегодня работает особенно хорошо. Глубина числа ${personNumbers.name} помогает в анализе.`,
            8: `Сегодня вы настроены на успех. Число фамилии ${personNumbers.surname} дает вам силу для достижений.`,
            9: `Сегодня вы склонны к завершению и отпусканию. Число судьбы ${personNumbers.fate} помогает в трансформации.`
        };
        return influences[personalNumber] || `Сегодня ваши личные вибрации числа ${personalNumber} особенно сильны.`;
    }

    getExpressionMeaning(expressionNumber, personNumbers) {
        const meanings = {
            1: `Выражайте себя через лидерство. Ваше имя ${personNumbers.name} дает вам силу для этого.`,
            2: `Выражайте себя через сотрудничество. Число ${personNumbers.patronymic} помогает в дипломатии.`,
            3: `Выражайте себя через творчество. Ваша креативность сегодня на высоте.`,
            4: `Выражайте себя через порядок. Число фамилии ${personNumbers.surname} дает вам структуру.`,
            5: `Выражайте себя через свободу. Ваше число судьбы ${personNumbers.fate} зовет к переменам.`,
            6: `Выражайте себя через заботу. Сегодня вы можете многое дать другим.`,
            7: `Выражайте себя через мудрость. Ваш аналитический ум сегодня особенно остр.`,
            8: `Выражайте себя через достижения. Число ${personNumbers.surname} ведет к успеху.`,
            9: `Выражайте себя через завершение. Число судьбы ${personNumbers.fate} помогает отпускать.`
        };
        return meanings[expressionNumber] || 'Будьте собой';
    }

    getFamilyInfluence(familyNumber, personNumbers) {
        const influences = {
            1: `Родовая энергия сегодня поддерживает ваши начинания. Число фамилии ${personNumbers.surname} дает силу.`,
            2: `Родовые программы сегодня направлены на гармонию в отношениях.`,
            3: `Творческая энергия рода сегодня особенно сильна. Число ${personNumbers.surname} вдохновляет.`,
            4: `Родовая структура помогает вам в организации дел.`,
            5: `Родовые программы подталкивают к переменам и расширению.`,
            6: `Энергия рода сегодня направлена на заботу о семье.`,
            7: `Родовая мудрость помогает в анализе и познании.`,
            8: `Родовые программы ведут к успеху и процветанию.`,
            9: `Родовая энергия помогает завершать циклы и отпускать.`
        };
        return influences[familyNumber] || `Родовая энергия числа ${familyNumber} влияет на ваш день.`;
    }

    getKarmaInfluence(karmaNumber, personNumbers) {
        const influences = {
            1: `Кармические задачи сегодня требуют инициативы. Число отчества ${personNumbers.patronymic} ведет.`,
            2: `Кармические уроки сегодня связаны с отношениями и терпением.`,
            3: `Кармическая задача сегодня — творить и выражать себя.`,
            4: `Кармический долг требует порядка и дисциплины.`,
            5: `Кармические уроки сегодня связаны со свободой и переменами.`,
            6: `Кармическая задача — забота о близких и семье.`,
            7: `Кармический урок — углубление в знания и мудрость.`,
            8: `Кармическая задача — достижение успеха через преодоление.`,
            9: `Кармический урок — отпускание и завершение.`
        };
        return influences[karmaNumber] || `Кармическая энергия числа ${karmaNumber} проявляется сегодня.`;
    }

    getAchillesMeaning(achillesNumber, personNumbers) {
        const meanings = {
            1: `Сегодня ваша уязвимость — в излишней самоуверенности. Будьте внимательны.`,
            2: `Сегодня ваша чувствительность к мнению других может быть уязвимостью.`,
            3: `Сегодня страх быть непонятым может мешать самовыражению.`,
            4: `Сегодня боязнь перемен может создавать напряжение.`,
            5: `Сегодня страх потери свободы может мешать принятию решений.`,
            6: `Сегодня чувство вины может быть вашей уязвимостью.`,
            7: `Сегодня страх неудачи может блокировать действия.`,
            8: `Сегодня непереносимость несправедливости может создавать конфликты.`,
            9: `Сегодня уход в иллюзии может быть защитным механизмом.`
        };
        return meanings[achillesNumber] || `Будьте внимательны к своим слабым сторонам.`;
    }

    getControlMeaning(controlNumber, personNumbers) {
        const meanings = {
            1: `Сегодня управляйте миром через волю и инициативу.`,
            2: `Сегодня ваша сила в терпении и дипломатии.`,
            3: `Сегодня творите реальность через радость и самовыражение.`,
            4: `Сегодня стройте миры через порядок и структуру.`,
            5: `Сегодня будьте ветром перемен и открывайте новые двери.`,
            6: `Сегодня служите и заботьтесь — это ваша суперсила.`,
            7: `Сегодня побеждайте через веру и анализ.`,
            8: `Сегодня восстанавливайте справедливость и баланс.`,
            9: `Сегодня завершайте циклы с мудростью.`
        };
        return meanings[controlNumber] || `Ваша сила сегодня — в числе ${controlNumber}.`;
    }

    getDayOfWeek(targetDate) {
        const [day, month, year] = targetDate.split('.');
        const date = new Date(year, month - 1, day);
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        return days[date.getDay()];
    }

    getLunarDay(targetDate) {
        const [day, month, year] = targetDate.split('.');
        const date = new Date(year, month - 1, day);
        const newMoon = new Date(year, month - 1, 1);
        const diff = Math.floor((date - newMoon) / (24 * 60 * 60 * 1000));
        return (diff % 30) + 1;
    }

    getSeason(month) {
        if (month >= 3 && month <= 5) return 'Весна';
        if (month >= 6 && month <= 8) return 'Лето';
        if (month >= 9 && month <= 11) return 'Осень';
        return 'Зима';
    }

    getColors(number) {
        const colors = {
            1: ['Красный', 'Золотой', 'Оранжевый'],
            2: ['Голубой', 'Серебряный', 'Белый'],
            3: ['Желтый', 'Зеленый', 'Бирюзовый'],
            4: ['Зеленый', 'Коричневый', 'Бежевый'],
            5: ['Бирюзовый', 'Фиолетовый', 'Синий'],
            6: ['Розовый', 'Синий', 'Голубой'],
            7: ['Фиолетовый', 'Индиго', 'Серебряный'],
            8: ['Золотой', 'Коричневый', 'Оранжевый'],
            9: ['Белый', 'Серебряный', 'Красный'],
            11: ['Лавандовый', 'Жемчужный', 'Белый'],
            22: ['Пурпурный', 'Золотой', 'Красный']
        };
        return colors[number] || ['Белый', 'Золотой'];
    }

    getCrystals(number) {
        const crystals = {
            1: ['Горный хрусталь', 'Цитрин'],
            2: ['Лунный камень', 'Жемчуг'],
            3: ['Аметист', 'Аквамарин'],
            4: ['Яшма', 'Оникс'],
            5: ['Бирюза', 'Лазурит'],
            6: ['Розовый кварц', 'Родонит'],
            7: ['Лабрадор', 'Малахит'],
            8: ['Тигровый глаз', 'Гематит'],
            9: ['Авантюрин', 'Сердолик'],
            11: ['Селенит', 'Ангелит'],
            22: ['Пирит', 'Обсидиан']
        };
        return crystals[number] || ['Горный хрусталь', 'Янтарь'];
    }

    getScents(number) {
        const scents = {
            1: ['Кедр', 'Сандал'],
            2: ['Лаванда', 'Роза'],
            3: ['Цитрус', 'Мята'],
            4: ['Пачули', 'Ветивер'],
            5: ['Эвкалипт', 'Лимон'],
            6: ['Иланг-иланг', 'Жасмин'],
            7: ['Ладан', 'Мирра'],
            8: ['Кедр', 'Сосна'],
            9: ['Шалфей', 'Полынь']
        };
        return scents[number] || ['Лаванда', 'Сандал'];
    }

    getFavorableHours(number) {
        const hours = {
            1: ['11:00 - 13:00', '15:00 - 17:00'],
            2: ['09:00 - 11:00', '14:00 - 16:00'],
            3: ['10:00 - 12:00', '16:00 - 18:00'],
            4: ['08:00 - 10:00', '13:00 - 15:00'],
            5: ['11:00 - 13:00', '15:00 - 17:00'],
            6: ['10:00 - 12:00', '17:00 - 19:00'],
            7: ['09:00 - 11:00', '14:00 - 16:00'],
            8: ['11:00 - 13:00', '15:00 - 17:00'],
            9: ['10:00 - 12:00', '16:00 - 18:00']
        };
        return hours[number] || ['11:00 - 13:00', '15:00 - 17:00'];
    }

    getDirections(number) {
        const directions = {
            1: ['Север', 'Восток'],
            2: ['Юго-Запад', 'Запад'],
            3: ['Восток', 'Юго-Восток'],
            4: ['Север', 'Северо-Восток'],
            5: ['Запад', 'Северо-Запад'],
            6: ['Юг', 'Юго-Запад'],
            7: ['Северо-Восток', 'Восток'],
            8: ['Юго-Запад', 'Запад'],
            9: ['Юг', 'Юго-Восток'],
            11: ['Север', 'Восток'],
            22: ['Центр', 'Все направления']
        };
        return directions[number] || ['Восток', 'Север'];
    }

    getTarotForDay(dayNumber, month, personNumbers) {
        try {
            const tarotIndex = (dayNumber + month + personNumbers.fate) % 22;
            const fakeNumbers = {
                fate: tarotIndex === 0 ? 22 : tarotIndex,
                name: personNumbers.name,
                surname: personNumbers.surname,
                patronymic: personNumbers.patronymic
            };
            if (this.tarotService && typeof this.tarotService.calculateFromNumbers === 'function') {
                const tarotResult = this.tarotService.calculateFromNumbers(fakeNumbers);
                return tarotResult.fate || {
                    number: tarotIndex === 0 ? 22 : tarotIndex,
                    name: this.getTarotName(tarotIndex),
                    description: this.getTarotDescription(tarotIndex),
                    advice: this.getTarotAdvice(tarotIndex)
                };
            } else {
                return {
                    number: tarotIndex === 0 ? 22 : tarotIndex,
                    name: this.getTarotName(tarotIndex),
                    description: this.getTarotDescription(tarotIndex),
                    advice: this.getTarotAdvice(tarotIndex)
                };
            }
        } catch (error) {
            console.error('Error getting tarot card:', error);
            return null;
        }
    }

    getTarotName(index) {
        const names = [
            'Шут', 'Маг', 'Верховная Жрица', 'Императрица', 'Император',
            'Иерофант', 'Влюбленные', 'Колесница', 'Сила', 'Отшельник',
            'Колесо Фортуны', 'Справедливость', 'Повешенный', 'Смерть',
            'Умеренность', 'Дьявол', 'Башня', 'Звезда', 'Луна', 'Солнце',
            'Суд', 'Мир'
        ];
        return names[index] || 'Шут';
    }

    getTarotDescription(index) {
        const descriptions = [
            'Новые начала, спонтанность',
            'Сила воли, мастерство',
            'Интуиция, тайна',
            'Плодородие, изобилие',
            'Власть, структура',
            'Традиции, мудрость',
            'Выбор, любовь',
            'Воля, победа',
            'Внутренняя сила',
            'Мудрость, поиск',
            'Циклы, судьба',
            'Равновесие, правда',
            'Жертва, новый взгляд',
            'Трансформация',
            'Баланс, гармония',
            'Зависимость, тень',
            'Разрушение, кризис',
            'Надежда, вдохновение',
            'Иллюзии, интуиция',
            'Радость, успех',
            'Пробуждение',
            'Завершение, целостность'
        ];
        return descriptions[index] || 'Энергия дня';
    }

    getTarotAdvice(index) {
        const advices = [
            'Начинайте новое с открытым сердцем',
            'Действуйте, у вас есть все ресурсы',
            'Доверяйте своей интуиции',
            'Сейте семена желаний',
            'Стройте структуры и системы',
            'Ищите знания в традициях',
            'Слушайте свое сердце',
            'Контролируйте эмоции',
            'Действуйте из любви',
            'Уйдите в себя для поиска ответов',
            'Примите перемены',
            'Будьте честны',
            'Посмотрите с другой стороны',
            'Отпустите прошлое',
            'Ищите баланс',
            'Осознайте свои тени',
            'Не цепляйтесь за рушащееся',
            'Верьте в лучшее',
            'Доверяйте интуиции, но проверяйте',
            'Радуйтесь жизни',
            'Прислушайтесь к внутреннему зову',
            'Празднуйте достижения'
        ];
        return advices[index] || 'Доверяйте процессу';
    }

    getFengShuiAdvice(dayNumber, personNumbers) {
        const advice = {
            1: `Активируйте южный сектор. Используйте красный цвет и свечи. Ваше число судьбы ${personNumbers.fate} усилит эффект.`,
            2: `Активируйте юго-западный сектор. Используйте розовый и парные предметы. Число имени ${personNumbers.name} поможет в гармонизации.`,
            3: `Активируйте восточный сектор. Используйте зеленый цвет и растения. Ваша креативность сегодня на высоте.`,
            4: `Активируйте юго-восточный сектор. Используйте деревянные предметы. Число фамилии ${personNumbers.surname} дает структурность.`,
            5: `Активируйте центр. Используйте желтый цвет и кристаллы. Ваше число судьбы ${personNumbers.fate} зовет к переменам.`,
            6: `Активируйте северо-западный сектор. Используйте металлические предметы. Число отчества ${personNumbers.patronymic} усиливает заботу.`,
            7: `Активируйте западный сектор. Используйте белый цвет и металл. Ваш аналитический ум сегодня особенно остр.`,
            8: `Активируйте северо-восточный сектор. Используйте терракотовый цвет. Число фамилии ${personNumbers.surname} ведет к успеху.`,
            9: `Активируйте северный сектор. Используйте синий цвет и воду. Ваше число судьбы ${personNumbers.fate} помогает отпускать.`
        };
        return advice[dayNumber] || 'Поддерживайте гармонию во всех секторах.';
    }

    getAffirmation(dayNumber, personalNumber, personNumbers, fullName) {
        const firstName = fullName.split(' ')[1] || fullName.split(' ')[0] || '';
        const affirmations = {
            1: `Я, ${firstName}, сегодня лидер своей жизни. Я начинаю новые проекты с уверенностью.`,
            2: `Я, ${firstName}, в гармонии с собой и миром. Я доверяю своей интуиции.`,
            3: `Я, ${firstName}, выражаю себя свободно и радостно. Моя креативность безгранична.`,
            4: `Я, ${firstName}, создаю порядок в своей жизни. Я дисциплинирован и организован.`,
            5: `Я, ${firstName}, открыт новым возможностям. Перемены ведут меня к росту.`,
            6: `Я, ${firstName}, окружен любовью и заботой. Я дарю тепло близким.`,
            7: `Я, ${firstName}, познаю мир и себя. Моя мудрость растет с каждым днем.`,
            8: `Я, ${firstName}, достигаю успеха во всем. Изобилие приходит ко мне легко.`,
            9: `Я, ${firstName}, отпускаю прошлое с благодарностью. Я готов к новому.`,
            11: `Я, ${firstName}, слышу голос своей интуиции. Я на правильном пути.`,
            22: `Я, ${firstName}, воплощаю свои мечты в реальность. Мои возможности безграничны.`
        };
        return affirmations[dayNumber] || `Я, ${firstName}, в гармонии с потоком жизни.`;
    }

    generateInterpretation(fullName, targetDate, dayNumbers, description, tarotCard, personNumbers) {
        const [day, month, year] = targetDate.split('.');
        const dayOfWeek = this.getDayOfWeek(targetDate);
        const firstName = fullName.split(' ')[1] || fullName.split(' ')[0] || '';

        return `
📜 **СВИТОК СУДЬБЫ НА ${day}.${month}.${year} (${dayOfWeek})**

🌟 **ДЛЯ ${fullName.toUpperCase()}**

🔢 **ПЕРСОНАЛЬНЫЙ КОСМИЧЕСКИЙ КОД**
• Ваше число судьбы: ${personNumbers.fate}
• Число имени: ${personNumbers.name}
• Число рода: ${personNumbers.surname}
• Число предков: ${personNumbers.patronymic}

📊 **ЧИСЛА ДНЯ ДЛЯ ${firstName}**
• Универсальное число дня: ${dayNumbers.universal} — ${description.universal.name}
• Ваше личное число дня: ${dayNumbers.personal} — ${description.personal.influence}
• Число выражения: ${dayNumbers.expression} — ${description.expression.meaning}
• Число рода дня: ${dayNumbers.family} — ${description.family.influence}
• Кармическое число дня: ${dayNumbers.karma} — ${description.karma.influence}
• Ахиллесова пята дня: ${dayNumbers.achilles} — ${description.achilles.meaning}
• Число управления днем: ${dayNumbers.control} — ${description.control.meaning}

🌌 **ЭНЕРГЕТИКА ДНЯ ДЛЯ ${firstName}**
Стихия дня: ${description.universal.element}
Планета-покровитель: ${description.universal.planet}
Лунный день: ${description.dateInfo.lunarDay}
Сезон: ${description.dateInfo.season}

${description.universal.positive}

${description.universal.negative ? '⚠️ ' + description.universal.negative : ''}

💼 **КАРЬЕРА И ДЕЛА**
${description.universal.career}

❤️ **ЛЮБОВЬ И ОТНОШЕНИЯ**
${description.universal.love}

🌿 **ЗДОРОВЬЕ И ЭНЕРГИЯ**
${description.universal.health}

💰 **ФИНАНСЫ**
${description.universal.finance}

🎴 **КАРТА ТАРО ДНЯ: ${tarotCard.name}**
${tarotCard.description}
Совет карты специально для вас: ${tarotCard.advice}

✨ **ПЕРСОНАЛЬНАЯ АФФИРМАЦИЯ**
"${this.getAffirmation(dayNumbers.universal, dayNumbers.personal, personNumbers, fullName)}"

🌟 **БЛАГОПРИЯТНЫЕ НАПРАВЛЕНИЯ**
${this.getDirections(dayNumbers.universal).join(', ')}

💎 **КАМНИ-ТАЛИСМАНЫ**
${this.getCrystals(dayNumbers.universal).join(', ')}

🌺 **АРОМАТЫ ДНЯ**
${this.getScents(dayNumbers.universal).join(', ')}

🎨 **ЦВЕТА УДАЧИ**
${this.getColors(dayNumbers.universal).join(', ')}

⏰ **БЛАГОПРИЯТНЫЕ ЧАСЫ**
${this.getFavorableHours(dayNumbers.universal).join(', ')}

🦋 **СОВЕТ НА ДЕНЬ**
Доверяйте своей интуиции и следуйте за энергией дня. Ваша уникальная комбинация чисел (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}) создает особую вибрацию. Используйте ее!
        `;
    }

    generateDeepPortrait(fullName, targetDate, dayNumbers, description, tarotCard, personNumbers) {
        const [day, month, year] = targetDate.split('.');
        const firstName = fullName.split(' ')[1] || fullName.split(' ')[0] || '';

        const getPersonalVibration = (fateNumber, dayNumber, firstName) => {
            const vibrations = {
                '1-1': `${firstName}, сегодня ваша лидерская энергия удвоена. Действуйте смело!`,
                '1-2': `${firstName}, сегодня ваша инициатива должна быть смягчена дипломатией.`,
                '1-3': `${firstName}, ваш творческий потенциал сегодня особенно высок.`,
                '2-1': `${firstName}, сегодня ваша дипломатичность поможет в лидерстве.`,
                '2-2': `${firstName}, сегодня энергия гармонии и сотрудничества на пике.`,
                '3-1': `${firstName}, ваша креативность сегодня может привести к лидерству.`,
                '4-1': `${firstName}, сегодня структура и порядок ведут к успеху.`,
                '5-1': `${firstName}, ваша жажда перемен сегодня особенно сильна.`,
                '6-1': `${firstName}, сегодня забота о других принесет лидерство.`,
                '7-1': `${firstName}, ваш аналитический ум сегодня работает особенно хорошо.`,
                '8-1': `${firstName}, сегодня энергия успеха и достижений на пике.`,
                '9-1': `${firstName}, сегодня завершение циклов открывает новые возможности.`
            };
            const key = `${fateNumber}-${dayNumber}`;
            return vibrations[key] || `${firstName}, сегодня ваши уникальные вибрации создают особые возможности. Прислушайтесь к себе.`;
        };

        const getEnergyLevel = (number) => {
            const levels = {
                1: '⚡⚡⚡⚡⚡ Очень высокий',
                2: '⚡⚡⚡ Средний',
                3: '⚡⚡⚡⚡ Высокий',
                4: '⚡⚡⚡ Средний',
                5: '⚡⚡⚡⚡ Высокий',
                6: '⚡⚡⚡⚡ Гармоничный',
                7: '⚡⚡ Низкий, требует восстановления',
                8: '⚡⚡⚡⚡⚡ Максимальный',
                9: '⚡⚡⚡ Умеренный'
            };
            return levels[number] || '⚡⚡⚡ Средний';
        };

        const getRecommendedPractice = (number, personNumbers) => {
            const practices = {
                1: `Активные упражнения, силовые тренировки. Ваше число ${personNumbers.fate} усиливает энергию.`,
                2: `Йога, медитация, плавание. Число ${personNumbers.name} помогает в гармонизации.`,
                3: `Танцы, творческие практики, пение. Ваша креативность сегодня на пике.`,
                4: `Ходьба, работа в саду, гимнастика. Число ${personNumbers.surname} дает структурность.`,
                5: `Кардио, бег, активные виды спорта. Число ${personNumbers.fate} зовет к движению.`,
                6: `Дыхательные практики, релаксация. Число ${personNumbers.patronymic} усиливает заботу.`,
                7: `Медитация, тишина, прогулки в одиночестве. Ваш аналитический ум сегодня особенно остр.`,
                8: `Силовые тренировки, цигун. Число ${personNumbers.surname} ведет к успеху.`,
                9: `Очистительные практики, детокс. Число ${personNumbers.fate} помогает отпускать.`
            };
            return practices[number] || 'Медитация и легкая растяжка';
        };

        const getPersonalRitual = (number, personNumbers, firstName) => {
            const rituals = {
                1: `${firstName}, зажгите красную свечу и напишите свои цели на день. Ваше число судьбы ${personNumbers.fate} усилит намерение.`,
                2: `${firstName}, помедитируйте 10 минут, представляя розовый свет вокруг сердца. Число имени ${personNumbers.name} поможет в гармонизации.`,
                3: `${firstName}, спойте или потанцуйте под любимую музыку. Ваша креативность сегодня на пике.`,
                4: `${firstName}, наведите порядок на рабочем столе и составьте план. Число фамилии ${personNumbers.surname} даст структурность.`,
                5: `${firstName}, сделайте что-то новое: пройдите другим маршрутом. Число судьбы ${personNumbers.fate} зовет к переменам.`,
                6: `${firstName}, позвоните близким, скажите им теплые слова. Число отчества ${personNumbers.patronymic} усиливает заботу.`,
                7: `${firstName}, побудьте в тишине 15 минут, прислушайтесь к себе. Ваш аналитический ум сегодня особенно остр.`,
                8: `${firstName}, визуализируйте свой успех, представьте себя достигающим целей. Число фамилии ${personNumbers.surname} ведет к успеху.`,
                9: `${firstName}, напишите письмо благодарности прошлому и отпустите его. Число судьбы ${personNumbers.fate} помогает отпускать.`
            };
            return rituals[number] || `${firstName}, зажгите свечу и побудьте в тишине 5 минут.`;
        };

        const getPersonalStarAdvice = (dayNumber, personNumbers, firstName) => {
            const advice = {
                1: `${firstName}, звезды говорят: действуйте! Сейчас лучшее время для начала, особенно с вашим числом судьбы ${personNumbers.fate}.`,
                2: `${firstName}, звезды говорят: доверяйте своей интуиции, она не подведет. Число имени ${personNumbers.name} усиливает чутье.`,
                3: `${firstName}, звезды говорят: выражайте себя, делитесь идеями с миром. Ваша креативность сегодня на пике.`,
                4: `${firstName}, звезды говорят: создавайте порядок, он принесет спокойствие. Число фамилии ${personNumbers.surname} дает структурность.`,
                5: `${firstName}, звезды говорят: будьте открыты переменам, они ведут к росту. Ваше число судьбы ${personNumbers.fate} зовет к приключениям.`,
                6: `${firstName}, звезды говорят: забота о других вернется к вам сторицей. Число отчества ${personNumbers.patronymic} усиливает эмпатию.`,
                7: `${firstName}, звезды говорят: ищите ответы внутри, а не снаружи. Ваш аналитический ум сегодня особенно остр.`,
                8: `${firstName}, звезды говорят: вы на пути к успеху, продолжайте двигаться. Число фамилии ${personNumbers.surname} ведет к достижениям.`,
                9: `${firstName}, звезды говорят: отпустите прошлое, освободите место для нового. Число судьбы ${personNumbers.fate} помогает в трансформации.`
            };
            return advice[dayNumber] || `${firstName}, звезды говорят: будьте в гармонии с собой.`;
        };

        return `
🌌 **ГЛУБИННЫЙ ПОРТРЕТ ДНЯ ${day}.${month}.${year}**

**ДЛЯ: ${fullName}**

🌟 **ВАША УНИКАЛЬНАЯ ВИБРАЦИЯ**
Сегодня ваша задача — войти в резонанс с энергией числа **${dayNumbers.universal}** (${description.universal.name}), 
но через призму ваших личных чисел: судьбы (${personNumbers.fate}), имени (${personNumbers.name}), рода (${personNumbers.surname}) и предков (${personNumbers.patronymic}).

🔮 **ПЕРСОНАЛЬНЫЙ ЭНЕРГЕТИЧЕСКИЙ КОД**
Сочетание вашего числа судьбы ${personNumbers.fate} с числом дня ${dayNumbers.universal} создает уникальную вибрацию:
${getPersonalVibration(personNumbers.fate, dayNumbers.universal, firstName)}

🎴 **ПОСЛАНИЕ ТАРО ЛИЧНО ДЛЯ ВАС**
Карта ${tarotCard.name} призывает вас: "${tarotCard.advice.toLowerCase()}"
Для вас, ${firstName}, это означает: доверяйте своей интуиции.

⚡ **ЭНЕРГЕТИЧЕСКИЙ ПРОГНОЗ**
Сегодня ваш уровень энергии: ${getEnergyLevel(dayNumbers.personal)}
Рекомендуемая практика: ${getRecommendedPractice(dayNumbers.personal, personNumbers)}

🕯️ **ПЕРСОНАЛЬНЫЙ РИТУАЛ**
${getPersonalRitual(dayNumbers.personal, personNumbers, firstName)}

🌟 **ЗВЕЗДНЫЙ СОВЕТ**
${getPersonalStarAdvice(dayNumbers.universal, personNumbers, firstName)}

Помните, ${firstName}: каждый день уникален, и сегодняшний день дает вам особые возможности, 
связанные с вашей уникальной комбинацией чисел. Слушайте свою интуицию, 
следуйте за энергией числа ${dayNumbers.universal} и помните о своей силе числа ${personNumbers.fate}.
        `;
    }

    async calculateForecast(fullName, birthDate, forecastType, targetDate, userId = null) {
        try {
            const nameParts = fullName.trim().split(/\s+/);
            const [surname, firstName, patronymic] = nameParts;

            const formattedBirthDate = this.formatDateForCalculation(birthDate);
            const formattedTargetDate = this.formatDateForCalculation(targetDate);

            const numerology = this.numerologyService.calculate(surname, firstName, patronymic, formattedBirthDate);

            const personNumbers = {
                fate: numerology.base.fate,
                name: numerology.base.name,
                surname: numerology.base.surname,
                patronymic: numerology.base.patronymic
            };

            const dayNumbers = this.calculateDayNumbers(formattedTargetDate, personNumbers);
            const description = this.getDayDescription(dayNumbers, personNumbers, formattedTargetDate);
            const tarotCard = this.getTarotForDay(dayNumbers.universal, dayNumbers.month, personNumbers);
            const fengShuiAdvice = this.getFengShuiAdvice(dayNumbers.universal, personNumbers);
            const affirmation = this.getAffirmation(dayNumbers.universal, dayNumbers.personal, personNumbers, fullName);
            const crystals = this.getCrystals(dayNumbers.universal);
            const scents = this.getScents(dayNumbers.universal);
            const favorableHours = this.getFavorableHours(dayNumbers.universal);
            const interpretation = this.generateInterpretation(fullName, formattedTargetDate, dayNumbers, description, tarotCard, personNumbers);
            const deepPortrait = this.generateDeepPortrait(fullName, formattedTargetDate, dayNumbers, description, tarotCard, personNumbers);

            return {
                success: true,
                data: {
                    fullName,
                    birthDate,
                    targetDate: formattedTargetDate,
                    forecast: {
                        type: 'day',
                        targetDate: formattedTargetDate,
                        numbers: dayNumbers,
                        description: description,
                        tarot: tarotCard,
                        fengShui: {
                            advice: fengShuiAdvice,
                            element: description.universal.element,
                            colors: this.getColors(dayNumbers.universal)
                        },
                        affirmation: affirmation,
                        crystals: crystals,
                        scents: scents,
                        favorableHours: favorableHours,
                        personNumbers: personNumbers
                    },
                    interpretation: interpretation,
                    deepPortrait: deepPortrait
                }
            };
        } catch (error) {
            console.error('Error in calculateForecast:', error);
            throw error;
        }
    }
}

module.exports = ForecastService;