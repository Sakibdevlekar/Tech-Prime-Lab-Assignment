const projectsModel = require("../models/projects.model");
const projectModel = require("../models/projects.model");
const {
    asyncHandler,
    apiError,
    sendResponse,
    generateAccessAndRefreshTokens,
} = require("../utils/helper.utils");

/**
 * @function addProject
 * @async
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @throws {ApiError} Throws an ApiError if project creation fails
 * @description This asynchronous function handles adding a new project. It extracts project details from the request body,
 * creates a new project in the database, and sends a response indicating the creation status along with the new project details.
 */
exports.addProject = asyncHandler(async (req, res) => {
    const {
        projectName,
        reason,
        type,
        division,
        category,
        priority,
        department,
        startDate,
        endDate,
        location,
        status,
    } = req.body;

    // Create a new project with the provided details
    const newProject = await projectModel.create({
        projectName,
        reason,
        type,
        division,
        category,
        priority,
        department,
        startDate,
        endDate,
        location,
        status,
    });

    // If project creation fails, throw an error
    if (!newProject) {
        throw new apiError(
            400,
            "Something went wrong while creating the project",
        );
    }

    // Send a success response with the new project details
    sendResponse(res, 201, newProject, "Project created successfully");
});

/**
 * @function updateProjectStatus
 * @async
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @throws {ApiError} Throws an ApiError if the project is not found
 * @description This asynchronous function handles updating the status of an existing project. It finds the project by its ID,
 * updates its status, and sends a response indicating the update status along with the updated project details.
 */
exports.updateProjectStatus = asyncHandler(async (req, res) => {
    const { projectId, status } = req.body;

    // Find the project by its ID
    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new apiError(404, "Project not found");
    }

    // Update the project's status
    const newStatus = await projectModel.findByIdAndUpdate(
        projectId,
        { status },
        { new: true },
    );

    // Send a success response with the updated project details
    sendResponse(res, 200, newStatus, "Project status updated successfully");
});

/**
 * @function getAllProjects
 * @async
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @description This asynchronous function handles fetching all projects based on search criteria, status, sorting, and pagination.
 * It builds a query to filter projects, retrieves the matching projects from the database, sorts them based on a specified field,
 * and sends a response with the projects and pagination details.
 */

exports.getAllProjects = asyncHandler(async (req, res) => {
    const { search, fieldToSort = "_id" } = req.query;
    const pageNumber = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (pageNumber - 1) * pageSize;
    let dbQuery = {};

    // Build search query based on user input
    if (search) {
        const searchRegex = new RegExp(search.trim(), "i");
        dbQuery.$or = [
            { projectName: { $regex: searchRegex } },
            { projectName: { $regex: searchRegex } },
        ];
    }

    // Count the total number of documents matching the query
    const dataCount = await projectModel.countDocuments(dbQuery);

    // Retrieve the projects matching the query, sort them based on the specified field, and paginate the results
    const projects = await projectModel
        .find(dbQuery)
        .sort(fieldToSort)
        .skip(skip)
        .limit(pageSize);

    const startItem = skip + 1;
    const endItem = Math.min(
        startItem + pageSize - 1,
        startItem + projects.length - 1,
    );
    const totalPages = Math.ceil(dataCount / pageSize);

    // Send a response with the projects and pagination details
    sendResponse(
        res,
        200,
        {
            content: projects,
            startItem,
            endItem,
            totalPages,
            pageSize: projects.length,
            totalDoc: dataCount,
        },
        "Projects fetched successfully",
    );
});

/**
 * @function getDashboardStats
 * @async
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @description This asynchronous function fetches various statistics for the dashboard, including total projects,
 * total running projects, total closed projects, total cancelled projects, and delayed projects.
 * It counts the number of projects based on their status and end date criteria.
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
    const [
        totalProjects,
        totalRunningProjects,
        totalClosedProjects,
        totalCancelledProjects,
        delayedProjects,
    ] = await Promise.all([
        projectsModel.countDocuments(),
        projectsModel.countDocuments({ status: "Running" }),
        projectsModel.countDocuments({ status: "Closed" }),
        projectsModel.countDocuments({ status: "Cancelled" }),
        projectsModel.countDocuments({
            status: "Running",
            endDate: { $lt: new Date().toISOString() }, // Fetch projects with end date less than today
        }),
    ]);

    const dashboardStats = {
        totalProjects,
        totalRunningProjects,
        totalClosedProjects,
        totalCancelledProjects,
        delayedProjects,
    };
    sendResponse(
        res,
        200,
        dashboardStats,
        "Dashboard statistics fetched successfully",
    );
});

/**
 * @function getChartData
 * @async
 * @description This asynchronous function calculates the success percentage of projects for each department
 * by aggregating data from the Project collection based on the project status.
 * @returns {Promise<Object[]>} Array of objects representing department-wise success percentage data.
 */

exports.getChartData = asyncHandler(async (req,res) => {
    // MongoDB aggregation pipeline to calculate success percentage
    const pipeline = [
        {
            $group: {
                _id: "$department",
                totalProjects: { $sum: 1 }, // Count total projects for each department
                totalClosedProjects: {
                    // Count closed projects for each department
                    $sum: {
                        $cond: {
                            if: { $eq: ["$status", "Closed"] }, // Condition: project status is "Closed"
                            then: 1, // Increment count if condition is true
                            else: 0, // Otherwise, keep count as 0
                        },
                    },
                },
            },
        },
        {
            $project: {
                department: "$_id", // Rename _id to department
                totalProjects: 1, // Include totalProjects field in output
                totalClosedProjects: 1, // Include totalClosedProjects field in output
                successPercentage: {
                    // Calculate success percentage for each department
                    $multiply: [
                        { $divide: ["$totalClosedProjects", "$totalProjects"] }, // Divide closed projects by total projects
                        100, // Multiply by 100 to get percentage
                    ],
                },
            },
        },
    ];

    // Execute the aggregation pipeline to fetch chart data
    const chartData = await projectModel.aggregate(pipeline);

    // Send the response with the chart data
    sendResponse(res, 200, chartData, "Chart data fetched successfully");
});
