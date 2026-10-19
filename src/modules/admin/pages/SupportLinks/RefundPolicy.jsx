import { useEffect } from "react";
import LandingHeader from "../../../worker/pages/LeandingHeader";
import LeadingFooter from "../../../worker/pages/LeandingFooter";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Refund Policy
          </h1>
          <p className="text-gray-500 mb-10">
            <strong>Last Updated:</strong> June 26, 2026
          </p>

          <div className="space-y-8 text-gray-700 leading-8">
            {/* Section 1: COMPANY REFUND & LIABILITY POLICY */}
            <section className="border-b border-gray-150 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                1. COMPANY REFUND & LIABILITY POLICY
              </h2>
              <p className="mb-4">
                Welcome to Anytime Global Pvt. Ltd. This policy outlines the refunds you receive when a worker cancels, and your financial liabilities (payouts) to the worker if you cancel a vacancy late.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1. "Pay Only For Joined Workers" Refund Rule
                  </h3>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      If you create a vacancy for 10 workers, but only 5 workers actually join and report for work, you will <strong className="text-gray-900">ONLY</strong> pay for those 5 workers.
                    </li>
                    <li>
                      Anytime Global will automatically issue a 100% Full Refund (Worker Wage + Service Fee) to your account for the 5 empty slots.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2. Refund Received by Company (If Worker Cancels Late)
                  </h3>
                  <p className="mb-3">
                    If a worker accepts your vacancy but cancels late or does a No-Show, Anytime Global protects your business. The penalty charged to the worker is directly <strong className="text-gray-900">credited</strong> to your Company Wallet as a Refund Compensation:
                  </p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Worker cancels more than 24 hours before shift: <strong className="text-gray-900">₹0 Refund</strong> (No penalty to worker, as we have time to find a free replacement).
                    </li>
                    <li>
                      Worker cancels within 24 to 6 hours before shift: Company receives <strong className="text-gray-900">50%</strong> of the Worker's Day 1 Wage as a refund credit.
                    </li>
                    <li>
                      Worker cancels within 6 to 3 hours before shift: Company receives <strong className="text-gray-900">75%</strong> of the Worker's Day 1 Wage as a refund credit.
                    </li>
                    <li>
                      Worker cancels less than 3 hours before shift (or No-Show): Company receives <strong className="text-gray-900">100%</strong> of the Worker's Day 1 Wage directly into the Company Wallet.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3. Refund Paid by Company to Worker (If Company Cancels Late)
                  </h3>
                  <p className="mb-3">
                    If you delete, deactivate, or cancel a vacancy after a worker has already joined/accepted it, you must pay a Refund/Compensation to the Worker for blocking their day:
                  </p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      You cancel more than 24 hours before shift: <strong className="text-gray-900">₹0 Penalty</strong>. Full 100% refund of your advance payment.
                    </li>
                    <li>
                      You cancel within 24 to 6 hours before shift: <strong className="text-gray-900">50%</strong> of Day 1 Wage will be cut from your balance and paid to the worker.
                    </li>
                    <li>
                      You cancel within 6 to 3 hours before shift: <strong className="text-gray-900">75%</strong> of Day 1 Wage will be cut from your balance and paid to the worker.
                    </li>
                    <li>
                      You cancel less than 3 hours before shift (or after shift starts): <strong className="text-gray-900">100%</strong> of Day 1 Wage + Travel/Conveyance Charges will be cut from your balance and paid to the worker because they lost their daily livelihood.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2: WORKER REFUND & PENALTY POLICY */}
            <section className="border-b border-gray-150 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                2. WORKER REFUND & PENALTY POLICY
              </h2>
              <p className="mb-4">
                Welcome to Anytime Global Pvt. Ltd. This policy protects your daily earnings. If a company cancels a vacancy late, you get a refund payout. However, if you cancel a job late, a penalty will be cut from your wallet and sent to the company.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1. Refund Received by Worker (If Company Cancels Late)
                  </h3>
                  <p className="mb-3">
                    If you accept a vacancy and the Company deletes, deactivates, or cancels it late, the Company will pay you a Refund/Compensation directly into your Worker Wallet:
                  </p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Company cancels more than 24 hours before shift: <strong className="text-gray-900">₹0 Refund</strong> (No compensation, you can join other vacancies).
                    </li>
                    <li>
                      Company cancels within 24 to 6 hours before shift: You receive <strong className="text-gray-900">50%</strong> of Day 1 Wage as a refund payout for blocking your day.
                    </li>
                    <li>
                      Company cancels within 6 to 3 hours before shift: You receive <strong className="text-gray-900">75%</strong> of Day 1 Wage as a refund payout.
                    </li>
                    <li>
                      Company cancels less than 3 hours before shift (or after you reach): You receive <strong className="text-gray-900">100%</strong> of Day 1 Wage + Travel/Conveyance Expenses paid directly to your wallet.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2. Penalty Deducted from Worker (If You Cancel Late)
                  </h3>
                  <p className="mb-3">
                    If you accept a vacancy but fail to report to work or cancel late, money will be deducted from your Worker Wallet and paid to the Company as a refund for disturbing their business:
                  </p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      You cancel more than 24 hours before shift: <strong className="text-gray-900">₹0 Deduction</strong>. Safe to cancel.
                    </li>
                    <li>
                      You cancel within 24 to 6 hours before shift: <strong className="text-gray-900">50%</strong> of Day 1 Wage will be cut from your wallet.
                    </li>
                    <li>
                      You cancel within 6 to 3 hours before shift: <strong className="text-gray-900">75%</strong> of Day 1 Wage will be cut from your wallet.
                    </li>
                    <li>
                      You cancel less than 3 hours before shift (or No-Show): <strong className="text-gray-900">100%</strong> of Day 1 Wage + Travel Charges will be cut from your wallet, and your account may be permanently blocked.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3. Important Wallet Rules
                  </h3>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      <strong className="text-gray-900">Minus (-) Wallet Balance:</strong> If your Worker Wallet goes into Minus (-) due to a cancellation penalty, this amount will be automatically cut from your very next job earnings or payouts.
                    </li>
                    <li>
                      <strong className="text-gray-900">Leaving Mid-Way:</strong> If you leave the workplace in the middle of a shift without informing the manager, you will get <strong className="text-gray-900">₹0 wage</strong>, and a 100% penalty will be cut from your wallet.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Help & Complaints Section */}
            <section className="bg-gray-100 p-6 md:p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Help & Complaints
              </h2>
              <p className="mb-6">
                If a Company or a Worker feels that any refund calculation or wallet penalty made by Anytime Global is incorrect or unfair, you can lodge an official complaint step-by-step:
              </p>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-900">Level 1 (Response within 4 hours)</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Email: <a href="mailto:hello@anytime.in" className="text-blue-600 hover:underline">hello@anytime.in</a> | Phone: 08069824660
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-900">Level 2 (Response within 48 hours)</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Email: <a href="mailto:grievance@anytime.in" className="text-blue-600 hover:underline">grievance@anytime.in</a> | Phone: 08069824660
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-900">Level 3 (Response within 6 days from CEO Office)</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Email: <a href="mailto:ceo-office@anytime.in" className="text-blue-600 hover:underline">ceo-office@anytime.in</a> | Phone: 08069824660
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <LeadingFooter />
    </>
  );
};

export default RefundPolicy;
