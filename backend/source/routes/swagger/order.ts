/**
 * @swagger
 * components:
 *   parameters:
 *     OrderByParamter:
 *       in: query
 *       name: order_by
 *       required: false
 *       schema:
 *         type: string
 *         enum: [
 *           name,
 *           release_date,
 *           developer,
 *           publisher,
 *           required_age,
 *         ]
 *       description: The field to sort by.
 *
 *     OrderTypeParameter:
 *       in: query
 *       name: order_type
 *       required: false
 *       schema:
 *         type: string
 *         enum: [asc, desc]
 *       default: asc
 *       description: The type of order, ascending or descending.
 */
