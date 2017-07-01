// Service Worker
//------------------------------------------------------------------------------

'use strict';

// Задаем имя
var CACHE = 'mahoweek-cache-and-update';

// Устанавливаем
self.addEventListener('install', function(event) {
	// Кэшируем файлы
	event.waitUntil(precache());
});

// Настраиваем ответы на запросы
self.addEventListener('fetch', function(event) {
	// Показываем файлы из кэша
	event.respondWith(fromCache(event.request));

	// Обновляем файлы в кэше
	event.waitUntil(update(event.request));
});

// Выбираем файлы для кэширования
function precache() {
	return caches.open(CACHE).then(function(cache) {
		return cache.addAll([
			'/sample/',
			'/sample/js/app.js',
			'/sample/index.html'
		]);
	});
}

// Выбираем файлы из кэша
function fromCache(request) {
	return caches.open(CACHE).then(function(cache) {
		return cache.match(request).then(function(matching) {
			return matching || Promise.reject('no-match');
		});
	});
}

// Обновляем файлы в кэше
function update(request) {
	return caches.open(CACHE).then(function(cache) {
		return fetch(request).then(function(response) {
			return cache.put(request, response);
		});
	});
}
