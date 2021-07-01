// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { AuthKind, AuthHandler, DefaultRunnerFactory, RunnerFactory} from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('delete-environment:');
        const pac = factory.getRunner('pac', process.cwd());
        const envId = core.getInput('environment-id', { required: true });
        core.debug('deleting envId: '+ envId);
        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);

        const deleteEnvArgs = ['admin', 'delete', '-id', envId];
        await pac.run(deleteEnvArgs);
        core.info('environment deleted');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
