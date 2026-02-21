const BILL_DENOMINATIONS = [100, 50, 20, 10, 5, 1]

function calculateDenominations(payouts, availableBills) {
  const remainingBills = { ...availableBills }
  const results = []
  let totalBonus = 0

  for (const person of payouts) {
    let remaining = Math.round(person.payout)
    const breakdown = {}
    let allocated = 0

    for (const bill of BILL_DENOMINATIONS) {
      if (remaining <= 0) break    // stop if we've allocated the full payout
      if (!remainingBills[bill] || remainingBills[bill] === 0) continue  // skip if no bills of this denomination are left

      const needed = Math.floor(remaining / bill)
      const canUse = Math.min(needed, remainingBills[bill])

      if (canUse > 0) {
        breakdown[bill] = canUse
        allocated += canUse * bill
        remaining -= canUse * bill
        remainingBills[bill] -= canUse
      }
    }

    // unallocated money rolls into the bonus pool
    totalBonus += remaining

    results.push({
      name: person.name,
      payout: person.payout,
      allocated,
      breakdown
    })
  }

  return {
    results,
    remainingBills,
    totalBonus: parseFloat(totalBonus.toFixed(2))
  }
}

module.exports = { calculateDenominations }