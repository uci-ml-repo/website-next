/**
 * Custom interface for errors from services.
 *
 * Used to distinguish tRPC and Next errors from service errors.
 */

export type ServiceErrorReason = "Dataset Not Found" | "Invalid File";

export type ServiceErrorOrigin = "Dataset" | "File";

interface ServiceErrorInterface {
  reason: ServiceErrorReason;
  origin: ServiceErrorOrigin;
  message?: string;
}

export default class ServiceError
  extends Error
  implements ServiceErrorInterface
{
  reason: ServiceErrorReason;

  origin: ServiceErrorOrigin;

  message: string;

  constructor({ reason, origin, message }: ServiceErrorInterface) {
    super();
    this.reason = reason;
    this.origin = origin;
    this.message = message ?? `${reason} from ${origin} service`;
  }
}
