import { Database } from "sqlite3";
import { SqlParams } from "../types/sqlparams.type.js";
import { LetterStatistic } from "../types/letterStatistic.type.js";
import { StatisticError } from "../utils/customErrorClasses/statisticError.class.js";
import {
  AuthorModel,
  getAllAuthors,
  getAuthorById,
} from "../model/author.model.js";
import {
  getLetterCountersByAuthorId,
  LetterModel,
} from "../model/letterCounter.model.js";
import { RenderObject } from "../types/renderObject.type.js";
import { logger } from "../../winston/winston.js";

export const statisticsByAuthorController = async (
  db: Database,
  params: SqlParams,
): Promise<RenderObject> => {
  try {
    let author: AuthorModel | undefined = await getAuthorById(db, params);
    let authors: AuthorModel[] = await getAllAuthors(db);
    const letterCounters: LetterModel[] = await getLetterCountersByAuthorId(
      db,
      params,
    );
    const letterStatistics: LetterStatistic[] = await getLetterStatictics(
      db,
      params,
    );

    if (!author) {
      author = { id: 0, name: "-", createdAt: "-" };
      authors = [{ id: 0, name: "-", createdAt: "-" }];
    }

    let renderObject: RenderObject = {
      viewName: "statistics",
      options: { author, authors, letterCounters, letterStatistics },
    };

    return renderObject;
  } catch (error) {
    logger.error("Error creating letter statistics renderObject:", error);
    throw new StatisticError(
      "Error creating letter statistics renderObject:",
      500,
    );
  }
};

export const getLetterStatictics = async (
  db: Database,
  params: SqlParams,
): Promise<LetterStatistic[]> => {
  try {
    let letterStatistics: LetterStatistic[] = [];
    let sumOfLetterCount: number = 0;
    const letterCountersByAuthorId = await getLetterCountersByAuthorId(
      db,
      params,
    );
    letterCountersByAuthorId.map((x) => (sumOfLetterCount += x.count));
    for (const letterCounter of letterCountersByAuthorId) {
      const letterStatistic: LetterStatistic = {
        [letterCounter.letter]: Math.round(
          (letterCounter.count / sumOfLetterCount) * 100,
        ),
      };
      letterStatistics.push(letterStatistic);
    }
    return letterStatistics;
  } catch (error) {
    logger.error("Error calculating letter statistics:", error);
    throw new StatisticError("Error calculating letter statistics:", 500);
  }
};
