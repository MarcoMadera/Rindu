import { Context } from "react";

interface ErrorMetadata {
  code?: string;
  timestamp?: string;
  details?: Record<string, unknown>;
}

abstract class BaseError extends Error {
  readonly timestamp: string;
  readonly code?: string;
  readonly details?: Record<string, unknown>;

  constructor(message: string, metadata: ErrorMetadata = {}) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = metadata.timestamp ?? new Date().toISOString();
    this.code = metadata.code;
    this.details = metadata.details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static isThisError(error: unknown): error is BaseError {
    return error instanceof this;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
      details: this.details,
      stack: this.stack,
    };
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
  constructor(elementId?: string | HTMLElement) {
    super(`Component needs a target element with id: ${elementId?.toString()}`);
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

export class HTTPError extends BaseError {
  readonly statusCode: number;
  readonly header?: string;

  constructor(
    statusCode: number,
    message: string,
    header?: string,
    metadata?: ErrorMetadata
  ) {
    super(message, metadata);
    this.statusCode = statusCode;
    this.header = header;
  }
}

export class BadRequestError extends HTTPError {
  constructor(header?: string, metadata?: ErrorMetadata) {
    super(400, "Bad request", header, metadata);
  }
}

export class NotFoundError extends HTTPError {
  constructor(header?: string, metadata?: ErrorMetadata) {
    super(404, "Not found", header, metadata);
  }
}

export class TimeOutError extends HTTPError {
  readonly timeoutMs?: number;

  constructor(timeoutMs?: number, header?: string, metadata?: ErrorMetadata) {
    const afterMessage = timeoutMs ? ` after ${timeoutMs}ms` : "";
    super(408, `Request timeout${afterMessage}`, header, metadata);
    this.timeoutMs = timeoutMs;
  }
}
