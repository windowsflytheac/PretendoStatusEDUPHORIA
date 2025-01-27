function update(){
    for(const checkEl of document.querySelectorAll(".check")) {
        (async () => {
            const { service } = checkEl.dataset;
            const f = await fetch(`/api/check/${service}`);
            const t = await f.text();
            const [status, last] = t.split("\n");
            if(status == "good"){
                checkEl.classList.remove("bad");
                checkEl.classList.add("good");
            }
            else if(status == "bad"){
                checkEl.classList.remove("good");
                checkEl.classList.add("bad");
            }
            checkEl.innerText = last;
        })();
    }
}
update();
setInterval(update, 300000); //Refresh every 5 minutes