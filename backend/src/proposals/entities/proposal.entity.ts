import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Vote } from '../../votes/entities/vote.entity';

@Entity('voting_proposal')
export class Proposal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    creation_date: Date;

    @Column()
    hash: string;

    @Column()
    contract_address: string;

    @Column()
    token_address: string;

    @Column()
    expiration: Date;

    @Column()
    snapshot_block: string;

    @OneToMany(() => Vote, (vote) => vote.proposal)
    votes: Vote[];
}
