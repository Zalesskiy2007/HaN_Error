/*
 * General utils for managing cookies in Typescript.
 */
export function setCookie(thisName: string, val: string) {
    const date = new Date();
    const value = val;

    // Set it expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = thisName+"="+value+"; expires="+date.toUTCString()+"; path=/";
}

export let noneValue = "-1";
export let name = "HANSessionId";

export function getCookie(thisName: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + thisName + "=");
    
    if (parts !== undefined && parts.length == 2) {
        let x = parts.pop();
        if (x !== undefined) {
            let a = x.split(";").shift();
            if (a === undefined) return noneValue;
            else return a;
        } else {
            return noneValue;
        }
    } else {
        return noneValue;
    }
}

/*export function deleteCookie(name: string) {
    const date = new Date();

    // Set it expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
} */

export function deleteCookie(thisName: string) {
    setCookie(thisName, noneValue);
}