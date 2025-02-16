/**
 * Checks the website availability.
 * 
 * @returns {Promise<boolean>} Whether the website is available.
 */
const checkWebsite = () => new Promise(async resolve => {
    const f = await fetch("https://pretendo.network/").catch(() => resolve(false));
    resolve(f && ((f.status >= 200 && f.status <= 399) || f.status == 403)); // Protected with Cloudflare so just getting a response is sufficient
});
/**
 * Checks the forum availability.
 *
 * @returns {Promise<boolean>} Whether the forum is available.
 */
const checkForum = () => new Promise(async resolve => {
    const f = await fetch("https://forum.pretendo.network/").catch(() => resolve(false));
    resolve(f && ((f.status >= 200 && f.status <= 399) || f.status == 403)); // Protected with Cloudflare so just getting a response is sufficient
});

/**
 * Checks the account service availability.
 * 
 * @returns {Promise<boolean>} Whether the account service is available.
 */
const checkAccounts = () => new Promise(async resolve => {
    // Checking the PN_Jemma's Mii
    const f = await fetch("http://account.pretendo.cc/v1/api/miis?pids=1599718445", {
        "headers": {
            "X-Nintendo-Client-ID": "a2efa818a34fa16b8afbc8a74eba3eda",
            "X-Nintendo-Client-Secret": "c91cdb5658bd4954ade78533a339cf9a"
        }
    }).catch(() => resolve(false));
    resolve(f && f.status >= 200 && f.status <= 399);
});
/**
 * Checks the account service availability.
 *
 * @returns {Promise<boolean>} Whether the account service is available.
 */
const checkSpr = () => new Promise(async resolve => {
    // Checking the PN_Jemma's Mii
    const f = await fetch("https://service.spr.app.pretendo.cc/relay/0", {
        "headers": {
            "X-Nintendo-Client-ID": "a2efa818a34fa16b8afbc8a74eba3eda",
            "X-Nintendo-Client-Secret": "c91cdb5658bd4954ade78533a339cf9a"
        }
    }).catch(() => resolve(false));
    resolve(f && f.status >= 200 && f.status <= 399);
});

/**
 * Checks the connection test service availability.
 * 
 * @returns {Promise<boolean>} Whether the account service is available.
 */
const checkConntest = () => new Promise(async resolve => {
    const f = await fetch("http://conntest.pretendo.cc").catch(() => resolve(false));
    resolve(f && f.status >= 200 && f.status <= 399);
});

/**
 * Checks the Juxt website availability.
 * 
 * @returns {Promise<boolean>} Whether the Juxt website is available.
 */
const checkJuxtWeb = () => new Promise(async resolve => {
    const f = await fetch("https://juxt.pretendo.network/").catch(() => resolve(false));
    resolve(f && ((f.status >= 200 && f.status <= 399) || f.status == 403)); // Protected with Cloudflare so just getting a response is sufficient
});
/**
 * Checks the Juxt-Beta website availability.
 *
 * @returns {Promise<boolean>} Whether the Juxt website is available.
 */
const checkJuxtWebBeta = () => new Promise(async resolve => {
    const f = await fetch("https://juxt-beta.pretendo.network/").catch(() => resolve(false));
    resolve(f && ((f.status >= 200 && f.status <= 399) || f.status == 403)); // Protected with Cloudflare so just getting a response is sufficient
});

/**
 * Checks the Juxt (Miiverse) service availability.
 * 
 * @returns {Promise<boolean>} Whether the Juxt service is available.
 */
const checkJuxt = () => new Promise(async resolve => {
    const f = await fetch("http://api.olv.pretendo.cc/v1/status").catch(() => resolve(false));
    resolve(f && f.status >= 200 && f.status <= 399);
});

export default {
    checkWebsite,
    checkForum,
    checkAccounts,
    checkConntest,
    checkJuxtWeb,
    checkJuxtWebBeta,
    checkJuxt
};