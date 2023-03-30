/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: string
 *       enum: [
 *         Captions available,
 *         Co-op,
 *         Commentary available,
 *         Cross-Platform Multiplayer,
 *         Full controller support,
 *         In-App Purchases,
 *         Includes level editor,
 *         Includes Source SDK,
 *         Local Co-op,
 *         Local Multi-Player,
 *         MMO,
 *         Mods,
 *         Mods (require HL2),
 *         Multi-player,
 *         Online Co-op,
 *         Online Multi-Player,
 *         Partial Controller Support,
 *         Shared/Split Screen,
 *         Single-player,
 *         Stats,
 *         Steam Achievements,
 *         Steam Cloud,
 *         Steam Leaderboards,
 *         Steam Trading Cards,
 *         Steam Turn Notifications,
 *         Steam Workshop,
 *         SteamVR Collectibles,
 *         Valve Anti-Cheat enabled,
 *         VR Support,
 *       ]
 *
 *   parameters:
 *      CategoryParameter:
 *        in: query
 *        name: categories
 *        required: false
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#components/schemas/Category'
 *        description: The categories to filter by.
 */
