import fetch from 'node-fetch'

import State from '../status/state.js';

let counter = 0;

export default class Publish  {

    async startJob(paths: string, env: string, accessToken: string, repoPath: string): Promise<string> {

        const options = {
            body: paths,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `${accessToken}`,
            },
            method: 'POST'
        };

        const state = new State();
        const response = await fetch(`https://admin.hlx.page/${env}${repoPath}/*`, options);

        if (response.ok) {
            const data = await response.json();
            const rStatus = JSON.parse(JSON.stringify(data));
            counter++;
            console.log(`JOB: ${counter} - ${rStatus.link.self}`);
            return state.checkStatus(rStatus.link.self, accessToken);
        }

            console.log(`Error: ${response.status} - ${response.statusText}`);
            return response.statusText;

    }

    async testJob(pbody: string, env: string): Promise<{ test: string }> {
        console.log('testJob - 1 sec');
        counter++
        return this.testNested(0);
    }

    async testNested(num:number) {
        console.log(`test nest - ${num}`);
        num++;
        await new Promise(resolve => {setTimeout(resolve, 1000)});
        if (num < 10) {
            await this.testNested(num);
        }

        return { test: `tested: ${counter}` }
    }
}