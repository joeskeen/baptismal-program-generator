import { InjectionToken } from '@angular/core';
import * as moment from 'moment';

export type Moment = typeof moment;
export const MOMENT_TOKEN = new InjectionToken('moment');
export const MOMENT_API = moment;
