/**
 * @swagger
 * components:
 *   schemas:
 *     Platform:
 *       type: string
 *       enum: [windows, mac, linux]
 *
 *   parameters:
 *      PlatformParameter:
 *        in: query
 *        name: platforms
 *        required: false
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#components/schemas/Platform'
 *        description: The games that are available for the specified platforms.
 *
 *      PlatformOperatorParameter:
 *        in: query
 *        name: and_platforms
 *        required: false
 *        schema:
 *          type: boolean
 *        description: Boolean to use the 'AND' or the 'OR' operation for the platforms.
 */
