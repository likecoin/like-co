export async function formatDesmosChainLinkProof(
  address,
  proof,
  chainId = 'likecoin',
) {
  return {
    address: {
      '@type': '/desmos.profiles.v1beta1.Bech32Address',
      value: address,
      prefix: 'cosmos',
    },
    proof,
    chain_config: { name: chainId },
  };
}

export default formatDesmosChainLinkProof;
