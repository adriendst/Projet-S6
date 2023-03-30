/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: string
 *       enum: [
 *         Accounting,
 *         Action,
 *         Adventure,
 *         Animation & Modeling,
 *         Audio Production,
 *         Casual,
 *         Design & Illustration,
 *         Documentary,
 *         Early Access,
 *         Education,
 *         Free to Play,
 *         Game Development,
 *         Gore,
 *         Indie,
 *         Massively Multiplayer,
 *         Nudity,
 *         Photo Editing,
 *         Racing,
 *         RPG,
 *         Sexual Content,
 *         Simulation,
 *         Software Training,
 *         Sports,
 *         Strategy,
 *         Tutorial,
 *         Utilities,
 *         Video Production,
 *         Violent,
 *         Web Publishing
 *       ]
 *
 *   parameters:
 *      GenreParameter:
 *        in: query
 *        name: genres
 *        required: false
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#components/schemas/Genre'
 *        description: The genres to filter by.
 */
