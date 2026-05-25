export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const httpError = (status: number, message: string) => new HttpError(status, message);
