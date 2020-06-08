export const REGISTER_DAMAGE = 'REGISTER_DAMAGE';

export function registerDamage({
  abilityName,
  targetName,
  amount,
  type: damageType
}) {
  return {
    type: REGISTER_DAMAGE,
    abilityName,
    targetName,
    amount,
    damageType
  };
}
