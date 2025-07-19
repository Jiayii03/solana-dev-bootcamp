// github: https://github.com/solana-developers/developer-bootcamp-2024
#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("LDEz3SvL4yt5v783vXcewrHg2pNz1mBRbyM2YLLDKo1");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize_poll(_ctx: Context<InitializePoll>, _poll_id: u64, _description: String, _poll_start: u64, _poll_end: u64) -> Result<()> {
        let poll = &mut _ctx.accounts.poll; // mut means the account is writable
        poll.poll_id = _poll_id;
        poll.description = _description;
        poll.poll_start = _poll_start;
        poll.poll_end = _poll_end;
        poll.candidate_amount = 0;
        Ok(())
    }
   
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> { // this is a struct that contains the accounts that are needed for the function
    #[account(mut)] // mut means the account is writable
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + Poll::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll { // defines the actual data structure that will be stored in the account
    pub poll_id: u64,
    #[max_len(280)]
    pub description: String,
    pub poll_start: u64,
    pub poll_end: u64,
    pub candidate_amount: u64,
}