let CACHE_NAME = 'my-site-cache-v1';
let urlsToCache = [
    '../js//app_es5.js',
    'https://nodejs-mongo-persistent-wandelappbackend-v4.a3c1.starter-us-west-1.openshiftapps.com/'
];

// self.addEventListener('install', function (event) {
//     // Perform install steps
//     importScripts('src/serviceworker-cache-polyfill.js');
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then(function (cache) {
//                 console.log('Opened cache');
//                 return cache.addAll(urlsToCache);
//             })
//     );
// });
//
// self.addEventListener('install', function (event) {
//     event.waitUntil(
//         caches.open('demo-cache').then(function (cache) {
//             return cache.put('/', new Response("From the cache!"));
//         })
//     );
// });
//
//
// self.addEventListener('fetch', function (event) {
//
//     console.log(event.request.url);
//
//     event.respondWith(
//         caches.match(event.request).then(function (response) {
//
//             return response || fetch(event.request);
//
//         })
//     );
//
// });


self.addEventListener('fetch', function (event) {

    console.log(event.request.url);

});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                let fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        let responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', function (event) {

    let cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(
                [
                    '/css/cssreset.css',
                    '/css/wandelapp.css',
                    '/js/ractive/ractive.js',
                    '/js/jquery/jquery.js',
                    '/mapbox/mapbox-gl.css',
                    '/mapbox/mapbox-gl.js',
                    '/src/app.js',
                    '/src/cache-polyfill.js',
                    '/src/hickingapp.js',
                    '/src/map.js',
                    '/src/routes.js',
                    '/tests/test_routes.js',
                    'gruntfile.js',
                    'index.html'
                ]
            );
        })
    );
});