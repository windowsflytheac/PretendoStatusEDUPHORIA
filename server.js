import express from "express";
import checkers from "./index.js";
import nodecallspython from "node-calls-python";
import fs from "fs";

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
if(!fs.existsSync("recent.json"))
    fs.writeFileSync("recent.json", JSON.stringify({
        "website": [new Date(0), new Date(0)],
        "accounts": [new Date(0), new Date(0)],
        "conntest": [new Date(0), new Date(0)],
        "juxtweb": [new Date(0), new Date(0)],
        "juxt": [new Date(0), new Date(0)],
        "friends": [new Date(0), new Date(0)],
        "splatoon": [new Date(0), new Date(0)],
        "mk8": [new Date(0), new Date(0)],
        "smm": [new Date(0), new Date(0)],
    }));
/** @type {Record<string, [Date, Date]>} */
const last = JSON.parse(fs.readFileSync("recent.json", "utf-8"));

const checkOne = async (name, res) => {
    if(!status[name]) {
        last[name] = [new Date(), new Date(0)];
    } else if(Number(last[name][1]) == 0) {
        last[name][1] = new Date();
    }
    status[name] = res;
};

const checkAll = async () => {
    if(process.env.DISABLE_CHECKING) return;
    await checkOne("website", await checkers.checkWebsite());
    await checkOne("accounts", await checkers.checkAccounts());
    await checkOne("conntest", await checkers.checkConntest());
    await checkOne("juxtweb", await checkers.checkJuxtWeb());
    await checkOne("juxt", await checkers.checkJuxt());

    await checkOne("friends", await py.call(pymodule, "friends", ...args));
    await checkOne("splatoon", await py.call(pymodule, "splatoon", ...args));
    await checkOne("mk8", await py.call(pymodule, "mk8", ...args));
    await checkOne("smm", await py.call(pymodule, "smm", ...args));
    
    fs.writeFileSync("recent.json", JSON.stringify(last));
};

checkAll();
setInterval(checkAll, min * 60 * 1000);

const getStatusText = status => status
    ? "good"
    : "bad";
const getDateText = last => Number(last[0]) == 0
    ? "unknown"
    : Number(last[1]) == 0
    ? `since ${last[0].toUTCString()}`
    : `last down ${last[0].toUTCString()} through ${last[1].toUTCString()}`

app.get("/api/check/:service", (req, res) => {
    const { service } = req.params;
    if(!(service in status)) return res.status(404).end("not found");
    res.status(200)
        .end(getStatusText(status[service]));
});

app.use(express.static("html/"));

app.listen(process.env.PORT ?? 8089);
