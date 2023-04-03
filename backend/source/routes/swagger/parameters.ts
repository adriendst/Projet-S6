/**
 * @swagger
 * components:
 *   parameters:
 *     PageParameter:
 *       in: path
 *       name: page
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         default: 1
 *       description: The page to return.
 *
 *     SearchTextParameter:
 *       in: query
 *       name: searchText
 *       required: true
 *       schema:
 *         type: string
 *       example: "Val"
 *       description: The string to auto-complete
 *
 *     NameParameter:
 *       in: query
 *       name: name
 *       required: false
 *       schema:
 *         type: string
 *       example: "Val"
 *       description: A string/name to filter the games by
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
 */
