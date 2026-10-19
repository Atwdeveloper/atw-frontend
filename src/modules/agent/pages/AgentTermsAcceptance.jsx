import React, { useState, useRef, useCallback } from "react";
import { X, CheckCircle } from "lucide-react";

// ---------- FULL AGENT TERMS ----------
const AGENT_TERMS = `1. Core Agreement

The main service agreement should begin with the parties, effective date, and purpose of the engagement. It should clearly state that the Service Provider supplies manpower, manages payroll, handles attendance, and ensures statutory compliance, while the Client receives deployed personnel under a contract manpower model.

The definitions section should explain terms such as Contract Labour, Deployed Personnel, Services, Confidential Information, Personal Data, Monthly Invoice, and Direct Hiring. This matters because later clauses on wages, confidentiality, non-solicitation, and liability rely on these definitions.

The scope of services should spell out recruitment, deployment, payroll processing, statutory deductions, attendance tracking, onboarding, grievance handling, and statutory filings. It should also include deployment location, manpower quantity, replacement timelines, and service-level expectations.

2. Compliance Terms

The agreement should state that the Service Provider will comply with all applicable Indian labour laws, including the Contract Labour (Regulation and Abolition) Act, 1970, wage laws, social security laws, bonus, gratuity, maternity, and state-specific shop and establishment laws. It should also say that valid licenses and registrations will be maintained throughout the contract term.

The legal employer clause should confirm that the Service Provider remains the employer of deployed workers, while the Client is only the Principal Employer. The document should also cover the statutory responsibility split for wages, PF, ESI, gratuity, bonus, and other dues.

The wage clause should say that wages are paid on or before the 7th of the following month and that statutory deductions are deposited within prescribed timelines. It should also explain that the Client may have liability if the Service Provider defaults, and that the Client may deduct or recover such amounts from the Service Provider.

3. Data and Confidentiality

The confidentiality section should define confidential information broadly to include business data, pricing, client lists, worker databases, attendance records, payroll records, and technology systems. It should prohibit disclosure except where legally required and should require return or destruction of confidential material on termination.

The data protection clause should align with the Digital Personal Data Protection Act, 2023 and explain that Personal Data will be processed only for the contract purpose and according to documented instructions. It should also require reasonable security measures such as encryption, access control, audits, secure backups, and staff training.

A breach notification clause should require prompt notice, ideally within 24 hours, if personal data or confidential data is compromised. The notice should include the nature of the breach, affected records, expected consequences, and mitigation steps.

4. Worker Terms

The worker T&C should confirm that the worker is employed by the Service Provider, not the Client, even when working at the Client's premises. It should make clear that the worker must follow attendance rules, safety rules, conduct standards, site instructions, and payroll formalities.

The worker section should cover documentation, background checks, identity records, bank details, statutory enrollment, and changes in personal information. It should also state that falsification of documents, proxy attendance, negligence, misconduct, and safety violations can lead to disciplinary action.

The worker document should further explain wages, PF, ESI, leave, overtime approval, grievance reporting, injury reporting, resignation, handover, and full-and-final settlement. It should preserve statutory rights while still allowing site-level discipline, removal, reassignment, or termination according to law and policy.

5. Agent Terms

The agent T&C should define the agent as an independent contractor appointed only for approved sourcing, referrals, introductions, and business development support. It should also state that the agent cannot bind the Service Provider, quote final pricing, promise manpower deployment, or collect money unless expressly authorized.

The lead ownership clause should explain when a lead is considered valid and how duplication, diversion, or bypassing is prohibited. It should say that a lead is eligible only when documented and acknowledged by the Service Provider, and that disputed ownership will be resolved using the company's records.

The commission section should define the basis of payout, the event triggering payment, the documentation needed, the timeline, and the circumstances for clawback. It should also include confidentiality, non-circumvention, conflict of interest disclosure, tax handling, and termination rights for fraud, misconduct, or misrepresentation.

6. Payment and Liability

The commercial section should set out invoice timing, verification windows, payment due dates, late payment interest, and additional charges for prolonged delay. It should also say that undisputed amounts remain payable even when a portion of the bill is disputed.

The agreement should include service charge components such as wages, statutory contributions, management fee, administrative charges, and GST. It should also include sample pricing logic so the Client understands how monthly manpower billing is calculated.

A liability clause should allocate responsibility for wage default, unsafe premises, confidentiality breaches, data loss, direct hiring, and unauthorized use of technology. A limitation-of-liability clause can cap ordinary exposure, while preserving carve-outs for fraud, confidentiality, data breaches, and willful misconduct.

7. Termination and Disputes

The termination section should provide for convenience termination with notice, termination for cause, immediate termination for serious breach, and termination rights linked to non-payment, compliance failure, or data breach. It should also explain post-termination duties such as payment of dues, withdrawal of deployed personnel, return of property, and preservation of surviving clauses.

The dispute resolution clause should follow a step-by-step process of internal resolution, mediation, and then arbitration in Jaipur under Indian law. It should also retain the right to seek injunctions for confidentiality, direct hiring, or intellectual property breaches.

Force majeure, assignment, notices, severability, waiver, governing law, and relationship clauses should also be included so the document is complete and enforceable in structure. These clauses help prevent gaps when business conditions change or unexpected events affect performance.

8. Practical Format

For best use, split the material into three separate documents: client agreement T&C, worker T&C, and agent T&C. That makes the language more readable and avoids mixing commercial, employment, and referral obligations in one dense document.

A practical implementation pack should include schedule annexures for scope of services, pricing, SLA, worker list, safety requirements, referral commission matrix, and data protection instructions. This keeps the main terms stable while allowing operational details to be updated through schedules.

(Scroll to the end to accept)`;

// ---------- MAIN COMPONENT ----------
const AgentTermsAcceptance = ({ onClose, onAccept }) => {
  const scrollRef = useRef(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (container) {
      const isBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 5;
      if (isBottom && !scrolledToBottom) setScrolledToBottom(true);
      else if (!isBottom && scrolledToBottom) setScrolledToBottom(false);
    }
  }, [scrolledToBottom]);

  const handleCheckboxChange = () => {
    if (scrolledToBottom) setTermsAccepted(!termsAccepted);
  };

  const handleAccept = () => {
    if (termsAccepted) {
      if (onAccept) onAccept();
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Terms and Conditions for Agent
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={28} />
            </button>
          )}
        </div>

        {/* Terms Content */}
        <div className="flex-1 overflow-hidden p-6 overflow-y-auto">
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
            <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-t-xl">
              <p className="text-amber-100 text-sm mt-1">
                Scroll to the end to enable acceptance
              </p>
            </div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-5 space-y-4 text-gray-700 max-h-[55vh]"
            >
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {AGENT_TERMS}
              </pre>
            </div>
            <div className="border-t p-4 bg-white rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <label
                className={`flex items-center gap-2 cursor-pointer ${!scrolledToBottom ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={handleCheckboxChange}
                  disabled={!scrolledToBottom}
                  className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Agent Terms
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Accept Button */}
      </div>
    </div>
  );
};

export default AgentTermsAcceptance;
