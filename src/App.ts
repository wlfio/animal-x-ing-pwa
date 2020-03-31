import WebRequest from "./Services/WebRequest";
import Nav from "./Components/Nav";

export default class App {

    private nav: Nav;

    public static Factory(): App {
        return new App();
    }

    constructor() {
        this.nav = new Nav();
    }

    public run() {
        window.addEventListener("load", () => this.onLoad());
        this.registerServiceWorker();
    }

    private onLoad() {
        console.log("Page Load");
        this.showStored();
        this.bindUI();
        this.nav.init();
    }

    private showStored() {
        const text = localStorage.getItem("TEXT");
        const div = document.querySelector("#text-dsiplay");
        if (div instanceof HTMLDivElement) {
            div.textContent = text || "NOT SET RAW";
        }
    }

    private bindUI() {
        const elem = document.querySelector("button");
        if (elem instanceof HTMLButtonElement) {
            elem.addEventListener("click", () => this.getData());
        }
    }

    private getData() {
        WebRequest.get("/data/fish.json")
            .then(c => {
                const text = prompt(JSON.stringify(c));
                localStorage.setItem("TEXT", text || "NOT SET SAVE");
            });
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