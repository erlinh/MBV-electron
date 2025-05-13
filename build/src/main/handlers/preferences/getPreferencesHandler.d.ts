import { GetPreferencesQuery, GetPreferencesResult } from '../../../shared/queries/preferenceQueries';
import { PreferencesRepository } from '../../persistence/PreferencesRepository';
export declare function getPreferencesHandler(repository: PreferencesRepository): (query: GetPreferencesQuery) => Promise<GetPreferencesResult>;
