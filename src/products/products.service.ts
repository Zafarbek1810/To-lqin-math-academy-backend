import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityStatus } from '../common/enums';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
  ) {}

  findAll(activeOnly = false) {
    const where = activeOnly ? { status: EntityStatus.ACTIVE } : {};
    return this.repo.find({ where, order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    return product;
  }

  create(dto: CreateProductDto) {
    const product = this.repo.create({
      id: `p${Date.now()}`,
      name: dto.name,
      price: dto.price,
      quantity: dto.quantity,
      description: dto.description ?? '',
      status: dto.status ?? EntityStatus.ACTIVE,
      imageUrl: dto.imageUrl,
    });
    return this.repo.save(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.repo.remove(product);
    return { deleted: true };
  }

  async decreaseStock(id: string, qty: number) {
    const product = await this.findOne(id);
    if (product.quantity < qty) {
      throw new BadRequestException("Omborda yetarli mahsulot yo'q");
    }
    product.quantity -= qty;
    return this.repo.save(product);
  }
}
