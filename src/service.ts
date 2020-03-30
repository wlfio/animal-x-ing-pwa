import StaticAssets from "./StaticAssets.json";

(function () {

    class Worker {
        private static instance: Worker | null = null;

        public static readonly CacheName = "pwaCache";

        public static Factory(): Worker {
            if (Worker.instance === null) {
                Worker.instance = new Worker();
            }
            return Worker.instance;
        }

        private constructor() {
            self.addEventListener("install", async () => await this.install());
            self.addEventListener("activate", () => this.activate());
            // @ts-ignore
            self.addEventListener("fetch", async (e: FetchEvent) => await this.onFetch(e));
        }

        public run() {

        }

        private activate() {
            self.clients.claim();
        }

        private async install() {
            console.log("INSTALL");
            const cache = await caches.open(Worker.CacheName);
            await cache.addAll(StaticAssets);
            return self.skipWaiting();
        }

        private async onFetch(e: FetchEvent) {
            const req = e.request;
            const url = new URL(req.url);

            if (url.origin === location.origin) {
                e.respondWith(this.cacheFirst(req));
            } else {
                e.respondWith(this.networkAndCache(req));
            }
        }

        private async cacheFirst(req: Request) {
            const cache = await caches.open(Worker.CacheName);
            const cached = await cache.match(req);
            return cached || fetch(req);
        }

        private async networkAndCache(req: Request) {
            const cache = await caches.open(Worker.CacheName);
            try {
                const fresh = await fetch(req);
                await cache.put(req, fresh.clone());
                return fresh;
            } catch (e) {
                const cached = await cache.match(req);
                return cached;
            }
        }
    }

    Worker.Factory().run();

})();