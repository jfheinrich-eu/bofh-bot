
export type bofhExcuse = {
    id: number,
    quote: string,
    source: string,
    date: string,
}

export async function bofhApiCall(): Promise<bofhExcuse[] | undefined> {
    const url = 'https://bofh-api.bombeck.io/v1/excuses/random/';
    try {
        const res = await fetch(url);
        const data = await res.json();

        return (data as bofhExcuse[]);
    } catch (err) {
        console.error(err);
    }
}
