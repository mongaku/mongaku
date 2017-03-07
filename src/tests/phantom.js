// @flow

type Phantom = {
    evaluate: ((selector: string) => *, selector: string) => Promise<*>,
    sendEvent: (eventName: string) => Promise<*>,
};

const utils = (page: Phantom) => ({
    async click(selector: string): Promise<boolean> {
        return await page.evaluate((selector) => {
            const click = document.createEvent("MouseEvent");
            click.initEvent("click", true, true);

            const elem = document.querySelector(selector);

            if (elem) {
                elem.dispatchEvent(click);
                return true;
            }

            return false;
        }, selector);
    },

    async key(selector: string, key: string): Promise<boolean> {
        await page.sendEvent("keypress", key);
        return true;
    },

    async type(selector: string, text: string = ""): Promise<boolean> {
        const keys = text.split("");

        await page.evaluate((selector) => {
            const elem = document.querySelector(selector);
            if (elem) {
                elem.focus();
            }
        }, selector);

        for (const key of keys) {
            await this.key(selector, key);
        }

        return true;
    },
});

/*
const login = (page, email, callback) => {
    request.post({
        url: "http://localhost:3000/login",
        form: {
            email,
            password: "test",
        },
    }, callback);
};

const adminLogin = (callback) =>
    login(request, "test@test.com", callback);
const normalLogin = (callback) =>
    login(request, "normal@test.com", callback);
*/

module.exports = {
    utils,
};
