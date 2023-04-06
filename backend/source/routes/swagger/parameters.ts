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
 *     PathSearchTextParameter:
 *       in: path
 *       name: searchText
 *       required: false
 *       schema:
 *         type: string
 *       example: "Count"
 *       description: The string to auto-complete
 *
 *     SearchTextParameter:
 *       in: query
 *       name: searchText
 *       required: false
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
 *     UserLibraryParameter:
 *       in: query
 *       name: user_only
 *       required: false
 *       schema:
 *         type: boolean
 *         default: false
 *       description: To filter only games that the user has in his library.
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
