import {
	AppSyncIdentityCognito,
	Context,
	DynamoDBUpdateItemRequest,
	util,
} from '@aws-appsync/utils'
import { Recipe, UpdateRecipeMutationVariables } from '../API'

export function request(
	ctx: Context<UpdateRecipeMutationVariables>
): DynamoDBUpdateItemRequest {
	const { id, ...values } = ctx.args.input
	const identity = ctx.identity as AppSyncIdentityCognito

	// Use UpdateItem instead of PutItem to avoid condition issues
	return {
		operation: 'UpdateItem',
		key: util.dynamodb.toMapValues({ id }),
		update: {
			expression: 'SET #title = :title, #description = :description, #servings = :servings, #ingredientsText = :ingredientsText, #stepsText = :stepsText, #coverImage = :coverImage, #updatedAt = :updatedAt',
			expressionNames: {
				'#title': 'title',
				'#description': 'description',
				'#servings': 'servings',
				'#ingredientsText': 'ingredientsText',
				'#stepsText': 'stepsText',
				'#coverImage': 'coverImage',
				'#updatedAt': 'updatedAt'
			},
			expressionValues: util.dynamodb.toMapValues({
				':title': values.title,
				':description': values.description,
				':servings': values.servings,
				':ingredientsText': values.ingredientsText,
				':stepsText': values.stepsText,
				':coverImage': values.coverImage,
				':updatedAt': util.time.nowISO8601()
			})
		}
	}
}

export function response(ctx: Context) {
	return ctx.result as Recipe
}