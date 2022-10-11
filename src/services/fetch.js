export async function fetchChampionList(url) {
    const championsResponse = await fetch(url);
    const champions = (await championsResponse.json()).data;
    return champions;
}

export async function fetchLastVersion(url) {
    const versionResponse = await fetch(url);
    const versions = await versionResponse.json();
    return versions[0];
}