import { VoteAnswer } from '../entities/vote.entity';

export class CreateVoteDto {
    holder_wallet: string;
    proposal_id: string;
    answer: VoteAnswer;
    weight: string;
    transaction: string;
}
