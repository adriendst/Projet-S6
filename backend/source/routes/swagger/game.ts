/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         appid:
 *           type: string
 *           description: The id of the game
 *         name:
 *           type: string
 *           description: The name of the game
 *         release_date:
 *           type: date
 *           format: YYYY-MM-dd
 *           description: The release-date of the game
 *         english:
 *           type: boolean
 *           description: Boolean if the game is in english or not
 *         developer:
 *           type: string
 *           description: The name of the developer of the game
 *         publisher:
 *           type: string
 *           description: The name of the publisher of the game
 *         platforms:
 *           type: array
 *           items:
 *             $ref: '#components/schemas/Platform'
 *           description: The platforms on which the game is available on
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#components/schemas/Category'
 *           description: The categories that the game corresponds to
 *         genres:
 *           type: array
 *           items:
 *             $ref: '#components/schemas/Genre'
 *           description: The genres that the game corresponds to
 *         required_age:
 *           type: integer
 *           description: The minimum required age to be allowed to play the game
 *         steamspy_tags:
 *           type: array
 *           items:
 *             type: string
 *           description: The steamspy-tags that the game corresponds to
 *         achievements:
 *           type: integer
 *           description: The number of achivements that are in the game
 *         positive_ratings:
 *           type: integer
 *           description: The number of positive ratings of the game
 *         negative_ratings:
 *           type: integer
 *           description: The number of negative ratings of the game
 *         average_playtime:
 *           type: integer
 *           description: The average playtime of the game
 *         median_playtime:
 *           type: integer
 *           description: The median playtime of the game
 *         owners:
 *           type: string
 *           description: The range of number of owners of the game
 *         price:
 *           type: number
 *           description: The price of the game
 *       required:
 *         - appid
 *         - name
 *         - release_date
 *         - english
 *         - developer
 *         - publisher
 *         - platforms
 *         - categories
 *         - genres
 *         - required_age
 *         - steamspy_tags
 *         - achievements
 *         - positive_ratings
 *         - negative_ratings
 *         - average_playtime
 *         - median_playtime
 *         - owners
 *         - price
 *       example:
 *         appid: 10
 *         name: Counter-Strike
 *         release_date: 2000-11-01
 *         english: true
 *         developer: Valve
 *         publisher: Valve
 *         platforms:
 *           - windows
 *           - mac
 *           - linux
 *         required_age: 0
 *         categories:
 *           - Multi-player
 *           - Online Multi-Player
 *           - Local Multi-Player
 *           - Valve Anti-Cheat enabled
 *         genres:
 *           - Action
 *         steamspy_tags:
 *           - Action
 *           - FPS
 *           - Multiplayer
 *         achievements: 0
 *         positive_ratings: 124534
 *         negative_ratings: 3339
 *         average_playtime: 17612
 *         median_playtime: 317
 *         owners: 10000000-20000000
 *         price: 7.19
 *
 *     DetailedGame:
 *       allOf:
 *         - $ref: '#/components/schemas/Game'
 *         - type: object
 *           properties:
 *             detailed_description:
 *               type: string
 *               description: A detailed description of the game
 *             about_the_game:
 *               type: string
 *               description: An about text of the game
 *             short_description:
 *               type: string
 *               description: A short description of the game
 *             header_image:
 *               type: string
 *               description: The header image of the game
 *             screenshots:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Screenshot'
 *               description: A list of screenshots of the game
 *             background:
 *               type: string
 *               description: A image that can be used as a background of the game
 *
 */
