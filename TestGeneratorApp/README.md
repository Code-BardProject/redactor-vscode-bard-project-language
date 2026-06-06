# TestGeneratorApp

Автогенерированный проект TestGeneratorApp.

## Запуск сервера

	npm install
	npm start

## Пример отправки почты

Сервер поддерживает POST-запрос на `/api/send-email`.
Требуются поля JSON: `to`, `subject`, `text`.

Можно задать параметры SMTP через `.env`:

	SMTP_HOST=smtp.example.com
	SMTP_PORT=587
	SMTP_USER=user@example.com
	SMTP_PASS=secret
	SMTP_FROM=no-reply@example.com
