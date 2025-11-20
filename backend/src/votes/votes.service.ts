import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote } from './entities/vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) { }

  create(createVoteDto: CreateVoteDto) {
    const vote = this.votesRepository.create(createVoteDto);
    return this.votesRepository.save(vote);
  }

  findAll() {
    return this.votesRepository.find();
  }

  findByProposal(proposalId: string) {
    return this.votesRepository.find({ where: { proposal_id: proposalId } });
  }

  findOne(id: string) {
    return this.votesRepository.findOne({ where: { id } });
  }

  update(id: string, updateVoteDto: UpdateVoteDto) {
    return this.votesRepository.update(id, updateVoteDto);
  }

  remove(id: string) {
    return this.votesRepository.delete(id);
  }
}
