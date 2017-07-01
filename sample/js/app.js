if ('serviceWorker' in navigator) {
	// Регистрируем Сервис-воркер
	navigator.serviceWorker.register('/sample/service-worker.js', {
		scope: '/sample/'
	});
}
