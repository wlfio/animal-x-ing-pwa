import StaticAssets from "./StaticAssets.json";
import WebRequest from "./Services/WebRequest";

(function () {

    class Worker {
        private static instance: Worker | null = null;

        public static readonly CachePrefix = "pwaCache";
        public static readonly CacheName = Worker.CachePrefix + "-v0.0.1";

        public static Factory(): Worker {
            if (Worker.instance === null) {
                Worker.instance = new Worker();
            }
            return Worker.instance;
        }

        private constructor() {
            self.addEventListener("install", async () => await this.install());
            // @ts-ignore
            self.addEventListener("activate", (e: ExtendableEvent) => this.activate(e));
            // @ts-ignore
            self.addEventListener("fetch", async (e: FetchEvent) => await this.onFetch(e));
        }

        public run() {
            console.log("SW BOOT");
            this.updateCheck();
        }

        private activate(e: ExtendableEvent) {
            console.log("SW activate");
            self.clients.claim();
            this.cleanOldCaches(e);
        }

        private cleanOldCaches(e: ExtendableEvent) {
            e.waitUntil(
                caches.keys().then(keys => {
                    return Promise.all(
                        keys
                            .filter(key => key.startsWith(Worker.CachePrefix) && key !== Worker.CacheName)
                            .map(key => caches.delete(key))
                    )
                })
            );
        }

        private updateCheck() {
            WebRequest.get("/")
                .then(() => {
                    this.install();
                })
                .catch(console.error);
        }

        private async install() {
            console.log("install");
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