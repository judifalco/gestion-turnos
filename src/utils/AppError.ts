export class AppError extends Error {
    constructor(
      public message: string,
      public status: number,
      public code: string,
      public details: unknown[] = []
    ) {
      super(message);
      this.name = 'AppError';
      Object.setPrototypeOf(this, AppError.prototype);
    }
  }
  