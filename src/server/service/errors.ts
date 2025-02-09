/**
 * Custom interface for errors from services.
 *
 * Used to distinguish tRPC and Next errors from service errors.
 */

export type ServiceErrorOrigin =
  | "Dataset"
  | "File"
  | "Email"
  | "User"
  | "Discussion";

interface ServiceErrorInterface {
  origin: ServiceErrorOrigin;
  message?: string;
}

export class ServiceError extends Error implements ServiceErrorInterface {
  origin: ServiceErrorOrigin;
  message: string;

  constructor({ origin, message }: ServiceErrorInterface) {
    super();
    this.origin = origin;
    this.message = message ?? `${origin} service`;
  }
}
