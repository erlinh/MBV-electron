import { Message, MessageMiddleware } from '../../shared/models/types';
import { CreateNoteCommand } from '../../shared/commands/noteCommands';
import { UpdatePreferencesCommand } from '../../shared/commands/preferenceCommands';

export class ValidationMiddleware implements MessageMiddleware {
  async process<TResult>(
    message: Message,
    next: () => Promise<TResult>
  ): Promise<TResult> {
    // Validate the message based on its type
    switch (message.type) {
      case 'CreateNoteCommand':
        this.validateCreateNoteCommand(message as CreateNoteCommand);
        break;
        
      case 'UpdatePreferencesCommand':
        this.validateUpdatePreferencesCommand(message as UpdatePreferencesCommand);
        break;
        
      // Add more validation cases as needed
    }
    
    return next();
  }
  
  private validateCreateNoteCommand(command: CreateNoteCommand): void {
    const { title, content } = command.payload;
    
    if (!title || title.trim() === '') {
      throw new Error('Note title is required');
    }
    
    if (!content || content.trim() === '') {
      throw new Error('Note content is required');
    }
    
    if (title.length > 100) {
      throw new Error('Note title must be less than 100 characters');
    }
  }
  
  private validateUpdatePreferencesCommand(command: UpdatePreferencesCommand): void {
    const { fontSize } = command.payload;
    
    if (fontSize !== undefined && (fontSize < 8 || fontSize > 32)) {
      throw new Error('Font size must be between 8 and 32');
    }
  }
} 