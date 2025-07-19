const anchor = require('@coral-xyz/anchor');
const { Program } = require('@coral-xyz/anchor');
const { PublicKey } = require('@solana/web3.js');
const { startAnchor } = require("solana-bankrun");
const { BankrunProvider } = require("anchor-bankrun");

const IDL = require("../target/idl/voting.json");
const votingAddress = new PublicKey("LDEz3SvL4yt5v783vXcewrHg2pNz1mBRbyM2YLLDKo1");

describe('Voting', () => {
  it('initializePoll', async () => {
    console.log('🚀 Starting voting test...');
    
    try {
      console.log('1. Starting bankrun context...');
      const context = await startAnchor("", [{name: "voting", programId: votingAddress}], []);
      console.log('✓ Context created');

      console.log('2. Creating BankrunProvider...');
      const provider = new BankrunProvider(context);
      console.log('✓ BankrunProvider created');

      console.log('3. Creating Program instance...');
      const votingProgram = new Program(IDL, provider);
      console.log('✓ Program created');

      console.log('4. Generating PDA for poll...');
      const pollId = new anchor.BN(1);
      const [pollPda] = PublicKey.findProgramAddressSync(
        [pollId.toArrayLike(Buffer, "le", 8)],
        votingAddress
      );
      console.log('✓ Poll PDA:', pollPda.toString());

      console.log('5. Calling initializePoll...');
      const tx = await votingProgram.methods
        .initializePoll(
          pollId,
          "Who is the next president of the United States?",
          new anchor.BN(0),
          new anchor.BN(1859508293)
        )
        .accounts({
          poll: pollPda,
          signer: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log('✅ Transaction signature:', tx);

      console.log('6. Fetching and verifying poll account...');
      const pollAccount = await votingProgram.account.poll.fetch(pollPda);
      console.log('✅ Poll created successfully!');
      console.log('   Poll ID:', pollAccount.pollId.toString());
      console.log('   Description:', pollAccount.description);
      console.log('   Poll Start:', pollAccount.pollStart.toString());
      console.log('   Poll End:', pollAccount.pollEnd.toString());
      console.log('   Candidate Amount:', pollAccount.candidateAmount.toString());

      // Add some basic assertions
      if (pollAccount.pollId.toString() !== "1") {
        throw new Error(`Expected poll ID 1, got ${pollAccount.pollId.toString()}`);
      }
      if (pollAccount.description !== "Who is the next president of the United States?") {
        throw new Error(`Description mismatch`);
      }
      console.log('✅ All assertions passed!');
      
    } catch (error) {
      console.log('❌ Error occurred:', error.message);
      console.log('❌ Stack trace:', error.stack);
      throw error;
    }
  });
});