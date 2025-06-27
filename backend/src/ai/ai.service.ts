import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, map, timeout } from 'rxjs';

export interface AiResponse<T = any> {
  result: T | null;
  error?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly baseUrl: string;
  private readonly modelName: string;
  private readonly requestTimeout: number;

  constructor(private readonly http: HttpService) {
    this.baseUrl = 'http://host.docker.internal:1234';
    this.modelName =
      process.env.LAMA_API_MODEL || 'deepseek/deepseek-r1-0528-qwen3-8b';
    this.requestTimeout = 150000;
  }

  async generate<T = any>(
    systemPrompt: string,
    userPrompt: string,
    jsonSchema: object,
    options: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {},
  ): Promise<AiResponse<T>> {
    const url = `${this.baseUrl}/v1/chat/completions`;
    const payload: any = {
      model: this.modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'response',
          strict: 'true',
          schema: jsonSchema,
        },
      },
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? -1,
      stream: options.stream ?? false,
    };

    this.logger.debug(`Calling AI @ ${url} payload=${JSON.stringify(payload)}`);

    try {
      const resp$ = this.http
        .post(url, payload, {
          headers: { 'Content-Type': 'application/json' },
          validateStatus: (s) => s >= 200 && s < 300,
        })
        .pipe(
          timeout(this.requestTimeout),
          map((r) => r.data),
          catchError((err) => {
            throw err;
          }),
        );

      const data: any = await firstValueFrom(resp$);
      if (data.error || !data.choices?.[0]?.message?.content) {
        return { result: null, error: data.error || 'Empty response' };
      }
      const content = data.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        return { result: parsed as T };
      } catch (err) {
        this.logger.error('Error parsing AI response', err);
        return { result: null, error: 'Invalid JSON response' };
      }
    } catch (err: any) {
      this.logger.error('Erreur AI.generate()', err.message || err);
      let msg = 'Erreur inconnue';
      
      if (err.code === 'ECONNABORTED') {
        msg = 'Request timeout';
      } else if (err.response?.data) {
        msg = typeof err.response.data === 'string' 
          ? err.response.data 
          : JSON.stringify(err.response.data);
      } else if (err.message) {
        msg = err.message;
      } else if (typeof err === 'string') {
        msg = err;
      } else {
        msg = JSON.stringify(err);
      }
      
      return { result: null, error: msg };
    }
  }
}
