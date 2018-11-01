export default {
  plans: [
    'codepilot-free-plan',
    'codepilot-protrial',
    'codepilot-trial60',
    'codepilot-trial30',
    'test-codepilot-free-plan',
    'test-codepilot-protrial',
    'test-codepilot-trial60',
    'test-codepilot-trial30'
  ],
  getFreePlans() {
    return this.plans.filter(plan => plan.includes('free'))
  },
  getTrialPlans() {
    return this.plans.filter(plan => plan.includes('trial'))
  }
}
