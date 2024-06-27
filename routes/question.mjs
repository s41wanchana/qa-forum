import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionRouter = Router();

questionRouter.post("/", async (req, res) => {
  try {
    const newQuestion = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await connectionPool.query(
      `insert into questions (title, description, category, created_at, updated_at)
        values ($1, $2, $3, $4, $5)`,
      [
        newQuestion.title,
        newQuestion.description,
        newQuestion.category,
        newQuestion.created_at,
        newQuestion.updated_at,
      ]
    );
  } catch (error) {
    return res.status(400).json({
      message: "Missing or invalid request data",
      error: error.message,
    });
  }

  return res.status(201).json({
    message: "Question created successfully.",
  });
});

questionRouter.get("/", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(`select * from questions`);
  } catch (error) {
    return res.status(400).json({
      message: "Could not find server",
      error: error.message,
    });
  }

  return res.status(200).json({
    message: "OK: Successfully retrieved the list of questions.",
    data: result.rows,
  });
});

questionRouter.get("/:id", async (req, res) => {
  let result;
  const questionId = req.params.id;

  try {
    result = await connectionPool.query(`select * from questions where id=$1`, [
      questionId,
    ]);
  } catch (error) {
    return res.status(400).json({
      message: "Could not find server",
      error: error.message,
    });
  }

  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Question not found",
    });
  }

  return res.status(200).json({
    message: "Successfully retrieved the questions.",
    data: result.rows,
  });
});

questionRouter.put("/:id", async (req, res) => {
  const questionId = req.params.id;
  const updatedQuestion = {
    ...req.body,
    updated_at: new Date(),
  };

  let result;

  try {
    result = await connectionPool.query(
      `
      update questions
      set title = $2,
          description = $3,
          category = $4,
          updated_at = $5
      where id = $1
      `,
      [
        questionId,
        updatedQuestion.title,
        updatedQuestion.description,
        updatedQuestion.category,
        updatedQuestion.updated_at,
      ]
    );
  } catch (error) {
    return res.status(400).json({
      message: "Missing or invalid request data.",
      error: error.message,
    });
  }

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }

  return res.status(200).json({
    message: "Successfully updated the question.",
  });
});

questionRouter.delete("/:id", async (req, res) => {
  const questionId = req.params.id;
  let result;
  try {
    result = await connectionPool.query(`DELETE from questions where id=$1`, [
      questionId,
    ]);
  } catch (error) {
    return res.status(400).json({
      message: "Missing or invalid request data.",
      error: error.message,
    });
  }

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }

  return res.status(200).json({
    message: "Successfully deleted the question.",
  });
});
export default questionRouter;
