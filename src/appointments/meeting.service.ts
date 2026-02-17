import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosError, AxiosResponse } from "axios";
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class MeetingService {
    private readonly logger = new Logger(MeetingService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) { }

    // private async getAccessToken(): Promise<string> {
    //     const clientId = this.configService.getOrThrow<string>('ZOOM_CLIENT_ID');
    //     const clientSecret = this.configService.getOrThrow<string>('ZOOM_CLIENT_SECRET');

    //     const response: AxiosResponse = await firstValueFrom(
    //         this.httpService.post(
    //             'https://zoom.us/oauth/token',
    //             null,
    //             {
    //                 params: {
    //                     grant_type: 'client_credentials',
    //                 },
    //                 auth: {
    //                     username: clientId,
    //                     password: clientSecret,
    //                 },
    //             },
    //         ).pipe(
    //             catchError((error: AxiosError) => {
    //                 this.logger.error('Error getting Zoom access token', error?.response?.data || error.message);
    //                 throw error;
    //             }),
    //         ),
    //     );

    //     this.logger.log({data: response.data})
    //     return response.data.access_token;
    // }

    private async getAccessToken(): Promise<string> {
        const clientId = this.configService.getOrThrow<string>('ZOOM_CLIENT_ID');
        const clientSecret = this.configService.getOrThrow<string>('ZOOM_CLIENT_SECRET');
        const accountId = this.configService.getOrThrow<string>('ZOOM_ACCOUNT_ID');
      
        const tokenResponse = await firstValueFrom(
          this.httpService.post(
            'https://zoom.us/oauth/token',
            null,
            {
              params: {
                grant_type: 'account_credentials',
                account_id: accountId,
              },
              auth: {
                username: clientId,
                password: clientSecret,
              },
            },
          ).pipe(
            catchError((error: AxiosError) => {
              this.logger.error('Error getting Zoom access token', error?.response?.data || error.message);
              throw error;
            }),
          ),
        );
      
        return tokenResponse.data.access_token;
      }      

    async createMeeting(startTime: string, duration: number, participantCount: number = 2): Promise<string> {
        const accessToken = await this.getAccessToken();

        const isOneOnOne = participantCount === 2;

        const payload = {
            topic: isOneOnOne ? '1-on-1 Meeting' : 'Group Meeting',
            type: 2, // Scheduled Meeting
            start_time: startTime,
            duration,
            timezone: 'Asia/Karachi',
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: isOneOnOne, // allow instant join for 1-on-1
                waiting_room: !isOneOnOne, // enable waiting room for group
                approval_type: 0, // auto approval
            },
        };
      
        const response = await firstValueFrom(
          this.httpService.post(
            `https://api.zoom.us/v2/users/me/meetings`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            },
          ).pipe(
            catchError((error: AxiosError) => {
              this.logger.error('Error creating Zoom meeting', error?.response?.data || error.message);
              throw error;
            }),
          ),
        );
      
        return response.data.join_url;
      }      

}