export class AppResult<T> {
  success: boolean;
  data?: T;
  errorMessage?: string;
  validationErrors?: string[];

  private constructor(
    success: boolean,
    data?: T,
    errorMessage?: string,
    validationErrors?: string[],
  ) {
    this.success = success;
    this.data = data;
    this.errorMessage = errorMessage;
    this.validationErrors = validationErrors;
  }

  static ok<T>(data?: T): AppResult<T> {
    return new AppResult<T>(true, data);
  }

  static fail<T>(errorMessage: string, validationErrors?: string[]): AppResult<T> {
    return new AppResult<T>(false, undefined, errorMessage, validationErrors);
  }
}
