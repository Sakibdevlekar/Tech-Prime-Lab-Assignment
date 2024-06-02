import DashboardActive from "../assets/Dashboard-active.svg";
import Dashboard from "../assets/Dashboard.svg";
import ProjectListActive from "../assets/Project-list-active.svg";
import ProjectList from "../assets/Project-list.svg";
import CreateProjectActive from "../assets/create-project-active.svg";
import CreateProject from "../assets/create-project.svg";

export const Tabs = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: DashboardActive,
    inActive:Dashboard

  },
  {
    name: "Project List",
    path: "/projects-listing",
    icon: ProjectListActive,
    inActive:ProjectList

  },
  {
    name: "Create Project",
    path: "/add-project",
    icon: CreateProjectActive,
    inActive:CreateProject
  },
];
