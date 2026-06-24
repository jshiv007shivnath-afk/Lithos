import { useState, ChangeEvent, FormEvent } from 'react';
import { CreditCard, ShieldCheck, Lock, ChevronRight, HelpCircle, CheckCircle, Ticket, FileText } from 'lucide-react';
import { User, PaymentReceipt } from '../types';
import { db, doc, getDoc, setDoc, updateDoc } from '../lib/firebase';

interface CheckoutPortalProps {
  user: User | null;
  itemToBuy: {
    type: 'course' | 'subscription';
    id: string;
    title: string;
    price: number;
  };
  onSuccess: (receipt: PaymentReceipt) => void;
  onCancel: () => void;
}

export default function CheckoutPortal({ user, itemToBuy, onSuccess, onCancel }: CheckoutPortalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState<PaymentReceipt | null>(null);

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces every 4 digits
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.slice(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'LITHOS20') {
      setDiscount(itemToBuy.price * 0.2); // 20% discount
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try LITHOS20 for a 20% deep time discount!');
    }
  };

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setProcessStep(1); // Connecting to secure gateway...

    try {
      // Simulate network / validation hops beautifully
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setProcessStep(2); // Authorizing amount...
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProcessStep(3); // Recording to ledger...

      const finalPrice = Math.max(0, itemToBuy.price - discount);
      const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';
      const txnId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

      const receipt: PaymentReceipt = {
        id: txnId,
        userId: user?.uid || 'anonymous',
        itemType: itemToBuy.type,
        itemId: itemToBuy.id,
        itemName: itemToBuy.title,
        amount: finalPrice,
        timestamp: new Date().toISOString(),
        cardLast4: last4,
        status: 'success',
      };

      // Real secure ledger storage in Firestore
      const receiptDocRef = doc(db, 'receipts', txnId);
      await setDoc(receiptDocRef, receipt);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);

        let enrolled: string[] = [];
        let activeSub: string | null = null;
        let balance = 100;

        if (userSnap.exists()) {
          const uData = userSnap.data() as User;
          enrolled = uData.enrolledCourses || [];
          activeSub = uData.activeSubscription || null;
          balance = uData.balance ?? 100;
        }

        if (itemToBuy.type === 'course') {
          if (!enrolled.includes(itemToBuy.id)) {
            enrolled = [...enrolled, itemToBuy.id];
          }
        } else {
          activeSub = itemToBuy.id;
        }

        const updatedBalance = Math.max(0, balance - 10);

        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email || email,
          displayName: user.displayName || nameOnCard || '',
          enrolledCourses: enrolled,
          activeSubscription: activeSub,
          balance: updatedBalance
        }, { merge: true });
      }

      setCreatedReceipt(receipt);
      setSuccess(true);
    } catch (err) {
      console.error('Payment Processing Error:', err);
      alert('An error occurred while securing your transaction. Your card was not charged.');
    } finally {
      setProcessing(false);
    }
  };

  const finalPrice = Math.max(0, itemToBuy.price - discount);

  if (success && createdReceipt) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 text-center text-white relative shadow-xl overflow-hidden">
          {/* Subtle success lights */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-playfair italic mb-2">Payment Confirmed!</h2>
          <p className="text-white/60 text-sm max-w-md mx-auto mb-8">
            Your geological ledger has been synced. You have unlocked access to <strong>{itemToBuy.title}</strong>.
          </p>

          {/* Receipt display */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left max-w-md mx-auto mb-8 font-mono text-xs text-white/80 space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2 text-white/50">
              <span>LITHOS LEDGER RECEIPT</span>
              <span>OFFICIAL SEAL</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="text-white font-bold">{createdReceipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Item Description:</span>
              <span className="text-white">{createdReceipt.itemName}</span>
            </div>
            <div className="flex justify-between">
              <span>Date/Time (UTC):</span>
              <span>{new Date(createdReceipt.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Type:</span>
              <span>Card ending in •••• {createdReceipt.cardLast4}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-sm font-bold text-white">
              <span>Total Debited:</span>
              <span className="text-[#e8702a]">${createdReceipt.amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <button
              onClick={() => onSuccess(createdReceipt)}
              className="w-full bg-[#e8702a] hover:bg-[#d2611f] text-white font-medium text-sm py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.print()}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1 bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 text-white relative">
          <h2 className="text-2xl font-playfair italic mb-6">Payment Authorization</h2>

          {processing ? (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 rounded-full border-4 border-t-[#e8702a] animate-spin" />
                <Lock className="w-8 h-8 text-white/80 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Securing Geological Ledger</h3>
                <div className="text-sm text-white/50 font-mono">
                  {processStep === 1 && 'Connecting to secure token vault...'}
                  {processStep === 2 && 'Authorizing deposit amount...'}
                  {processStep === 3 && 'Syncing blocks on central DB ledger...'}
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-48 bg-white/10 h-1 rounded-full mx-auto overflow-hidden">
                <div 
                  className="bg-[#e8702a] h-full transition-all duration-1000" 
                  style={{ width: `${(processStep / 3) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    placeholder="e.g. Marie Tharp"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Email Receipt</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Card Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/40 pointer-events-none">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">CVC / CVV</label>
                  <input
                    type="password"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="•••"
                    maxLength={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10 text-xs text-white/70 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  <strong>Lithos Cryptographic Vault</strong>. All transmissions are encrypted using standard TLS protocol. Your actual card digits never touch server disks.
                </span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium text-sm py-3 rounded-xl transition-all"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#e8702a] hover:bg-[#d2611f] text-white font-medium text-sm py-3 rounded-xl transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-[#e8702a]/10"
                >
                  Pay ${finalPrice.toFixed(2)} USD
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 bg-[#111111] border border-white/10 rounded-3xl p-6 text-white h-fit space-y-6">
          <h3 className="text-lg font-playfair italic">Order Summary</h3>

          <div className="space-y-3 pb-4 border-b border-white/10">
            <div className="text-xs text-white/40 uppercase tracking-wider">Item Type</div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{itemToBuy.title}</span>
              <span className="text-sm font-mono text-white/80">${itemToBuy.price}.00</span>
            </div>
          </div>

          {/* Promo Code Input */}
          <div className="space-y-2">
            <div className="text-xs text-white/40">Promotional Code</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try LITHOS20"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#e8702a] font-mono text-white"
              />
              <button
                type="button"
                onClick={applyPromo}
                disabled={promoApplied}
                className="bg-white/10 hover:bg-white/20 disabled:bg-emerald-900/40 disabled:text-emerald-300 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              >
                {promoApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
            {promoApplied && (
              <p className="text-[10px] text-emerald-400 font-mono">20% deep time discount applied successfully!</p>
            )}
          </div>

          {/* Totals */}
          <div className="space-y-2.5 pt-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Subtotal:</span>
              <span>${itemToBuy.price.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Discount (LITHOS20):</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-white/60">
              <span>Security Vault Fee:</span>
              <span className="text-emerald-500 font-mono">FREE</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/10 text-base font-bold text-white">
              <span>Total due:</span>
              <span className="text-[#e8702a] font-mono">${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
