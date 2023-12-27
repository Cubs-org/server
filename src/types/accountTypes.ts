export type Account = {
    status: 'active' | 'inactive' | 'pending';
    accountType: 'free' | 'plus' | 'business' | 'enterprise';
    planType: 'perMonth' | 'perYear' | 'perThreeYears';
    paymentType: 'creditCard' | 'debitCard' | 'bankSlip';
}