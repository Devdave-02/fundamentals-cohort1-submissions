import { Query, Types } from "mongoose";
import { queryStringType } from "./types";

class APIFeatures<T> {
  private query: Query<T[], T>;
  private queryCount: Query<number, T>;
  private queryString: queryStringType;
  private maxLimit: number;
  private fields: string;
  private user?: Types.ObjectId;

  //   public page: number;
  public limit: number;
  public offset: number;
  public search?: string;
  public sortBy: Record<string, 1 | -1>;
  public sortOrder: string;
  public status?: "pending" | "in-progress" | "completed";
  public priority?: "low" | "medium" | "high";
  public startDate?: Date;
  public endDate?: Date;

  constructor(
    query: Query<T[], T>,
    queryCount: Query<number, T>,
    queryString: queryStringType
  ) {
    this.query = query;
    this.queryCount = queryCount;
    this.queryString = queryString;
    this.limit = process.env.DEFAULT_LIMIT
      ? parseInt(process.env.DEFAULT_LIMIT, 10)
      : 10;
    this.offset = process.env.DEFAULT_OFFSET
      ? parseInt(process.env.DEFAULT_OFFSET, 10)
      : 0;
    this.maxLimit = process.env.MAX_LIMIT
      ? parseInt(process.env.MAX_LIMIT, 10)
      : 100;
    this.fields = "-__v -password";
    this.sortBy = { createdAt: -1 };
    this.sortOrder = this.queryString.sortOrder === "desc" ? "desc" : "asc";
    this.search = this.queryString.search;
    this.status = this.queryString.status;
    this.priority = this.queryString.priority;
    this.user = this.queryString.user;
    this.startDate = this.queryString.startDate;
    this.endDate = this.queryString.endDate;
  }

  filter(allowedSearchFields: string[] | undefined): this {
    const filterQuery: any = {};

    // Search Filter
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search, "i");
      filterQuery["$or"] = allowedSearchFields?.map((field) => ({
        [field]: searchRegex,
      }));
    }
    // Status Filter
    if (this.queryString.status) {
      filterQuery["status"] = this.queryString.status;
      this.status = this.queryString.status;
    }

    // Priority Filter
    if (this.queryString.priority) {
      filterQuery["priority"] = this.queryString.priority;
      this.priority = this.queryString.priority;
    }

    // User Search Filter
    if (this.queryString.user) {
      filterQuery["user"] = this.user;
    }

    // Date Filter
    if (this.queryString.startDate || this.queryString.endDate) {
      filterQuery["dueDate"] = {};
      if (
        this.queryString.startDate &&
        !isNaN(new Date(this.queryString.startDate).getTime())
      )
        filterQuery["dueDate"]["$gte"] = new Date(this.queryString.startDate);
      if (
        this.queryString.endDate &&
        !isNaN(new Date(this.queryString.endDate).getTime())
      )
        filterQuery["dueDate"]["$lte"] = new Date(this.queryString.endDate);

      // cleanup: if neither date is valid, remove the field
      if (Object.keys(filterQuery["dueDate"]).length === 0) {
        delete filterQuery["dueDate"];
      }
    }

    this.query = this.query.find(filterQuery);
    this.queryCount = this.queryCount.countDocuments(filterQuery);
    return this;
  }

  paginate(): this {
    if (this.queryString.limit) {
      const parsedLimit = parseInt(this.queryString.limit, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        throw new Error("Invalid limit");
      }
      this.limit = Math.min(parsedLimit, this.maxLimit);
    }

    if (this.queryString.offset) {
      const parsedOffset = parseInt(this.queryString.offset, 10);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        throw new Error("Invalid offset");
      }
      this.offset = parsedOffset;
    }

    // Alternative: Parse page-based pagination (Incase they query for page directly)
    if (this.queryString.page && !this.queryString.offset) {
      const parsedPage = parseInt(this.queryString.page, 10);
      if (isNaN(parsedPage) || parsedPage <= 0) {
        throw new Error("Invalid page");
      }
      this.offset = (parsedPage - 1) * this.limit;
    }

    // this.query = this.query.skip(this.offset).limit(this.limit);
    return this;
  }

  limitFields(fieldsToRemove?: string[]): this {
    if (fieldsToRemove) {
      const fields = fieldsToRemove.map((field) => `-${field}`).join(" ");
      this.query = this.query.select(fields);
    }

    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(",")
        .map((field) => `-${field}`)
        .join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  sort(allowedSortFields: string[]): this {
    if (this.queryString.sortBy) {
      const sort = this.queryString.sortBy.split(",").map((field) => {
        if (allowedSortFields.includes(field)) {
          return { [field]: this.queryString.sortOrder === "desc" ? -1 : 1 };
        }
        return null;
      });
      this.sortBy = Object.assign({}, ...sort);
      this.sortOrder = this.queryString.sortOrder === "desc" ? "desc" : "asc";
      //   this.query = this.query.sort(this.sortBy);
    }
    return this;
  }

  getQuery(): { queryCount: Query<number, T>; query: Query<T[], T> } {
    return {
      queryCount: this.queryCount,
      query: this.query
        .sort(this.sortBy)
        // .select(this.fields)
        .skip(this.offset)
        .limit(this.limit),
    };
  }
}

export { APIFeatures };
