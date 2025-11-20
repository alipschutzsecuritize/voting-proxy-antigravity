export class CreateProposalDto {
    title: string;
    description: string;
    hash: string;
    contract_address: string;
    token_address: string;
    expiration: Date;
    snapshot_block: string;
}
