export default class WebRequest {

    private static queryParams(params: { [s: string]: any }): string {
        return Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
    }

    public static addQueryParamsToUrl(url: string, params: { [s: string]: any }): string {
        return url + (url.indexOf('?') === -1 ? '?' : '&') + WebRequest.queryParams(params);
    };

    private static requestResponseCast(response: Response): any {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            try {
                return response.json();
            } catch (e) {

            }
        }
        return response.text();
    }

    private static fetch(url: string, params?: { [s: string]: any }): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(url, params)
                .then(WebRequest.successCheck)
                .then(WebRequest.requestResponseCast)
                .then(resolve)
                .catch(reject);
        });
    }

    public static get(url: string) {
        return WebRequest.fetch(url);
    }

    private static generic(url: string, method: string = "GET", body: string = "", headers: { [s: string]: any } = {}) {
        return WebRequest.fetch(url, { method: method, body: body, headers: headers })
    }

    private static methodGeneric(url: string, method: string, body: string | { [s: string]: any } = "", json: boolean = false) {
        return WebRequest.generic(
            url,
            method,
            (typeof body === "string" ? body : (json ? JSON.stringify(body) : WebRequest.queryParams(body))),
            { 'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded' }
        );
    }

    public static post(url: string, body: string | { [s: string]: any } = "", json: boolean = false) {
        return WebRequest.methodGeneric(url, "POST", body, json);
    }

    public static delete(url: string, body: string | { [s: string]: any } = "", json: boolean = false) {
        return WebRequest.methodGeneric(url, "DELETE", body, json);
    }

    private static successCheck(response: Response): any {
        if (response.status >= 400) {
            throw response;
        }
        return response;
    }
}