import { Database } from "sqlite3";
import { AuthorsError } from "../utils/customErrorClasses/authorsError.class.js";
import {
  AuthorModel,
  getAllAuthors,
  getTenAuthors,
} from "../model/author.model.js";
import { RenderObject } from "../types/renderObject.type.js";
import { logger } from "../../winston/winston.js";

export const authorsController = async (
  db: Database,
  page: number,
): Promise<RenderObject> => {
  try {
    if (isNaN(page)) {
      const renderObject: RenderObject = {
        viewName: "error",
        options: { err: "Page not found!" },
      };
      return renderObject;
    }
    const authorsPageNumber: number = Math.ceil(
      (await getAllAuthors(db)).length / 10,
    );
    const authorsSlicedByTen: AuthorModel[] = await getTenAuthors(db, [
      page == 1 ? 0 : (page - 1) * 10,
    ]);
    let error: string = "";
    if (page > authorsPageNumber) {
      error = "No authors to show... Are you sure you are at the right URL?";
    }

    let renderObject: RenderObject = {
      viewName: "authors",
      options: { authorsPageNumber, authorsSlicedByTen, error },
    };

    return renderObject;
  } catch (error) {
    logger.error("Error creating authors renderObject:", error);
    throw new AuthorsError("Error fetching authors!", 500);
  }
};
