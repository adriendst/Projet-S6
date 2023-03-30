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
 *        description: The games that are available for the specified platforms
 */
