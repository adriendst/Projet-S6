/**
 * @swagger
 * components:
 *   parameters:
 *     SearchTextParameter:
 *       in: query
 *       name: searchText
 *       required: true
 *       schema:
 *         type: string
 *       example: "Val"
 *       description: The string to auto-complete
 *
 *     ResultsParameter:
 *       in: query
 *       name: results
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 50
 *         default: 20
 *       description: The numbers of items to return.
 *
 *     PageParameter:
 *       in: path
 *       name: page
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         default: 1
 *       description: The numbers of items to return.
 *
 *     OrderTypeParameter:
 *       in: query
 *       name: order_type
 *       required: false
 *       schema:
 *         type: string
 *         enum: [asc, desc]
 *       default: asc
 *       description: The numbers of items to return.
 */
