import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { useResource } from "@refinedev/core";

export const CustomDocumentTitleHandler = () => {
  const location = useLocation();
  const params = useParams();
  const { resources } = useResource();

  useEffect(() => {
    const setDocumentTitle = () => {
      const path = location.pathname;

      // Home/Landing page
      if (path === "/") {
        document.title = "MCurio | Modern Museum Management";
        return;
      }

      // Dashboard
      if (path === "/dashboard" || path.startsWith("/dashboard")) {
        document.title = "MCurio | Museum Management";
        return;
      }

      // Find matching resource
      const resource = resources.find((res) => {
        // Convert route definitions to strings for comparison
        const listPath = typeof res.list === "string" ? res.list : "";
        const createPath = typeof res.create === "string" ? res.create : "";
        const editPath = typeof res.edit === "string" ? res.edit : "";

        return (
          path.startsWith(`/${res.name}`) ||
          (listPath && path.startsWith(listPath)) ||
          (createPath && path.startsWith(createPath.split("/:")[0])) ||
          (editPath && path.startsWith(editPath.split("/:")[0]))
        );
      });

      if (resource && resource.meta?.label) {
        // Determine the action
        if (path.includes("/new") || path.includes("/create")) {
          document.title = `MCurio | Create ${resource.meta.label}`;
        } else if (path.includes("/edit/")) {
          document.title = `MCurio | Edit ${resource.meta.label}`;
        } else {
          document.title = `MCurio | ${resource.meta.label}`;
        }
      } else {
        // Fallback
        document.title = "MCurio";
      }
    };

    setDocumentTitle();
  }, [location.pathname, resources, params]);

  return null;
};
