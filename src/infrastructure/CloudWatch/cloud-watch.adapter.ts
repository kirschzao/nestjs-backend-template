import { CloudWatchLogParams } from './cloud-watch.types';

export abstract class CloudWatchAdapter {
  abstract log(params: CloudWatchLogParams): Promise<void>;
}
