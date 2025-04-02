import { Injectable } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelsService {
    private labels: any[] = [];

    create(createLabelDto: CreateLabelDto) {
        const label = {
            id: Date.now().toString(),
            ...createLabelDto,
        };
        this.labels.push(label);
        return label;
    }

    findAll() {
        return this.labels;
    }

    findOne(id: string) {
        return this.labels.find(label => label.id === id);
    }

    update(id: string, updateLabelDto: CreateLabelDto) {
        const index = this.labels.findIndex(label => label.id === id);
        if (index !== -1) {
            this.labels[index] = { ...this.labels[index], ...updateLabelDto };
            return this.labels[index];
        }
        return null;
    }

    remove(id: string) {
        const index = this.labels.findIndex(label => label.id === id);
        if (index !== -1) {
            const removed = this.labels[index];
            this.labels.splice(index, 1);
            return removed;
        }
        return null;
    }
} 