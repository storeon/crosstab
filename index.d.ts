import { StoreonModule } from 'storeon';

type Config = {
  key?: string;
  filter?: (event: PropertyKey, data?: any) => boolean
}

export function crossTab<State = unknown>(config?: Config): StoreonModule<State>;
