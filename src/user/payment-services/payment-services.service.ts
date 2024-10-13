import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PaymentServices,
  PaymentServicesDocument,
} from './payment-services.schema';
import {
  CreatePaymentServicesDto,
  UpdatePaymentServicesDto,
  UserPaymentServiceResponse,
} from './dto/payment-services.dto';
import { TransactionMethodsService } from 'src/transactions-methods/transaction-methods.service';

@Injectable()
export class PaymentServicesService {
  constructor(
    @InjectModel(PaymentServices.name)
    private paymentServicesModel: Model<PaymentServicesDocument>,
    private readonly transactionMethodsService: TransactionMethodsService,
  ) {}

  async create(
    createPaymentServicesDto: CreatePaymentServicesDto,
  ): Promise<PaymentServices> {
    try {
      const transactionMethodId = new Types.ObjectId(
        createPaymentServicesDto.transactionMethodId,
      );

      const createdPaymentService = new this.paymentServicesModel({
        ...createPaymentServicesDto,
        transactionMethodId,
      });
      console.log(createdPaymentService);
      const response = await createdPaymentService.save();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(): Promise<PaymentServices[]> {
    return this.paymentServicesModel.find().exec();
  }
  async findAllForUser(userId: string): Promise<UserPaymentServiceResponse[]> {
    const query = [
      {
        $match: { userId: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'transactionmethods',
          localField: 'transactionMethodId',
          foreignField: '_id',
          as: 'transactionMethodId',
        },
      },
      {
        $unwind: '$transactionMethodId',
      },
      {
        $group: {
          _id: '$transactionMethodId',
          paymentServices: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          paymentMethod: '$_id',
          paymentServices: 1,
        },
      },
    ];
    const services = await this.paymentServicesModel.aggregate(query).exec();

    try {
      const allRelativeMethods = await this.transactionMethodsService.findAll();

      const response = allRelativeMethods.map((method: any) => {
        const value = services.find((ele: UserPaymentServiceResponse) => {
          return ele.paymentMethod._id.toString() == method._id.toString();
        });
        if (value) return value;
        return {
          paymentMethod: method,
          paymentServices: [],
        };
      });

      return response;
    } catch (error) {
      return services;
    }
  }

  async findOne(id: string): Promise<PaymentServices> {
    const paymentService = await this.paymentServicesModel.findById(id).exec();
    if (!paymentService) {
      throw new NotFoundException(`Payment service with ID ${id} not found`);
    }
    return paymentService;
  }

  async update(
    id: string,
    updatePaymentServicesDto: UpdatePaymentServicesDto,
  ): Promise<PaymentServices> {
    const existingPaymentService = await this.paymentServicesModel
      .findByIdAndUpdate(id, updatePaymentServicesDto, { new: true })
      .exec();
    if (!existingPaymentService) {
      throw new NotFoundException(`Payment service with ID ${id} not found`);
    }
    return existingPaymentService;
  }

  async remove(id: string): Promise<PaymentServices> {
    const deletedPaymentService = await this.paymentServicesModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedPaymentService) {
      throw new NotFoundException(`Payment service with ID ${id} not found`);
    }
    return deletedPaymentService;
  }
}
