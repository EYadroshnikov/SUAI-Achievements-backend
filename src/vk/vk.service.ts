import { Injectable } from '@nestjs/common';

@Injectable()
export class VkService {
  async verifyVkToken(vkToken: string, vkId: string): Promise<boolean> {
    return true; //TODO: complete it;
  }
}
