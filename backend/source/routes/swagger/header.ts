/**
 * @swagger
 * components:
 *   parameters:
 *      TypesVersionHeader:
 *        in: header
 *        name: x-used-types-version
 *        required: true
 *        schema:
 *          type: string
 *          pattern: ^\d+\.\d+\.\d+$
 *        example: 1.0.0
 *        description: The header to validate the types package version are compatible.
 */
