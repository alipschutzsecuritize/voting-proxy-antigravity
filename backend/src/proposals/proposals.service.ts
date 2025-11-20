import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { Proposal } from './entities/proposal.entity';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private proposalsRepository: Repository<Proposal>,
  ) { }

  create(createProposalDto: CreateProposalDto) {
    const proposal = this.proposalsRepository.create(createProposalDto);
    return this.proposalsRepository.save(proposal);
  }

  findAll() {
    return this.proposalsRepository.find();
  }

  findByToken(tokenAddress: string) {
    return this.proposalsRepository.find({ where: { token_address: tokenAddress } });
  }

  findOne(id: string) {
    return this.proposalsRepository.findOne({ where: { id } });
  }

  update(id: string, updateProposalDto: UpdateProposalDto) {
    return this.proposalsRepository.update(id, updateProposalDto);
  }

  remove(id: string) {
    return this.proposalsRepository.delete(id);
  }
}
