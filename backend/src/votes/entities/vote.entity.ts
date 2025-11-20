import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Proposal } from '../../proposals/entities/proposal.entity';

export enum VoteAnswer {
    YES = 0,
    NO = 1,
    ABSTAIN = 2,
}

@Entity('voting_result')
export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    holder_wallet: string;

    @Column()
    proposal_id: string;

    @Column({
        type: 'simple-enum',
        enum: VoteAnswer,
    })
    answer: VoteAnswer;

    @Column()
    weight: string;

    @CreateDateColumn()
    creation_date: Date;

    @Column()
    transaction: string;

    @ManyToOne(() => Proposal, (proposal) => proposal.votes)
    @JoinColumn({ name: 'proposal_id' })
    proposal: Proposal;
}
