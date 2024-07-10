import express from "express";
import checkers from "./index.js";

const app = express();

const getStatusText = status => status
    ? "good"
    : "bad";

app.get("/api/check/website", (_req, res) => {
    const status = checkers.checkWebsite();
    res.status(200)
        .end(getStatusText(status));
});
app.get("/api/check/accounts", (_req, res) => {
    const status = checkers.checkAccounts();
    res.status(200)
        .end(getStatusText(status));
});
app.get("/api/check/conntest", (_req, res) => {
    const status = checkers.checkConntest();
    res.status(200)
        .end(getStatusText(status));
});
app.get("/api/check/juxtweb", (_req, res) => {
    const status = checkers.checkJuxtWeb();
    res.status(200)
        .end(getStatusText(status));
});
app.get("/api/check/juxt", (_req, res) => {
    const status = checkers.checkJuxt();
    res.status(200)
        .end(getStatusText(status));
});

app.use(express.static("html/"));

app.listen(process.env.PORT ?? 8089);