// Service Worker
//------------------------------------------------------------------------------

'use strict';

// наименование для нашего хранилища кэша
var CACHE_NAME = 'app_serviceworker_v_1',
// ссылки на кэшируемые файлы
	cacheUrls = [
		'/sample/',
		'/sample/js/app.js',
		'/sample/index.html'
];

self.addEventListener('install', function(event) {
	// задержим обработку события
	// если произойдёт ошибка, serviceWorker не установится
	event.waitUntil(
		// находим в глобальном хранилище Cache-объект с нашим именем
		// если такого не существует, то он будет создан
		caches.open(CACHE_NAME).then(function(cache) {
			// загружаем в наш cache необходимые файлы
			return cache.addAll(cacheUrls);
		})
	);
});

self.addEventListener('activate', function(event) {
	// активация
	console.log('activate', event);
});

// период обновления кэша - одни сутки
var MAX_AGE = 86400000;

self.addEventListener('fetch', function(event) {

	event.respondWith(
		// ищем запрошенный ресурс среди закэшированных
		caches.match(event.request).then(function(cachedResponse) {
			var lastModified, fetchRequest;

			// если ресурс есть в кэше
			if (cachedResponse) {
				// получаем дату последнего обновления
				lastModified = new Date(cachedResponse.headers.get('last-modified'));
				// и если мы считаем ресурс устаревшим
				if (lastModified && (Date.now() - lastModified.getTime()) > MAX_AGE) {

					fetchRequest = event.request.clone();
					// создаём новый запрос
					return fetch(fetchRequest).then(function(response) {
						// при неудаче всегда можно выдать ресурс из кэша
						if (!response || response.status !== 200) {
							return cachedResponse;
						}
						// обновляем кэш
						caches.open(CACHE_NAME).then(function(cache) {
							cache.put(event.request, response.clone());
						});
						// возвращаем свежий ресурс
						return response;
					}).catch(function() {
						return cachedResponse;
					});
				}
				return cachedResponse;
			}

			// запрашиваем из сети как обычно
			return fetch(event.request);
		})
	);
});

// // Задаем имя
// var CACHE = 'mahoweek-cache-and-update';

// // Устанавливаем
// self.addEventListener('install', function(event) {
// 	// Кэшируем файлы
// 	event.waitUntil(precache());
// });

// // Настраиваем ответы на запросы
// self.addEventListener('fetch', function(event) {
// 	// Показываем файлы из кэша
// 	event.respondWith(fromCache(event.request));

// 	// Обновляем файлы в кэше
// 	// event.waitUntil(update(event.request));
// });

// // Выбираем файлы для кэширования
// function precache() {
// 	return caches.open(CACHE).then(function(cache) {
// 		return cache.addAll([
// 			'/css/libs.min.css?v=1.13.0',
// 			'/css/main.min.css?v=1.13.0',
// 			'/js/libs.min.js?v=1.13.0',
// 			'/js/app.min.js?v=1.13.0',
// 			'/index.html'
// 		]);
// 	});
// }

// // Выбираем файлы из кэша
// function fromCache(request) {
// 	return caches.open(CACHE).then(function(cache) {
// 		return cache.match(request).then(function(matching) {
// 			// return matching || Promise.reject('no-match');
// 			if (matching) {
// 				return matching;
// 			}

// 			// return fetch(request);
// 		});
// 	});
// }

// // Обновляем файлы в кэше
// function update(request) {
// 	return caches.open(CACHE).then(function(cache) {
// 		return fetch(request).then(function(response) {
// 			return cache.put(request, response);
// 		});
// 	});
// }
