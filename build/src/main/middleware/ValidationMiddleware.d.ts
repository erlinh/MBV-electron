import { Message, MessageMiddleware } from '../../shared/models/types';
export declare class ValidationMiddleware implements MessageMiddleware {
    process<TResult>(message: Message, next: () => Promise<TResult>): Promise<TResult>;
    private validateCreateNoteCommand;
    private validateUpdatePreferencesCommand;
}
