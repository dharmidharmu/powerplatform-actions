// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, AuthHandler, AuthKind, getWorkingDirectory, PacRunner } from '../../lib';

core.startGroup('bundle-paportal:');
const bundlePath = core.getInput('bundle-path', { required: true });
const outputPath = core.getInput('bundle-output', { required: true });
const deploymentTag = core.getInput('deployment-tag', { required: false });
const split = core.getInput('split-output', { required: false });
core.info(`upload: path:${bundlePath} outputPath:${outputPath} split:${split} deploymentTag: ${deploymentTag} `);

const workingDir = getWorkingDirectory('working-directory', false);

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const pac = new PacRunner(workingDir, logger);
    await new AuthHandler(pac).authenticate(AuthKind.CDS);

    const exportArgs = ['paportal', 'bundle', '--path', bundlePath, '--output', outputPath ];

    if (deploymentTag) { exportArgs.push('--deploymentTag', deploymentTag); }
    if (split) { exportArgs.push('--split', split); }

    await pac.run(exportArgs);
    core.info(`bundle generated in: ${outputPath}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
