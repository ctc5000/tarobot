#!/bin/bash

# Проверяем, передано ли имя модуля
if [ -z "$1" ]; then
    echo "❌ Ошибка: Не указано имя модуля."
    echo "Использование: $0 <ИмяМодуля>"
    echo "Пример: $0 Astropsychology"
    exit 1
fi

# 1. Получаем имя модуля
MODULE_NAME=$1

# 2. Создаем версию в нижнем регистре для файлов (css, js)
MODULE_LOWER=$(echo "$MODULE_NAME" | tr '[:upper:]' '[:lower:]')

# 3. Основной путь
BASE_PATH="modules/${MODULE_NAME}"

# 4. Проверяем, не существует ли уже такой модуль
if [ -d "$BASE_PATH" ]; then
    echo "❌ Ошибка: Модуль '$MODULE_NAME' уже существует в папке $BASE_PATH"
    exit 1
fi

echo "🚀 Создание модуля: $MODULE_NAME..."

# 5. Создаем директорию структуру
mkdir -p "${BASE_PATH}/Controllers"
mkdir -p "${BASE_PATH}/Services"
mkdir -p "${BASE_PATH}/Migrations"      # Папка есть, файлы не создаем
mkdir -p "${BASE_PATH}/Models"          # Папка есть, файлы не создаем
mkdir -p "${BASE_PATH}/web/css"
mkdir -p "${BASE_PATH}/web/js"

# 6. Создаем файлы
# Controllers
touch "${BASE_PATH}/Controllers/${MODULE_NAME}View.js"

# Services
touch "${BASE_PATH}/Services/${MODULE_NAME}Service.js"

# Web assets
touch "${BASE_PATH}/web/index.html"
touch "${BASE_PATH}/web/css/${MODULE_LOWER}.css"
touch "${BASE_PATH}/web/js/${MODULE_LOWER}.js"

# Корневые файлы модуля
touch "${BASE_PATH}/${MODULE_NAME}.init.js"
touch "${BASE_PATH}/${MODULE_NAME}.route.js"

# description.json (создаем с валидным JSON содержимым)
echo "{
  \"name\": \"${MODULE_NAME}\",
  \"version\": \"1.0.0\",
  \"description\": \"Module description\"
}" > "${BASE_PATH}/description.json"

echo "✅ Модуль '$MODULE_NAME' успешно создан по пути: $BASE_PATH"