/**
 * @swagger
 * components:
 *   parameters:
 *     StartDateParameter:
 *       in: query
 *       name: start_date
 *       required: false
 *       schema:
 *          type: date
 *          example: 2019-05-17
 *       description: The start of the timespan
 *
 *     EndDateParameter:
 *       in: query
 *       name: end_date
 *       required: false
 *       schema:
 *          type: date
 *          example: 2019-05-17
 *       description: The end of the timespan, if not provided, the start will also be the end
 */
