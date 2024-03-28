import { Context } from "react";

class BaseError extends Error {
  static isThisError(error: unknown): error is Error {
    return error instanceof this;
  }
}

export class ContextError<T> extends BaseError {
  constructor(context: Context<T | undefined>) {
    const contextName = context.displayName ?? "Context";
    super(`use${contextName} must be used within a ${contextName}Provider`);
    this.name = "ContextError";
  }
}

export class TargetElementError extends BaseError {
  constructor(elementId: string) {
    super(`Component needs a target element with id: ${elementId}`);
    this.name = "TargetElementError";
  }
}

export class RemoveTrackError extends BaseError {
  constructor() {
    super("Failed to remove tracks");
    this.name = "RemoveTrackError";
  }
}

export class CreatePlaylistError extends BaseError {
  constructor() {
    super("Failed to create playlist");
    this.name = "CreatePlaylistError";
  }
}

export class BadRequestError extends BaseError {
  constructor() {
    super("Bad request");
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends BaseError {
  constructor() {
    super("Not found");
    this.name = "NotFoundError";
  }
}

export class TimeOutError extends BaseError {
  constructor() {
    super("Time out");
    this.name = "TimeOutError";
  }
}
