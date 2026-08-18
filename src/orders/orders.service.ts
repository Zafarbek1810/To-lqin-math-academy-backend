import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityStatus, OrderStatus } from '../common/enums';
import { ProductsService } from '../products/products.service';
import { StudentsService } from '../students/students.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private productsService: ProductsService,
    private studentsService: StudentsService,
  ) {}

  findAll(status?: OrderStatus) {
    const where = status ? { status } : {};
    return this.repo.find({ where, order: { date: 'DESC' } });
  }

  async findOne(id: string) {
    const order = await this.repo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    return order;
  }

  async create(dto: CreateOrderDto) {
    const product = await this.productsService.findOne(dto.productId);
    if (product.status !== EntityStatus.ACTIVE) {
      throw new BadRequestException('Mahsulot faol emas');
    }
    if (product.quantity < dto.quantity) {
      throw new BadRequestException("Omborda yetarli mahsulot yo'q");
    }

    const student = await this.studentsService.findOne(dto.studentId);
    const totalReward = product.price * dto.quantity;
    const balance = student.rewardEarned - student.rewardSpent;
    if (totalReward > balance) {
      throw new BadRequestException('Mukofot balansi yetarli emas');
    }

    await this.productsService.decreaseStock(product.id, dto.quantity);
    await this.studentsService.spendReward(student.id, totalReward);

    const order = this.repo.create({
      id: `ord${Date.now()}`,
      studentId: dto.studentId,
      productId: dto.productId,
      quantity: dto.quantity,
      totalReward,
      date: new Date().toISOString().slice(0, 10),
      status: OrderStatus.NEW,
    });
    return this.repo.save(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    if (
      dto.status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      const product = await this.productsService.findOne(order.productId);
      product.quantity += order.quantity;
      await this.productsService.update(product.id, {
        quantity: product.quantity,
      });
      const student = await this.studentsService.findOne(order.studentId);
      student.rewardSpent = Math.max(0, student.rewardSpent - order.totalReward);
      await this.studentsService.update(student.id, {
        rewardSpent: student.rewardSpent,
      });
    }

    order.status = dto.status;
    return this.repo.save(order);
  }
}
