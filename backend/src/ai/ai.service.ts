import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';

export interface AiResponse<T = any> {
  result: T;
  error?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly baseUrl: string;
  private readonly requestTimeout: number;

  constructor(
      private readonly http: HttpService,
  ) {
    this.baseUrl = process.env.AI_BASE_URL || 'http://127.0.0.1:1234';
    this.requestTimeout = Number(process.env.AI_TIMEOUT_MS) || 10_000;
  }

  async generate<T = any>(
      prompt: string,
      options: Record<string, any> = {},
  ): Promise<AiResponse<T>> {
    const payload = { prompt, ...options };

    try {
      const resp$ = this.http
          .post(`${this.baseUrl}/generate`, payload, {
            headers: { 'Content-Type': 'application/json' },
          })
          .pipe(
              timeout(this.requestTimeout),
              map(r => r.data as T),
              catchError(err => {
                throw err;
              }),
          );

      const data = await firstValueFrom(resp$);
      return { result: data };
    } catch (err: any) {
      this.logger.error('Erreur AI.generate()', err.message || err);
      const message =
          err.code === 'ECONNABORTED'
              ? 'Request timeout'
              : err.response?.data || err.message;
      return { result: null as any, error: message };
    }
  }
}
