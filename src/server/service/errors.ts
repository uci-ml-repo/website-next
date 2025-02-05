/**
 * Custom interface for errors from services.
 *
 * Used to distinguish tRPC and Next errors from service errors.
 */

export type ServiceErrorReason =
  | "Dataset Not Found"
  | "Invalid File Path"
  | "Failed to Send Email"
  | "User Not Found"
  | "Failed to Reset Password";

export type ServiceErrorOrigin = "Dataset" | "File" | "Email" | "User";

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
