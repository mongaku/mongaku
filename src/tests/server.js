const init = require("./init");
const {mockFS} = init;

init.init((err) => {
    if (err) {
        console.error(err);
    } else {
        mockFS(() => {
            console.log("STARTED");
            const cron = require("../server/cron");
            cron.start();
        });
    }
});
