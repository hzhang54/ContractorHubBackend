import { CDKContext } from '../cdk.context'
import * as cdk from 'aws-cdk-lib'
import * as gitBranch from 'git-branch'

// Get the current git branch
const getCurrentBranch = (): string => {
	const currentBranch = gitBranch.sync()
	return currentBranch
}

// Get the environment context based on the current git branch
const getEnvironmentContext = (app: cdk.App) => {
	const currentBranch = getCurrentBranch()
	const environments = app.node.tryGetContext('environments')
	const environment = environments.find(
		(env: any) => env.branchName === currentBranch
	)
	const globals = app.node.tryGetContext('globals')

	return { ...globals, ...environment }
}

// Initialize the stack
export const initStack = () => {
	const app = new cdk.App()
	const context = getEnvironmentContext(app) as CDKContext
	const stackName = `${context.appName}-stack-${context.environment}`

	// tag resources in AWS to find the easier
	const tags = {
		Environment: context.environment,
		AppName: `${context.appName}`,
	}

	// Provide required properties to our Stack
	const stackProps: cdk.StackProps = {
		env: {
			region: context.region,
		},
		stackName: stackName,
		description: context.appDescription,
		tags,
	}

	return {
		app,
		stackNameWithEnv: stackName,
		stackProps,
		context,
	}
}
