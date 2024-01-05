const Utils = {
    getRepoPath(ghRepo: string) {
        const parsedUrl = new URL(ghRepo);
        return parsedUrl.pathname + '/main';
    }
};

export default Utils;