import { Game } from './game';
import { Description } from './description';
import { Media } from './media';
import { Requirements } from './requirements';
import { Support } from './support';

export interface DetailedGame extends Game, Description, Media, Requirements, Support {}
