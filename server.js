import express from "express";
import checkers from "./index.js";
import nodecallspython from "node-calls-python";

const app = express();
const py = nodecallspython;
py.addImportPath("PretendoClients");
const pymodule = py.importSync("./status.py");

const min = 5;

let {
    DEVICE_ID,
    SERIAL_NUMBER,
    SYSTEM_VERSION,
    REGION_ID,
    COUNTRY_ID,
    REGION_NAME,
    COUNTRY_NAME,
    LANGUAGE,
    USERNAME,
    PASSWORD,
    CERT
} = process.env;
DEVICE_ID = parseInt(DEVICE_ID);
SYSTEM_VERSION = parseInt(SYSTEM_VERSION, 16);
REGION_ID = parseInt(REGION_ID);

const args = [
    DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
    REGION_ID, COUNTRY_ID, REGION_NAME,
    COUNTRY_NAME, LANGUAGE, USERNAME,
    PASSWORD, CERT
];

/** @type {Record<string, boolean>} */
const status = {
    "website": false,
    "accounts": false,
    "conntest": false,
    "juxtweb": false,
    "juxt": false,
    "friends": false,
    "splatoon": false,
    "mk8": false,
    "smm": false,
};

const checkAll = async () => {
    if(process.env.DISABLE_CHECKING) return;
    status.website = await checkers.checkWebsite();
    status.accounts = await checkers.checkAccounts();
    status.conntest = await checkers.checkConntest();
    status.juxtweb = await checkers.checkJuxtWeb();
    status.juxt = await checkers.checkJuxt();

    status.friends = await py.call(pymodule, "friends", ...args);
    status.splatoon = await py.call(pymodule, "splatoon", ...args);
    status.mk8 = await py.call(pymodule, "mk8", ...args);
    status.smm = await py.call(pymodule, "smm", ...args);
};

checkAll();
setInterval(checkAll, min * 60 * 1000);

const getStatusText = status => status
    ? "good"
    : "bad";

app.get("/api/check/:service", (req, res) => {
    const { service } = req.params;
    if(!(service in status)) return res.status(404).end("not found");
    res.status(200)
        .end(getStatusText(status[service]));
});

app.use(express.static("html/"));

app.listen(process.env.PORT ?? 8089);
