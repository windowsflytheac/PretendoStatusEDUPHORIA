for(const checkEl of document.querySelectorAll(".check")) {
    (async () => {
        const { service } = checkEl.dataset;
        const f = await fetch(`/api/check/${service}`);
        const t = await f.text();
        if(t == "good")
            checkEl.classList.add("good");
        else if(t == "bad")
            checkEl.classList.add("bad");
    })();
}