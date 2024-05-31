const router = require("express").Router();
const {
    addProject,
    updateProjectStatus,
    getAllProjects,
    getDashboardStats,
    getChartData,
} = require("../controllers/project.controller");
const {
    validateAddProject,
    validateUpdateProject,
} = require("../validators/project.validator");
const { dataValidationResult } = require("../validators/validationResult");
const { isAuthenticated } = require("../middlewares/auth.middleware");

/* Protected Routes*/
router.use(isAuthenticated);

router.post("/add", [validateAddProject, dataValidationResult], addProject);

router.put(
    "/update-status",
    [validateUpdateProject, dataValidationResult],
    updateProjectStatus,
);

router.get("/get-all", getAllProjects);

router.get("/dashboard-stats", getDashboardStats);

router.get("/chart-data", getChartData);

module.exports = { projectRouters: router };
