/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getBytesDecoder,
  getBytesEncoder,
  getStructDecoder,
  getStructEncoder,
  transformEncoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
  type IAccountMeta,
  type IInstruction,
  type IInstructionWithAccounts,
  type IInstructionWithData,
  type ReadonlyUint8Array,
  type WritableAccount,
} from 'gill';
import { COUNTER_PROGRAM_ADDRESS } from '../programs';
import { getAccountMetaFactory, type ResolvedAccount } from '../shared';

export const INCREMENT_DISCRIMINATOR = new Uint8Array([
  11, 18, 104, 9, 104, 174, 59, 33,
]);

export function getIncrementDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(INCREMENT_DISCRIMINATOR);
}

export type IncrementInstruction<
  TProgram extends string = typeof COUNTER_PROGRAM_ADDRESS,
  TAccountCounter extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountCounter extends string
        ? WritableAccount<TAccountCounter>
        : TAccountCounter,
      ...TRemainingAccounts,
    ]
  >;

export type IncrementInstructionData = { discriminator: ReadonlyUint8Array };

export type IncrementInstructionDataArgs = {};

export function getIncrementInstructionDataEncoder(): Encoder<IncrementInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([['discriminator', fixEncoderSize(getBytesEncoder(), 8)]]),
    (value) => ({ ...value, discriminator: INCREMENT_DISCRIMINATOR })
  );
}

export function getIncrementInstructionDataDecoder(): Decoder<IncrementInstructionData> {
  return getStructDecoder([
    ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
  ]);
}

export function getIncrementInstructionDataCodec(): Codec<
  IncrementInstructionDataArgs,
  IncrementInstructionData
> {
  return combineCodec(
    getIncrementInstructionDataEncoder(),
    getIncrementInstructionDataDecoder()
  );
}

export type IncrementInput<TAccountCounter extends string = string> = {
  counter: Address<TAccountCounter>;
};

export function getIncrementInstruction<
  TAccountCounter extends string,
  TProgramAddress extends Address = typeof COUNTER_PROGRAM_ADDRESS,
>(
  input: IncrementInput<TAccountCounter>,
  config?: { programAddress?: TProgramAddress }
): IncrementInstruction<TProgramAddress, TAccountCounter> {
  // Program address.
  const programAddress = config?.programAddress ?? COUNTER_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    counter: { value: input.counter ?? null, isWritable: true },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [getAccountMeta(accounts.counter)],
    programAddress,
    data: getIncrementInstructionDataEncoder().encode({}),
  } as IncrementInstruction<TProgramAddress, TAccountCounter>;

  return instruction;
}

export type ParsedIncrementInstruction<
  TProgram extends string = typeof COUNTER_PROGRAM_ADDRESS,
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    counter: TAccountMetas[0];
  };
  data: IncrementInstructionData;
};

export function parseIncrementInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedIncrementInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 1) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      counter: getNextAccount(),
    },
    data: getIncrementInstructionDataDecoder().decode(instruction.data),
  };
}
