import {
    Controller,
    UseGuards,
    Post,
    Patch,
    Body,
    Param,
    Get,
    Query,
} from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

import { ReportsService } from './reports.service';

import { CurrentUser } from '../users/decorators/current-user.decorator';
import { Serialise } from '../interceptors/serialise.interceptor';

import { User } from '../users/user.entity';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialise(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @UseGuards(AdminGuard)
    @Patch('/:id')
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved);
    }
}
