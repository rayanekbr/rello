import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLabelDto } from './dto/create-label.dto';
import { Label, LabelDocument } from './schemas/label.schema';

@Injectable()
export class LabelsService {
    constructor(
        @InjectModel(Label.name) private labelModel: Model<LabelDocument>,
    ) { }

    async create(createLabelDto: CreateLabelDto): Promise<Label> {
        const createdLabel = new this.labelModel(createLabelDto);
        return createdLabel.save();
    }

    async findAll(): Promise<Label[]> {
        return this.labelModel.find().exec();
    }

    async findOne(id: string): Promise<Label> {
        const label = await this.labelModel.findById(id).exec();
        if (!label) {
            throw new NotFoundException(`Label with ID ${id} not found`);
        }
        return label;
    }

    async update(id: string, updateLabelDto: CreateLabelDto): Promise<Label> {
        const updatedLabel = await this.labelModel
            .findByIdAndUpdate(id, updateLabelDto, { new: true })
            .exec();
        if (!updatedLabel) {
            throw new NotFoundException(`Label with ID ${id} not found`);
        }
        return updatedLabel;
    }

    async remove(id: string): Promise<Label> {
        const deletedLabel = await this.labelModel.findByIdAndDelete(id).exec();
        if (!deletedLabel) {
            throw new NotFoundException(`Label with ID ${id} not found`);
        }
        return deletedLabel;
    }
} 