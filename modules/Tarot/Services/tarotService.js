// modules/Tarot/Services/TarotService.js

class TarotService {
    constructor() {
        this.spreads = {
            single: {
                name: 'Одна карта',
                positions: ['Ответ'],
                description: 'Быстрый ответ на конкретный вопрос',
                cardCount: 1
            },
            three: {
                name: 'Три карты',
                positions: ['Прошлое', 'Настоящее', 'Будущее'],
                description: 'Анализ ситуации во времени',
                cardCount: 3
            },
            five: {
                name: 'Пять карт',
                positions: ['Ситуация', 'Препятствие', 'Совет', 'Внешнее влияние', 'Итог'],
                description: 'Глубокий анализ ситуации',
                cardCount: 5
            },
            celtic: {
                name: 'Кельтский крест',
                positions: ['Суть вопроса', 'Препятствие', 'Цель', 'Прошлое', 'Будущее', 'Сознание', 'Подсознание', 'Внешнее влияние', 'Надежды и страхи', 'Итог'],
                description: 'Полный анализ ситуации',
                cardCount: 10
            }
        };

        this.questionCategories = {
            'любов': 'love',
            'отношени': 'love',
            'партнер': 'love',
            'брак': 'love',
            'семь': 'family',
            'работ': 'career',
            'бизнес': 'career',
            'карьер': 'career',
            'деньг': 'money',
            'финанс': 'money',
            'заработ': 'money',
            'здоров': 'health',
            'болезн': 'health',
            'самочувств': 'health',
            'развити': 'personal',
            'себ': 'personal',
            'путь': 'personal',
            'предназначени': 'personal'
        };
    }

