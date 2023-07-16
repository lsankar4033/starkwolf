import { useContract } from "@starknet-react/core";

const testAddr =
  "0x0252d0b9de0970c6bff3074a3c601b7b6077456b90eab0ad308a54b7261b7cea";

const testABI = [
  {
    type: "impl",
    name: "OwnableImpl",
    interface_name: "cairo_vote::ownable::OwnableTrait",
  },
  {
    type: "interface",
    name: "cairo_vote::ownable::OwnableTrait",
    items: [
      {
        type: "function",
        name: "transfer_ownership",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_owner",
        inputs: [],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "init_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "cairo_vote::ownable::Ownable::OwnershipTransferred1",
    kind: "struct",
    members: [
      {
        name: "prev_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "cairo_vote::ownable::Ownable::Event",
    kind: "enum",
    variants: [
      {
        name: "OwnershipTransferred1",
        type: "cairo_vote::ownable::Ownable::OwnershipTransferred1",
        kind: "nested",
      },
    ],
  },
];

export default function ContractTest() {
  const { contract } = useContract({
    address: testAddr,
    abi: testABI,
  });

  return <div>contract addr: {contract?.address}</div>;
}
