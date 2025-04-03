import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { Label } from './schemas/label.schema';

@Controller('labels')
export class LabelsController {
    constructor(private readonly labelsService: LabelsService) { }

    @Post()
    async create(@Body() createLabelDto: CreateLabelDto): Promise<Label> {
        return this.labelsService.create(createLabelDto);
    }

    @Get()
    async findAll(): Promise<Label[]> {
        return this.labelsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Label> {
        return this.labelsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateLabelDto: CreateLabelDto): Promise<Label> {
        return this.labelsService.update(id, updateLabelDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Label> {
        return this.labelsService.remove(id);
    }
} 