    /**
     * Метод для гадания
     */
    async performReading(question, spreadType = 'three', cardsMap) {
        try {
            const spread = this.spreads[spreadType] || this.spreads.three;

            if (!cardsMap || Object.keys(cardsMap).length === 0) {
                throw new Error('Карты не загружены');
            }

            // Получаем все карты в виде массива
            const allCards = Object.values(cardsMap);

            // Случайным образом выбираем карты
            const shuffled = [...allCards];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            const selectedCards = shuffled.slice(0, spread.cardCount);

            // Определяем ориентацию для каждой карты (50/50)
            const cards = selectedCards.map((card, index) => {
                const isReversed = Math.random() > 0.5;
                return {
                    id: card.id,
                    number: card.number,
                    name: card.name,
                    nameEn: card.nameEn,
                    image: card.image,
                    position: spread.positions[index],
                    isReversed: isReversed,
                    meaning: isReversed ? card.meaningReversed : card.meaningUpright,
                    description: card.description,
                    advice: card.advice,
                    keywords: card.keywords,
                    element: card.element,
                    planet: card.planet
                };
            });

            const interpretation = this.generateInterpretation(question, spread, cards);

            return {
                success: true,
                data: {
                    question: question,
                    spread: {
                        type: spreadType,
                        name: spread.name,
                        positions: spread.positions,
                        description: spread.description
                    },
                    cards: cards,
                    interpretation: interpretation
                }
            };
        } catch (error) {
            console.error('Ошибка при гадании:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Определяет категорию вопроса
     */
    detectQuestionCategory(question) {
        const lowerQuestion = question.toLowerCase();

        for (const [keyword, category] of Object.entries(this.questionCategories)) {
            if (lowerQuestion.includes(keyword)) {
                return category;
            }
        }
        return 'general';
    }

    /**
     * Генерирует полную интерпретацию расклада
     */
    generateInterpretation(question, spread, cards) {
        const category = this.detectQuestionCategory(question);
        const uprightCount = cards.filter(c => !c.isReversed).length;
        const reversedCount = cards.filter(c => c.isReversed).length;

        let interpretation = `🔮 **РАСКЛАД ТАРО** 🔮\n\n`;
        interpretation += `**Ваш вопрос:** "${question}"\n`;
        interpretation += `**Расклад:** ${spread.name}\n`;
        interpretation += `_${spread.description}_\n\n`;

        interpretation += `**✨ КАРТЫ ВАШЕГО РАСКЛАДА**\n\n`;

        cards.forEach((card, index) => {
            const orientation = card.isReversed ? 'перевернутом' : 'прямом';
            interpretation += `**${index + 1}. ${card.position}** — ${card.name} (${orientation})\n`;
            interpretation += `▸ **Значение:** ${card.meaning}\n`;
            interpretation += `▸ **Описание:** ${card.description}\n`;
            interpretation += `▸ **Совет:** ${card.advice}\n\n`;
        });

        interpretation += `**📊 БАЛАНС ЭНЕРГИЙ**\n\n`;
        interpretation += `В вашем раскладе **${uprightCount}** карт в прямом положении и **${reversedCount}** в перевернутом.\n\n`;

        // Общий совет
        const significantCard = this.findMostSignificantCard(cards);
        interpretation += `**💡 КЛЮЧЕВОЙ СОВЕТ**\n\n`;
        interpretation += `Наиболее значимая карта этого расклада — **${significantCard.name}**. `;
        interpretation += significantCard.advice;

        return interpretation;
    }

    findMostSignificantCard(cards) {
        if (cards.length % 2 === 1) {
            const midIndex = Math.floor(cards.length / 2);
            return cards[midIndex];
        }
        return cards[0];
    }

    /**
     * Расчет карт Таро на основе нумерологических чисел
     */
    calculateFromNumbers(numbers, cardsMap) {
        if (!numbers || typeof numbers !== 'object' || !cardsMap) {
            return this.getFallbackCards(cardsMap);
        }

        const fateNum = numbers.fate || 0;
        const nameNum = numbers.name || 0;
        const surnameNum = numbers.surname || 0;
        const patronymicNum = numbers.patronymic || 0;

        const fateArcana = this.normalizeToArcana(fateNum);
        const nameArcana = this.normalizeToArcana(nameNum);
        const surnameArcana = this.normalizeToArcana(surnameNum);
        const patronymicArcana = this.normalizeToArcana(patronymicNum);

        const getCard = (num) => {
            const normalized = this.normalizeToArcana(num);
            return cardsMap[normalized] || this.getDefaultArcana(normalized);
        };

        return {
            fate: getCard(fateArcana),
            personality: getCard(nameArcana),
            family: getCard(surnameArcana),
            ancestors: getCard(patronymicArcana),
            path: getCard(this.normalizeToArcana(fateNum + nameNum + surnameNum + patronymicNum))
        };
    }

    normalizeToArcana(num) {
        if (num === 22) return 0;
        if (num >= 0 && num <= 21) return num;

        let reduced = num;
        while (reduced > 22) {
            reduced = String(reduced).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return reduced === 22 ? 0 : reduced;
    }

    getDefaultArcana(num) {
        return {
            number: num,
            name: `Аркан ${num === 0 ? 22 : num}`,
            image: '/images/tarot/back.jpg',
            keywords: 'Тайна, ожидающая раскрытия',
            meaningUpright: 'Глубокий смысл, требующий осмысления',
            meaningReversed: 'Скрытые аспекты, которые предстоит открыть',
            description: `Число ${num === 0 ? 22 : num} несет в себе уникальную энергию, которую предстоит расшифровать лично вам.`,
            advice: `Исследуйте значение числа ${num === 0 ? 22 : num} в своей жизни.`
        };
    }

    getFallbackCards(cardsMap) {
        return {
            fate: cardsMap[0] || this.getDefaultArcana(0),
            personality: cardsMap[1] || this.getDefaultArcana(1),
            family: cardsMap[2] || this.getDefaultArcana(2),
            ancestors: cardsMap[3] || this.getDefaultArcana(3),
            path: cardsMap[4] || this.getDefaultArcana(4)
        };
    }
}

module.exports = TarotService;