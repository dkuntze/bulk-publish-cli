import {Args, Command, Flags, ux} from '@oclif/core';
import * as csv from "csv-parser";
import * as fse from "fs";
import * as path from 'node:path'
import stripBomStream from "strip-bom-stream";

import Publish from './publish.js';

const results: string[] = [];

function changeExtensionToJSON(filePath: string): string {
    let parsedPath = path.parse(filePath);
    parsedPath.ext = '.json';
    parsedPath.base = `${parsedPath.name}${parsedPath.ext}`;
    return path.format(parsedPath);
}

export default class Preview extends Command {

    static args = {
        csv: Args.string({description: 'csv list of files to activate', required: true})
    }

    static flags = {
        force: Flags.boolean({char: 'f', default: false, description: 'Force update', required: false}),
        write: Flags.boolean({char: 'w', default: false, description: 'Write JSON file', required: false}),
    }

    async run(): Promise<any> {
        let accessToken: string;
        const {args, flags} = await this.parse(Preview);
        fse.readFile(path.join(this.config.configDir, '/config.json'), 'utf8', (error, data) => {
            const userConfig = JSON.parse(data);
            accessToken = userConfig.token;
        });

        ux.action.start('Parsing CSV');
        fse.createReadStream(args.csv)
            .pipe(stripBomStream())
            .pipe(csv.default(['path']))
            .on('data', (data: { path: string; }) => {
                results.push(data.path.replace('https://www.revolt.tv','').replace(/\/+$/,''));
            })
            .on('end', async () => {
                results.shift(); // get rid of the "Path" header at the beginning
                const paths = {
                    'forceUpdate': flags.force,
                    'paths': results.slice(1040, 2180)
                }

                ux.action.stop();

                const MAX_BLOCK_SIZE = 3500;
                const NUM_BLOCKS = Math.round(results.length / MAX_BLOCK_SIZE);

                let BLOCKS = [];

                if (results.length > MAX_BLOCK_SIZE) {
                    for (let i = 0; i < NUM_BLOCKS; i++) {
                        if ((i + 1) ===  NUM_BLOCKS) {
                            // this is for the last iteration
                            BLOCKS.push(results.slice(i * MAX_BLOCK_SIZE, results.length));
                            // console.log(`${i * MAX_BLOCK_SIZE}, ${results.length}`);
                        } else {
                            BLOCKS.push(results.slice(i * MAX_BLOCK_SIZE, (i + 1) * MAX_BLOCK_SIZE));
                            // console.log(`${i * MAX_BLOCK_SIZE}, ${(i + 1) * MAX_BLOCK_SIZE}`);
                        }
                    }
                } else {
                    BLOCKS.push(results);
                }

                // for testing - shorten the array
                BLOCKS = BLOCKS.slice(0, 2);


                for await (const element of BLOCKS) {
                    let stopNow = false;
                    const publish = new Publish();
                    const payload = {
                        'forceUpdate': flags.force,
                        'paths': element
                    }

                    // const runNum = await publish.testJob(JSON.stringify(payload), 'preview');
                    // console.log(runNum);
                    const jobStatus = await publish.startJob(JSON.stringify(payload), 'preview', accessToken);
                    console.log(jobStatus);
                    if (jobStatus ==='Unauthorized') {
                        break;
                    }
                }


                if (flags.write) {
                    // await this.startJob(JSON.stringify(paths, null, 4));
                    ux.action.start('Writing JSON');

                    fse.writeFile(changeExtensionToJSON(args.csv), JSON.stringify(paths, null, 4), (error) => {
                        if (error) {
                            this.log(error.message);
                            throw error;
                        }

                        ux.action.stop();
                    })
                }
            });
    }


}