import {
  beforeEach,
  vi,
  describe,
  it,
  expect,
  afterEach,
  MockInstance,
} from "vitest";
import * as authorModel from "../model/author.model";
import * as statisticController from "../controller/statistics.controller";
import * as letterCounterModel from "../model/letterCounter.model";
import sqlite3, { Database } from "sqlite3";
import { AuthorModel } from "../model/author.model";
import { RenderObject } from "../types/renderObject.type";
import { StatisticError } from "../utils/customErrorClasses/statisticError.class";
import { LetterStatistic } from "../types/letterStatistic.type";
import { logger } from "../../winston/winston";
import { LetterModel } from "../model/letterCounter.model";

let db: Database;
const createdAtTime = new Date().toLocaleString();
let loggerInfo: MockInstance;
let loggerError: MockInstance;

vi.mock("sqlite3", async (importOriginal) => {
  const actual = await importOriginal<typeof import("sqlite3")>();

  return {
    ...actual,
    Database: vi.fn().mockImplementation(() => ({
      all: vi.fn(),
      get: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    })),
  };
});

describe("statisticController tests", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    loggerInfo = vi.spyOn(logger, "info");
    loggerInfo.mockResolvedValue("Test call");
    loggerError = vi.spyOn(logger, "error");
    loggerError.mockResolvedValue("Test call");
    db = new sqlite3.Database(":memory:");
  });

  afterEach(() => {
    db.close();
    vi.restoreAllMocks();
  });

  describe("statisticsByAuthorController tests", () => {
    it("should return with a valid renderObject if data is valid", async () => {
      const author: AuthorModel = {
        id: 1,
        name: "Teszt Elek",
        createdAt: createdAtTime,
      };
      const authors: AuthorModel[] = [author];
      const letterCounters: LetterModel[] = [
        {
          id: 1,
          authorId: 1,
          letter: "n",
          count: 36,
          createdAt: "2024-09-22T15:59:35.584831",
          updatedAt: "2025-03-14T15:59:35.584858",
        },
        {
          id: 2,
          authorId: 1,
          letter: "ú",
          count: 49,
          createdAt: "2024-05-26T15:59:35.584867",
          updatedAt: "2025-03-14T15:59:35.584873",
        },
        {
          id: 3,
          authorId: 1,
          letter: "é",
          count: 70,
          createdAt: "2024-08-30T15:59:35.584881",
          updatedAt: "2025-03-14T15:59:35.584885",
        },
        {
          id: 4,
          authorId: 1,
          letter: "u",
          count: 22,
          createdAt: "2024-06-28T15:59:35.584889",
          updatedAt: "2025-03-14T15:59:35.584892",
        },
      ];

      const letterStatistics: LetterStatistic[] = [
        { n: 20 },
        { ú: 28 },
        { é: 40 },
        { u: 12 },
      ];

      vi.spyOn(authorModel, "getAuthorById").mockResolvedValue(author);
      vi.spyOn(authorModel, "getAllAuthors").mockResolvedValue([author]);
      vi.spyOn(
        letterCounterModel,
        "getLetterCountersByAuthorId",
      ).mockResolvedValue(letterCounters);
      const result: RenderObject =
        await statisticController.statisticsByAuthorController(db, [1]);
      expect(result.options).toStrictEqual({
        author,
        authors,
        letterCounters,
        letterStatistics,
      });
    });

    it("should return with a valid renderObject if data is not valid", async () => {
      const author: AuthorModel = { id: 0, name: "-", createdAt: "-" };
      const authors: AuthorModel[] = [{ id: 0, name: "-", createdAt: "-" }];
      const letterCounters: LetterModel[] = [];
      const letterStatistics: LetterStatistic[] = [];
      vi.spyOn(authorModel, "getAuthorById").mockResolvedValue(undefined);
      vi.spyOn(authorModel, "getAllAuthors").mockResolvedValue([author]);
      vi.spyOn(
        letterCounterModel,
        "getLetterCountersByAuthorId",
      ).mockResolvedValue([]);
      vi.spyOn(statisticController, "statisticsByAuthorController");
      const result: RenderObject =
        await statisticController.statisticsByAuthorController(db, [1]);
      expect(result.viewName).toBe("statistics");
      expect(result.options).toStrictEqual({
        author,
        authors,
        letterCounters,
        letterStatistics,
      });
    });

    it("should throw an error with the correct message", async () => {
      vi.spyOn(
        statisticController,
        "statisticsByAuthorController",
      ).mockRejectedValue(
        new StatisticError(
          "Error creating letter statistics renderObject:",
          500,
        ),
      );

      await expect(
        statisticController.statisticsByAuthorController(db, [1]),
      ).rejects.toThrow(StatisticError);
      await expect(
        statisticController.statisticsByAuthorController(db, [1]),
      ).rejects.toThrow("Error creating letter statistics renderObject:");
    });

    it("should log an error with the correct message", async () => {
      vi.spyOn(statisticController, "statisticsByAuthorController");
      vi.spyOn(authorModel, "getAuthorById").mockRejectedValue(
        new Error("Error fetching author!"),
      );

      await expect(
        statisticController.statisticsByAuthorController(db, [1]),
      ).rejects.toThrow("Error creating letter statistics renderObject:");
      expect(loggerError).toHaveBeenCalled();
    });
  });

  describe("getLetterStatictics tests", () => {
    it("should return with LetterStatistics array", async () => {
      vi.spyOn(statisticController, "getLetterStatictics");
      vi.spyOn(
        letterCounterModel,
        "getLetterCountersByAuthorId",
      ).mockResolvedValue([
        {
          id: 1,
          authorId: 1,
          letter: "a",
          count: 4,
          createdAt: createdAtTime,
          updatedAt: createdAtTime,
        },
        {
          id: 1,
          authorId: 1,
          letter: "b",
          count: 6,
          createdAt: createdAtTime,
          updatedAt: createdAtTime,
        },
      ]);
      const letterStatistics: LetterStatistic[] =
        await statisticController.getLetterStatictics(db, [1]);
      expect(letterStatistics).toEqual([{ a: 40 }, { b: 60 }]);
    });

    it("should throw an error with the correct message", async () => {
      vi.spyOn(
        statisticController,
        "statisticsByAuthorController",
      ).mockRejectedValue(
        new StatisticError("Error calculating letter statistics:", 500),
      );

      await expect(
        statisticController.statisticsByAuthorController(db, [1]),
      ).rejects.toThrow(StatisticError);
      await expect(
        statisticController.statisticsByAuthorController(db, [1]),
      ).rejects.toThrow("Error calculating letter statistics:");
    });

    it("should log an error with the correct message", async () => {
      vi.spyOn(statisticController, "getLetterStatictics");
      vi.spyOn(
        letterCounterModel,
        "getLetterCountersByAuthorId",
      ).mockRejectedValue(new Error("Error fetching counters!"));

      await expect(
        statisticController.getLetterStatictics(db, [1]),
      ).rejects.toThrow("Error calculating letter statistics:");
      expect(loggerError).toHaveBeenCalled();
    });
  });
});
