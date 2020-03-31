import WebRequest from "../Services/WebRequest";
import { Sidenav } from "materialize-css";

export default class Nav {
    private sideNavs: Sidenav[] = [];
    private mainContent: HTMLDivElement | null = null;

    public init() {
        const elems = document.querySelectorAll('.sidenav');
        this.sideNavs = M.Sidenav.init(elems);
        this.mainContent = document.querySelector("#main-content");
        this.bind();
        this.navigate();
    }

    private bind() {
        document.querySelectorAll(".sidenav li a")
        document.addEventListener("click", (e: MouseEvent) => {
            let target = e.target;
            while (target instanceof HTMLElement && target.parentElement instanceof HTMLElement) {
                if (target.matches(".sidenav li a, nav div.nav-wrapper a")) {
                    const href = target.getAttribute("href") || "/page/main.html";
                    if (href.length > 5) {
                        e.preventDefault();
                        this.sideNavs.forEach(sideNav => sideNav.close());
                        this.navigate(href);
                    }
                    break;
                }
                target = target.parentElement;
            }
        }, false);
    }

    private navigate(href: string = "/page/main.html") {
        console.log("navigate ", href);
        WebRequest.get(href)
            .then(html => {
                if (this.mainContent) {
                    this.mainContent.innerHTML = html;
                }
            }).catch(console.error);
    }
}