for(const checkEl of document.querySelectorAll(".check")) {
    (async () => {
        const { service } = checkEl.dataset;
        const f = await fetch(`/api/check/${service}`);
        const t = await f.text();
        const [status, last] = t.split("\n");
        if(status == "good")
            checkEl.classList.add("good");
        else if(status == "bad")
            checkEl.classList.add("bad");
    })();
}