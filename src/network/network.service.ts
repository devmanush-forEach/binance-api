import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NetworkDocument, Network } from './network.schema';
import { CreateNetworkDto, UpdateNetworkDto } from './dto/network.dto';

@Injectable()
export class NetworkService {
  constructor(
    @InjectModel(Network.name) private networkModel: Model<NetworkDocument>,
  ) {}

  async create(createNetworkDto: CreateNetworkDto): Promise<Network> {
    const createdNetwork = new this.networkModel(createNetworkDto);
    return createdNetwork.save();
  }

  async findAll(): Promise<Network[]> {
    return this.networkModel.find().exec();
  }

  async findOne(id: string): Promise<Network> {
    return this.networkModel.findById(id).exec();
  }

  async update(
    id: string,
    updateNetworkDto: UpdateNetworkDto,
  ): Promise<Network> {
    return this.networkModel
      .findByIdAndUpdate(id, updateNetworkDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Network> {
    return this.networkModel.findByIdAndDelete(id).exec();
  }
}
