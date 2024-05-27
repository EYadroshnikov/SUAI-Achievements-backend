import { Controller } from '@nestjs/common';
import { InstituesService } from './institues.service';

@Controller('institues')
export class InstituesController {
  constructor(private readonly instituesService: InstituesService) {}
}
