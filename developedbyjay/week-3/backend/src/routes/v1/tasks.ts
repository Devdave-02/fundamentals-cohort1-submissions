import { Router } from "express";
import { createTask } from "@src/controllers/v1/tasks/create-task";
import { deleteTask } from "@src/controllers/v1/tasks/delete-task";
import { filterTasks } from "@src/controllers/v1/tasks/filter-task";
import { getAllTasks } from "@src/controllers/v1/tasks/getall-task";
import { searchTasks } from "@src/controllers/v1/tasks/search-task";
import { updateTask } from "@src/controllers/v1/tasks/update-task";
import { authenticate } from "@src/middleware/authentication";
import { authorization } from "@src/middleware/authorization";
import { getTask } from "@src/controllers/v1/tasks/get-task";

const router = Router();

router.get("/", authenticate, authorization(["user", "admin"]), getAllTasks);

router.get("/:id", authenticate, authorization(["user", "admin"]), getTask);

router.post("/", authenticate, authorization(["user", "admin"]), createTask);

router.delete("/:id", authenticate, authorization(["admin"]), deleteTask);

router.patch(
  "/:id",
  authenticate,
  authorization(["user", "admin"]),
  updateTask
);

router.post(
  "/search",
  authenticate,
  authorization(["user", "admin"]),
  searchTasks
);

router.post(
  "/filter",
  authenticate,
  authorization(["user", "admin"]),
  filterTasks
);

export default router;
