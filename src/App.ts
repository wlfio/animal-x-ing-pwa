export default class App {
    public static Factory(): App {
        return new App();
    }

    constructor() { }

    public run() {
        window.addEventListener("load", this.onLoad);
        this.registerServiceWorker();
    }

    private onLoad() {
        console.log("Page Load");
    }

    private registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                navigator.serviceWorker.register("./serviceWorker.bundle.js");
            } catch (e) {
                console.log("Service Worker Registration Failed!", e);
            }
        } else {
            console.log("Cannot register service worker, Not present");
        }
    }
}