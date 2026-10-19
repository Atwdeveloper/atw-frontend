import React, { useState, useRef, useCallback } from "react";
import { X, CheckCircle } from "lucide-react";

// ---------- FULL COMPANY TERMS (Principal Employer) ----------
const COMPANY_TERMS = `1. Purpose and Application
These Terms and Conditions are intended to govern the engagement of a company acting as the Principal Employer in relation to manpower supply, payroll management, attendance administration, statutory compliance support, and related workforce services to be rendered by a manpower contractor or service provider. The document is drafted in line with the attached service agreement template and expands each contractual point into a detailed set of operating, legal, commercial, and compliance conditions for use by the Principal Employer in a full-form agreement, onboarding pack, vendor master contract, or annexure to a manpower services arrangement.

These terms apply whenever the Principal Employer engages a contractor for supply of temporary, outsourced, contract, project-based, semi-skilled, skilled, unskilled, supervisory, administrative, payroll-managed, or support workforce at the Principal Employer's premises or any other approved worksite. These conditions should be read together with the commercial proposal, work order, deployment request, schedules, compliance annexures, rate charts, safety standards, and any site- specific instructions issued in writing.

2. Parties and Contractual Status
The contracting parties shall be the manpower service provider, referred to as the Service Provider or Contractor, and the company receiving the services, referred to as the Client or Principal Employer. Both parties shall be independent contracting entities, and nothing contained in these terms shall be construed as creating a partnership, joint venture, agency, or employer-employee relationship between the Principal Employer and the deployed workforce.

The Service Provider shall remain the sole and legal employer of all deployed personnel for all purposes including recruitment, appointment, attendance administration, wages, statutory remittances, disciplinary control, leave administration, separation processing, and settlement of legal dues. The Principal Employer shall exercise only such workplace supervision as is necessary for assignment of work, site discipline, productivity monitoring, safety compliance, and operational coordination, without assuming the role of direct employer.

3. Definitions and Interpretation
For the purpose of these terms, “Deployed Personnel” or “Contract Labour” means all persons supplied, deployed, assigned, engaged, or made available by the Service Provider to work at the Principal Employer's premises or designated location. “Services” shall include manpower supply, recruitment support, attendance capture, payroll processing, compliance documentation, statutory deposit management, onboarding administration, grievance coordination, and such other related services as may be specified in schedules or work orders.

“Confidential Information” shall include all pricing structures, worker databases, attendance data, payroll records, business processes, internal reports, software access, client information, trade methods, internal controls, and any proprietary operational or commercial information disclosed by either party. “Personal Data” shall include any information relating to an identified or identifiable individual, including worker identity records, attendance logs, wage details, bank information, Aadhaar-linked records where lawfully processed, and HR documentation processed during service delivery.

Headings are inserted for convenience and shall not affect interpretation. Words importing the singular shall include the plural and vice versa, and references to statutes shall include amendments, re-enactments, substitutions, codifications, and applicable state rules notified from time to time.

4. Scope of Services
The Service Provider shall supply manpower as per the Principal Employer's written requirement across approved categories such as unskilled, semi-skilled, skilled, supervisory, technical, administrative, warehouse, operations, housekeeping, field, support, or any other agreed category. The Service Provider shall also undertake recruitment, screening, deployment, replacement, onboarding, payroll administration, wage calculation, salary disbursement support, attendance reconciliation, compliance filing, and labour relations support in accordance with the service scope set out in the agreement schedules.

Deployment shall be made at the Principal Employer's premises or any other site mutually agreed in writing. The number of personnel may increase or decrease based on operational need, and the Principal Employer may revise the deployment count by giving prior written notice, with the original template providing a notice benchmark of 15 days.

5. Labour Law Compliance Framework
The Service Provider shall comply with all applicable Indian labour and employment laws identified in the attached agreement, including the Contract Labour (Regulation and Abolition) Act, 1970, Code on Wages, 2019, Code on Social Security, 2020, Industrial Relations Code, 2020, Occupational Safety, Health and Working Conditions Code, 2020, Payment of Wages Act, Minimum Wages Act, Employees' Provident Funds and Miscellaneous Provisions Act, Employees' State Insurance Act, Payment of Bonus Act, Payment of Gratuity Act, Equal Remuneration Act, Maternity Benefit Act, relevant Shops and Establishments law, and all applicable central and state enactments.

The Service Provider shall at all times maintain valid licences, registrations, renewals, and approvals required to render the services. Copies of all relevant registrations and licences shall be supplied to the Principal Employer within 7 days of execution of the agreement or within such shorter period as reasonably required for vendor empanelment, onboarding, audit, inspection, or statutory presentation.

Where Principal Employer registration or related compliance support is required under contract labour law or allied law, the Principal Employer shall provide timely documents, authorizations, and cooperation so that the Service Provider may complete the required formalities in the name of the Principal Employer where legally necessary. Delay by the Principal Employer in furnishing such documents shall proportionately extend any compliance-related timelines dependent on such records.

6. Employment Status and Non-Absorption
All deployed personnel shall remain employees of the Service Provider alone, and no clause, conduct, payment pattern, reporting line, site supervision, access card issuance, or attendance capture arrangement shall be interpreted as creating direct employment with the Principal Employer. The Principal Employer shall not issue appointment letters, salary revisions, disciplinary orders, transfer orders, confirmation letters, benefit commitments, or termination communications directly to any deployed worker unless mandated by law and routed through the Service Provider.

The Principal Employer may allocate work, define shifts, monitor output, ensure discipline at the worksite, and insist upon site-specific conduct and safety rules. However, any action affecting employment terms, wages, tenure, benefits, disciplinary proceedings, suspension, termination, transfer, or grievance adjudication shall be handled by the Service Provider after receiving the Principal Employer's written complaint, recommendation, or request.

No past deployment, long tenure, repeated renewal, or continuous engagement of a worker through the Service Provider shall create an obligation on the Principal Employer to absorb, regularize, continue, or directly employ such worker. Any exception to this principle must be specifically approved in writing and handled under the direct hiring and placement fee provisions set out in the agreement.

7. Wage Payment and Statutory Benefits
The Service Provider shall ensure that wages are calculated correctly based on attendance, shift records, overtime records where applicable, and statutory wage structure requirements. Wages shall be paid on or before the 7th day of the following month, or within such earlier statutory due date as may become applicable to the establishment, category, or strength of labour employed.

The Service Provider shall be solely responsible for payment of minimum wages, overtime wages, earned wages, salary arrears, bonus, gratuity, leave benefits, retrenchment compensation where applicable, and any other legally mandated monetary benefits. The Service Provider shall also deposit PF, ESI, Labour Welfare Fund, Professional Tax, and other statutory contributions within prescribed timelines and maintain registers, challans, returns, wage slips, and proof of remittance for inspection and sharing.

The Principal Employer's authorized representative shall remain entitled to witness wage disbursement or verify wage payment compliance where required under applicable law, and the attached template specifically contemplates the presence of the Principal Employer's representative during wage disbursement. The Service Provider shall furnish monthly wage statements, attendance reports, statutory challans, and supporting compliance records to the Principal Employer as part of invoice support and compliance assurance.

8. Principal Employer Protection in Case of Default
Although the Service Provider remains the legal employer, the attached agreement recognizes that the Principal Employer may be required under law to discharge unpaid wage or statutory liabilities if the contractor defaults. In such an event, the Principal Employer shall have an immediate and unconditional right to recover, deduct, set off, retain, or adjust all such amounts from any sums payable to the Service Provider under this or any other contract. If the Principal Employer is compelled to make direct wage payments, statutory deposits, settlement payments, compensation payments, or litigation-related payments on account of the Service Provider's failure, the Service Provider shall reimburse the full amount along with associated administrative cost, legal expense, interest exposure, and internal handling charges. Repeated or material non-compliance of this nature shall constitute a material breach entitling the Principal Employer to immediate termination and recovery of losses in addition to any liquidated damages stated in the contract.

9. Attendance, Records, and Payroll Inputs
The Service Provider shall maintain accurate attendance, shift, leave, overtime, and deployment records using biometric devices, RFID systems, mobile attendance tools, manual muster rolls, dashboards, or such other approved systems as mutually agreed. The attached schedule specifically includes attendance technology deployment, daily attendance tracking, real-time dashboard access, monthly reconciliation, leave tracking, and rostering support as part of the service package.

The Principal Employer shall approve or confirm attendance records, work completion records, shift certifications, or service validations within the agreed timeline so that payroll and invoicing are not delayed. If the Principal Employer fails to provide attendance confirmation within the agreed period, the Service Provider may raise invoices on the basis of system-generated attendance, jointly verified logs, or the last available authenticated records, subject to later adjustment where justified.

The Service Provider shall preserve attendance and wage records for the statutory retention period and shall make them available for audit, labour inspection, client verification, internal inquiry, or dispute resolution. Tampering with attendance systems, unauthorized proxy attendance, fabricated shift marking, or data manipulation by any deployed worker shall be treated as a serious breach requiring immediate replacement and corrective action.

10. Invoice, Billing, and Payment Conditions
The Service Provider shall raise a monthly invoice by the 5th day of the following month based on actual attendance, man-days worked, wage components, statutory costs, agreed margin, and applicable taxes. Each invoice shall be supported by attendance reports, wage registers, statutory compliance certificates, and PF/ESI challan copies in line with the attached template.

The Principal Employer shall verify the invoice within 5 working days of receipt and shall release payment within 30 days from the invoice date unless a genuine and documented dispute has been raised in accordance with the dispute procedure. Payments shall be made through banking channels such as NEFT, RTGS, IMPS, or account-payee cheque, and the template excludes cash payments exceeding INR 10,000.

If tax is deductible at source, TDS shall be deducted in accordance with law and, as contemplated in the template, only on the service provider's margin or management fee component and not on pure wage reimbursement, provided the tax position is contractually documented and legally sustainable. The Principal Employer shall issue TDS certificates within the contractual timeline, which the attached template states as 15 days from deduction.

11. Delayed Payment Consequences
If the Principal Employer fails to pay undisputed invoices by the payment due date, interest shall accrue at 18 percent per annum, calculated at 1.5 percent per month, from the day immediately following the due date until actual realization. If payment delay exceeds 45 days, additional recovery charges of INR 5,000 per invoice and legal or recovery costs may also become payable under the attached template.

If undisputed dues remain outstanding for more than 60 days from the due date, the Service Provider may suspend deployment of additional manpower, withdraw existing personnel upon 7 days' written notice, or invoke termination rights, subject to law and the operational criticality of the assignment. The attached agreement further provides that delay beyond 90 days is a ground for immediate termination by the Service Provider.

Where the Service Provider is unable to pay workers because the Principal Employer has withheld undisputed invoices without justification, and the Principal Employer becomes liable to make wage payments as Principal Employer, such payments shall not operate as waiver of the Service Provider's contractual remedies and may still be adjusted against outstanding invoices with continuing right to claim interest and charges.

12. Disputed Invoice Procedure
If the Principal Employer disputes an invoice, it shall notify the Service Provider in writing within 5 days of receipt, identifying the disputed line items, factual basis, supporting calculations, and relevant documents. The undisputed portion must still be paid within the original due date so that labour wages and statutory remittances are not prejudiced.

Both parties shall meet within 7 days to attempt good-faith resolution of the billing dispute, and the attached template permits suspension of interest on genuinely disputed amounts during a resolution period not exceeding 15 days. If the dispute remains unresolved after that period, the matter shall proceed through the agreed dispute resolution mechanism without affecting ongoing compliance obligations for current workforce deployment.

13. Facilities and Workplace Responsibilities of Principal Employer
The Principal Employer shall provide a safe, lawful, and reasonably equipped workplace for all deployed personnel working at its site. This shall include safe access, work areas, basic infrastructure, operating tools where site-provided, work instructions, site induction, and legally required welfare facilities such as rest rooms, potable drinking water, first aid arrangements, and canteen access wherever mandated.

The Principal Employer shall ensure that work conditions at the site comply with applicable occupational safety and health standards and shall not expose deployed personnel to unsafe processes, hazardous equipment, or prohibited work conditions without prior disclosure, safeguards, training, and legal compliance. In the event of accident, injury, unsafe occurrence, near miss, or statutory incident reportability arising from site conditions or Principal Employer negligence, the Principal Employer shall remain responsible to the extent provided in the indemnity and liability clauses.

The Principal Employer shall extend cooperation during labour inspections, compliance audits, accident investigations, and statutory inquiries, and shall immediately inform the Service Provider of any notice, summons, inspection, inquiry, complaint, or direction received from any labour, PF, ESI, factory, industrial safety, social security, or local authority concerning deployed personnel.

14. Supervision, Conduct, and Site Discipline
The Principal Employer may supervise work output, quality, attendance compliance, shift adherence, conduct, uniforms, hygiene, and site discipline for operational purposes. The Principal Employer may also require adherence to visitor control, access control, security protocol, PPE usage, confidentiality norms, anti-harassment policy, and client code of conduct applicable at the site.

However, the Principal Employer shall not directly impose fines, suspend wages, alter wage rates, issue charge sheets, dismiss workers, or promise regular employment to deployed personnel. Any misconduct, absence, insubordination, violence, harassment, intoxication, sabotage, theft, safety breach, data theft, or other actionable conduct shall be reported to the Service Provider for formal employer action, and the Service Provider shall take prompt remedial steps including removal or replacement where necessary.

15. Data Protection and Privacy Obligations
Both parties shall comply with the Digital Personal Data Protection Act, 2023 and all applicable data protection obligations referred to in the attached agreement. The Service Provider shall act as a data processor in relation to personal data handled for service performance and shall process personal data only for documented contractual purposes and lawful instructions of the Principal Employer.

The Service Provider shall implement robust technical, organizational, and physical security measures including encryption, role-based access control, strong password practices, multi-factor authentication, security audits, vulnerability checks, backup controls, restricted access, and employee confidentiality training, all of which are expressly reflected in the source template. Personal data shall be accessed only on a need-to-know basis and shall not be retained longer than necessary for contractual, legal, compliance, payroll, audit, or dispute resolution purposes.

The Principal Employer shall also protect login credentials, reports, worker data, dashboard access, and any exported or shared records received from the Service Provider. Neither party shall disclose personal data or confidential payroll information to unauthorized third parties except where required by law, internal audit, insurer demand, statutory authority, or lawful court process subject to appropriate safeguards.

16. Data Breach Notification and Assistance
In case of any actual, suspected, or reasonably apprehended data breach, unauthorized access, leakage, ransomware incident, credential compromise, record loss, or misuse of personal or confidential data, the affected party shall promptly notify the other party and, as stated in the attached agreement, no later than 24 hours from discovery or reasonable suspicion. Such notice shall include the nature of the incident, categories of data affected, approximate number of records or data subjects impacted, likely consequences, and remedial action taken or proposed.

The Service Provider shall cooperate with containment, investigation, mitigation, recovery, regulator response, and communication with affected persons where legally required. The Service Provider shall also reasonably assist the Principal Employer in responding to data subject requests involving access, correction, erasure, or portability insofar as those rights are recognized and operationalized under applicable law and the attached template.

17. Confidentiality Obligations
Each party shall keep strictly confidential all business, commercial, operational, legal, technical, financial, payroll, compliance, worker, pricing, and platform-related information received from the other party. Such information shall be used solely for performance of the contract and shall not be disclosed, copied, circulated, sold, sublicensed, or shared with third parties except with prior written consent or where disclosure is legally required.

Confidentiality obligations shall survive termination for 5 years as stated in the attached template. Upon expiry or termination, each party shall return, delete, or destroy confidential information, login credentials, reports, records, documents, and copies in accordance with the disclosing party's written instructions, subject to statutory retention rights and backup limitations.

18. Protection of Proprietary Information and Business Model
The Principal Employer acknowledges that the Service Provider's worker database, sourcing model, attendance system, payroll workflows, mobile applications, dashboards, algorithms, costing logic, vendor controls, and operating methods are proprietary and protected information under the agreement. The Principal Employer shall not copy, replicate, reverse engineer, decompile, extract, download, scrape, derive, benchmark for imitation, or otherwise misuse such systems or information beyond the limited contractual purpose for which access is granted.

The attached agreement further restricts the Principal Employer from developing or causing to be developed any attendance, payroll, workforce, or process infrastructure that substantially replicates the Service Provider's proprietary business model, technology, or processes during the contract period and for 3 years thereafter. Any theft or misappropriation of the worker database, replication of technology, or misuse of proprietary methods may attract significant liquidated damages and injunctive relief as expressly set out in the source template.

19. Direct Hiring Restriction and Non-Solicitation
The Principal Employer shall not directly or indirectly hire, engage, absorb, solicit, induce, interview for absorption, or otherwise employ any deployed worker on its own payroll or through a third party during the contract term and for 24 months after termination or after that worker's deployment ends, unless prior written consent is obtained from the Service Provider. The Principal Employer shall also not encourage deployed workers to resign, offer them alternate employment, route them through affiliates, or facilitate their introduction to third parties for employment purposes in circumvention of the agreement.

If the Principal Employer wishes to hire a deployed worker lawfully, it may do so only with the Service Provider's prior written consent, subject to full settlement of outstanding dues, payment of a one-time placement fee equal to 6 months of the monthly gross salary, and execution of a tripartite arrangement where required by the attached template. Where a worker voluntarily resigns from the Service Provider and independently approaches the Principal Employer after a 6-month cooling-off period without solicitation or inducement from the Principal Employer, the direct hiring restriction shall not apply according to the source document.

20. Liquidated Damages for Direct Hiring and Other Breaches
If the Principal Employer breaches the direct hiring restriction, liquidated damages shall be payable at an amount equal to 12 months multiplied by the monthly gross salary or total monthly cost of the hired personnel, including salary, allowances, employer statutory contributions, and service margin, as illustrated in the attached template. Such damages are expressly characterized in the source document as a genuine pre-estimate of loss and not as a penalty.

The attached matrix also provides for contractual exposure in other situations, including 18 percent annual interest plus INR 5,000 administrative recovery charge for delayed invoices beyond the threshold, actual damages up to INR 5,00,000 or 10 percent of annual contract value for certain data breach scenarios, INR 10,00,000 or 25 percent of annual contract value for database misappropriation, and INR 25,00,000 or 50 percent of annual contract value for replication of business model or technology, whichever is higher in the specified cases. Payment of liquidated damages shall not prevent the aggrieved party from seeking actual damages, injunctions, recovery costs, or other legal remedies where contractually or legally permissible.

21. Intellectual Property and Limited License
All intellectual property in the Service Provider's software, mobile applications, attendance systems, dashboards, reports architecture, databases, algorithms, operating methods, and service delivery tools shall remain exclusively vested in the Service Provider. The Principal Employer shall receive only a limited, non-exclusive, non-transferable, revocable license to access approved tools, dashboards, and reports solely for purposes of the manpower engagement.

The Principal Employer shall not sublicense access, share credentials with third parties, alter source code, remove ownership legends, or use the system for any unrelated business purpose. Data ownership shall operate as stated in the attached template, under which worker data collected through the platform is treated as jointly owned for operational purposes, the Principal Employer may access attendance and performance data of its deployed workforce, and the Service Provider retains ownership of aggregated and anonymized analytics.

22. Indemnity Structure
The Service Provider shall indemnify the Principal Employer against claims, liabilities, penalties, damages, and losses arising from its non-compliance with labour laws, non-payment of wages or statutory dues, negligence causing injury to deployed personnel, and breach of confidentiality or data protection obligations, as stated in the attached contract. This indemnity shall include legal fees, settlement costs, authority demands, back wages, interest, penalties, and actual internal response costs reasonably incurred by the Principal Employer due to the Service Provider's default.

The Principal Employer shall indemnify the Service Provider against claims arising from unsafe site conditions, negligence at the workplace, invoice non-payment causing wage default, unauthorized copying or misuse of proprietary information, and direct hiring in breach of the agreement. The indemnifying party shall defend, settle, or reimburse such claims promptly, subject to notification, cooperation, mitigation, and the contractual liability limitations where applicable.

23. Limitation of Liability
Except for breaches involving confidentiality, data protection, direct hiring restrictions, proprietary information misuse, fraud, or willful misconduct, the total liability of either party under the agreement shall not exceed the total service charges paid or payable during the 6 months immediately preceding the event giving rise to the claim. Neither party shall be liable for indirect, incidental, consequential, special, or punitive damages, including loss of business, profit, or data, except in the excluded categories specifically identified in the source agreement.

This limitation is intended to allocate commercial risk while preserving full remedies for intentional misconduct and high-sensitivity contractual breaches. Nothing in this clause shall excuse either party from payment obligations already accrued, return of confidential information, compliance with court or arbitral orders, or statutory liabilities that cannot lawfully be excluded by contract.

24. Term, Renewal, and Review
The agreement shall commence on the effective date and continue for the initial term stated in the contract, after which it shall automatically renew for successive 1-year periods unless terminated in accordance with the termination clause. During the contract term, the parties may review deployment levels, rates, service quality, compliance record, statutory wage revisions, process changes, and business continuity requirements.

The Service Provider shall provide annual price revision notice, and the attached schedule specifies 60 days' prior notice of proposed price revision, taking into account changes in minimum wages, statutory contributions, and inflation. Any revision shall become effective only from the next billing cycle after mutual agreement unless the change is directly mandated by law and contract structure provides automatic pass-through.

25. Termination Rights
Either party may terminate the agreement for convenience by giving 90 days' prior written notice as per the attached template. Either party may also terminate immediately for cause if the other party commits a material breach and fails to cure it within 30 days, becomes insolvent, enters liquidation, ceases operations, or loses a required licence or registration.

The Service Provider may additionally terminate immediately for payment delays exceeding 90 days, direct hiring violations, or breach of confidentiality or data protection obligations by the Principal Employer. The Principal Employer may terminate immediately if the Service Provider fails to pay wages for 2 consecutive months, loses its contract labour registration or licence, or causes a material data breach through negligence.

26. Effects of Terminations
Upon termination or expiry, the Principal Employer shall clear all undisputed outstanding invoices and dues within 15 days, and the Service Provider shall withdraw deployed personnel within the notice period or other mutually agreed transition period. Both parties shall return or destroy confidential information, and the Principal Employer shall discontinue use of the Service Provider's technology platforms and credentials.

Rights and obligations accrued prior to termination shall survive, and the attached template specifically preserves the continuing effect of data protection, confidentiality, direct hiring restrictions, intellectual property protections, indemnity obligations, and dispute resolution provisions. Termination shall not prejudice recovery of unpaid dues, liquidated damages, indemnity claims, or injunctive relief already triggered by prior breach.

27. Force Majeure
Neither party shall be liable for failure or delay in performing obligations to the extent prevented by force majeure events such as acts of God, natural disasters, epidemics, pandemics, war, terrorism, civil unrest, government action, lockdowns, strikes, or other events beyond reasonable control, as described in the attached agreement. The affected party shall notify the other within 7 days, provide evidence of the force majeure event, and take reasonable steps to mitigate impact and resume performance.

If the force majeure event continues for more than 90 days, either party may terminate the agreement on 30 days' written notice without further liability except payment for services already rendered up to termination. Force majeure shall not excuse payment of dues already accrued before the event or prevent reasonable protective action for labour safety, data security, or statutory preservation duties.

28. Dispute Resolution and Jurisdiction
Any dispute, controversy, or claim arising out of or in connection with the agreement shall first be escalated for amicable resolution through senior management discussions within 15 days of written notice of dispute. If not resolved, the dispute shall be referred to mediation to be completed within 30 days, followed by arbitration under the Arbitration and Conciliation Act, 1996 if mediation fails.

The attached template provides for a sole arbitrator mutually appointed by the parties, failing which appointment may be made by the Rajasthan High Court, with Jaipur, Rajasthan as seat and venue and English as the language of arbitration. Subject to the arbitration clause, courts at Jaipur, Rajasthan shall have exclusive jurisdiction, and either party may seek interim or permanent injunctive relief for confidentiality, direct hiring, or intellectual property breaches.

29. Notices, Documentation, and Communication
All notices under the agreement shall be in writing and may be served by personal delivery, registered post, speed post, or email with delivery confirmation to the designated contact details of the parties as contemplated in the attached template. Operational communication relating to attendance, invoice queries, worker replacement, safety issues, labour complaints, deployment requirements, and compliance submissions may also be exchanged through designated email IDs, workflow platforms, or approved reporting channels, but formal legal notices should follow the notice clause.

The Principal Employer shall maintain updated contact details for authorized representatives handling operations, accounts, HR, legal, compliance, and site administration so that the Service Provider can route approvals, notices, and escalations without delay. Any change in address, contact person, or notice details shall be communicated promptly in writing to remain effective.

30. General Commercial and Legal Provisions
The agreement, along with all schedules, work orders, annexures, rate cards, and written amendments, shall constitute the entire agreement between the parties and supersede prior oral or written understandings on the same subject. No modification, waiver, amendment, deviation, or relaxation shall be valid unless recorded in writing and signed by authorized representatives of both parties.

If any provision is held invalid or unenforceable, the remaining provisions shall continue in full effect and the parties shall substitute the invalid provision with a valid clause that most closely reflects the original commercial intent. No waiver of one breach shall operate as waiver of any future breach, and neither party may assign the agreement without prior written consent except to a lawful successor in merger, acquisition, or sale of substantially all assets as recognized in the attached template.

31. Service Levels and Operational Expectations
The attached schedule sets measurable service expectations including deployment of requested manpower within 7 working days, replacement of absent or unsuitable workers within 24 hours, wage disbursement on or before the 7th of the following month, PF and ESI deposits within due dates, monthly invoice submission by the 5th, attendance reporting on a daily automated basis with monthly consolidation by the 2nd, response to queries within 24 working hours, worker grievance resolution within 72 hours, and compliance reports by the 10th of the following month. These service levels may be adopted by the Principal Employer as binding operational commitments and linked to escalation, service credits, replacement requirements, or termination review in the final agreement.

The Principal Employer shall reasonably cooperate in achievement of these service levels by issuing timely manpower requisitions, approving attendance, sharing shift plans, enabling site access, and avoiding delayed operational decisions that hinder compliance or payroll processing. Persistent failure by either party to support service levels may be treated as service deficiency or operational breach depending on the facts and contractual allocation of responsibility.

32. Pricing Principles and Cost Structure
The pricing schedule in the attached template contemplates a build-up of monthly charges through basic wages, allowances, employer statutory contributions, leave and bonus provisions, service margin, and GST on the service component. Actual rates are to be determined based on worker count, skill category, location, applicable minimum wages, working hours, shifts, and scope of added services.

The sample pricing provided in the source template for an unskilled worker in Rajasthan reflects a total monthly cost of INR 20,090 after adding wage components, statutory costs, leave and bonus provisioning, 15 percent service margin, and GST on the margin component. This illustration can be used as a costing framework only and should be updated as per actual notified minimum wages, social security applicability, bonus assumptions, and contract-specific commercials.

33. Recommended Drafting Use
This detailed T&C text may be used as the Principal Employer section of a master service agreement, as a standalone terms and conditions annexure, or as a policy-backed legal schedule for vendor onboarding and contract labour engagement. Before execution, the company should fill all blanks relating to party names, addresses, effective date, deployment location, pricing, notice contacts, and site-specific compliance requirements, while also obtaining legal vetting for current enforceability of restrictive covenants, labour code implementation status, and state-specific compliance nuances.

For best use in practice, the Principal Employer should issue these terms together with vendor code of conduct, EHS requirements, anti-sexual-harassment compliance expectations, background verification standards, wage structure annexure, escalation matrix, invoice checklist, statutory proof checklist, and document submission calendar.`;

// ---------- MAIN COMPONENT ----------
const CompanyTermsAcceptance = ({ onClose, onAccept }) => {
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
            Company Terms & Conditions
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
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl">
              <p className="text-indigo-100 text-sm mt-1">
                Scroll to the end to enable acceptance
              </p>
            </div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-5 space-y-4 text-gray-700 max-h-[55vh]"
            >
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {COMPANY_TERMS}
              </pre>
              <div className="text-sm text-gray-500 italic mt-4">
                (Scroll to the end to accept)
              </div>
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
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Company Terms
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyTermsAcceptance;
