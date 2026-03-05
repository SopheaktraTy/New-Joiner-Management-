import { Router } from "express";
import * as newJoinersController from "../controllers/newJoiners.controller"; // ensure this path/name is correct


export const newJoinersRouter = Router();

/**
 * @swagger
 * /api/new-joiners:
 *   get:
 *     summary: Get all joiners
 *     tags: [New Joiners]
 *     responses:
 *       200:
 *         description: List of joiners
 */
newJoinersRouter.get("/", newJoinersController.getAll);

/**
 * @swagger
 * /api/new-joiners:
 *   post:
 *     summary: Add a new joiner
 *     tags: [New Joiners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName: { type: string, example: "John" }
 *               lastName: { type: string, example: "Smith" }
 *               jobTitle: { type: string, example: "IT Support" }
 *               companyEmail: { type: string, example: "john.smith@company.com" }
 *               staffInitial: { type: string, example: "JS" }
 *               phoneExtension: { type: string, example: "1234" }
 *               joinDate: { type: string, example: "2026-03-05" }
 *               localDomainUser: { type: string, example: "jsmith" }
 *               department: { type: string, example: "IT" }
 *               tidApprovalStatus: { type: string, example: "Pending" }
 *               defaultPrinter: { type: string, example: "PRN-01" }
 *               accessResource: { type: string, example: "SharePoint" }
 *               localDomainUserGroup: { type: string, example: "Domain Users" }
 *               emailUserGroup: { type: string, example: "All Staff" }
 *     responses:
 *       201:
 *         description: Joiner created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
newJoinersRouter.post("/", newJoinersController.create);

/**
 * @swagger
 * /api/new-joiners/{id}:
 *   delete:
 *     summary: Delete by ID
 *     tags: [New Joiners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Joiner deleted
 *       400:
 *         description: Invalid id
 *       500:
 *         description: Server error
 */
newJoinersRouter.delete("/:id", newJoinersController.remove);