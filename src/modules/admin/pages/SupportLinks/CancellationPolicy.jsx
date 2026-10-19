import { useEffect } from "react";
import LandingHeader from "../../../worker/pages/LeandingHeader";
import LeadingFooter from "../../../worker/pages/LeandingFooter";

const CancellationPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cancellation Policy
          </h1>
          <p className="text-gray-500 mb-10">
            <strong>Last Updated:</strong> June 26, 2026
          </p>

          <div className="space-y-8 text-gray-700 leading-8">
            {/* Section 1: Cancellation Policy for Service Providers (Workers) */}
            <section className="border-b border-gray-150 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                1. Cancellation Policy for Service Providers (Workers)
              </h2>
              <p className="mb-4">
                You acknowledge that once you have accepted a booking through the Anytime Work (on Site, Mobile Apps, or via other channels), you are contractually obligated to provide the Professional Service at the agreed Service Time and Designated Premises. Repeated cancellations or failure to provide the agreed Service may negatively impact the reliability of the Platform and cause inconvenience to Service Seekers.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1.1 Free Cancellation
                  </h3>
                  <p className="mb-3">
                    A Service Provider is entitled to exercise a right of cancellation regarding an accepted booking without the imposition of any financial penalty, administrative sanction, or punitive record, provided that such cancellation is executed in strict accordance with the following defined parameters:
                  </p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      <strong className="text-gray-900">Standard Advance Notice:</strong> The cancellation must be formally submitted through the Platform at least twenty-four (24) hours prior to the commencement of the scheduled Service Time;
                    </li>
                    <li>
                      <strong className="text-gray-900">Immediate Grace Period:</strong> In instances where the Service Time is scheduled to occur within twenty-four (24) hours of the booking, the Service Provider may cancel within ten (10) minutes of the initial acceptance (the "Grace Period"), representing a window for immediate error correction or unforeseen scheduling conflicts.
                    </li>
                  </ul>
                  <p className="mt-3">
                    Cancellations performed in full compliance with these specific criteria shall be deemed "Authorized Cancellations" and shall not result in the recording of a Late Cancellation, any diminution of the Service Provider's performance metrics, or the withholding of any accrued or promotional earnings.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1.2 Late Cancellation and Operational Impact
                  </h3>
                  <p className="mb-3">
                    The Service Provider acknowledges that late cancellations significantly impede the operational efficiency of the Anytime Work Platform, disrupt the scheduling of Service Seekers, and prevent other eligible Professional Service providers from securing opportunities. In instances where a Service Provider cancels an accepted booking:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Within twelve (12) hours but more than three (3) hours before the Service Time; or</li>
                    <li>After the applicable Grace Period has expired,</li>
                  </ul>
                  <p className="mb-2 font-semibold">ATW may, at its sole discretion:</p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Record a Late Cancellation against the Service Provider;</li>
                    <li>Reduce the Service Provider's performance score or reliability rating;</li>
                    <li>Temporarily limit access to new booking requests; and/or</li>
                    <li>Deduct any applicable incentive, bonus, or promotional earnings associated with the booking;</li>
                    <li>Impede eligibility for future high-priority or premium booking allocations;</li>
                    <li>Require the completion of a reliability remediation module prior to further account activity; and/or</li>
                    <li>Apply a proportional administrative recovery fee to the Service Provider's digital wallet.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1.3 Very Late Cancellation
                  </h3>
                  <p className="mb-3">
                    A Service Provider shall be deemed to have committed a "Very Late Cancellation" in the event that a formal cancellation notice is transmitted:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Within three (3) hours before the Service Time; or</li>
                    <li>After confirming attendance but before arriving at the Designated Premises,</li>
                  </ul>
                  <p className="mb-2 font-semibold">
                    Upon the occurrence of a Very Late Cancellation, Anytime Work (ATW) reserves the right to invoke any or all of the following administrative and punitive measures:
                  </p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Record a Very Late Cancellation;</li>
                    <li>Temporarily suspend the Service Provider's account;</li>
                    <li>Deduct applicable incentives or earnings;</li>
                    <li>Reduce visibility in search results and booking allocation; and/or</li>
                    <li>Take any other action reasonably necessary to protect Service Seekers.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1.4 No Show
                  </h3>
                  <p className="mb-3">
                    A Service Provider shall be adjudicated as a "No Show" or "Absent" upon a determination by the Platform that said Provider has failed to fulfill the material obligations of the booking, specifically where the Provider:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Fails to arrive at the Designated Premises at the agreed Service Time without prior approval;</li>
                    <li>Leaves the work location before commencing the Service without a valid reason;</li>
                    <li>Cannot be contacted through the registered mobile number at the Service Time; or</li>
                    <li>Fails to mark attendance or otherwise confirm arrival where required by the Platform.</li>
                  </ul>
                  <p className="mb-2 font-semibold">
                    In the event of a verified No Show, ATW may, without prior notice, execute the following enforcement actions:
                  </p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Suspend or terminate the Service Provider's account;</li>
                    <li>Cancel payment eligibility for the booking;</li>
                    <li>Deduct incentives, bonuses, or promotional rewards;</li>
                    <li>Wallet restrictions;</li>
                    <li>Reduce ratings or performance score; and/or</li>
                    <li>Restrict future bookings.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1.5 Repeated Cancellations
                  </h3>
                  <p className="mb-3">
                    Where a Service Provider exhibits a pattern of non-performance—defined as repeated cancellations, persistent lateness, or recurrent failure to execute assigned Services—such conduct shall be classified as a material breach of the Platform Terms. Consequently, ATW reserves the absolute right to:
                  </p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Issue warnings;</li>
                    <li>Restrict access to new bookings;</li>
                    <li>Suspend the Service Provider's account temporarily;</li>
                    <li>Permanently deactivate the account; and/or</li>
                    <li>Take any legal or contractual action permitted under these Terms.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1.6 False Acceptance of Bookings
                  </h3>
                  <p>
                    Service Providers are strictly prohibited from accepting bookings in the absence of a bona fide intent to perform the Professional Service at the stipulated time and location. The acceptance of bookings for the purpose of market manipulation, including but not limited to blocking competing Service Providers, soliciting off-platform negotiations, or subsequent cancellation without an established exigent circumstance, constitutes fraudulent misuse of the Platform and shall warrant immediate account deactivation or permanent termination of the contractual relationship.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1.7 Emergency Exceptions
                  </h3>
                  <p className="mb-3">
                    Notwithstanding the foregoing penalties, ATW may, at its sole and absolute discretion, grant a waiver of administrative sanctions where the Service Provider provides contemporaneous and verifiable evidence that the cancellation was necessitated by a Force Majeure event or a genuine emergency beyond their reasonable control, such as:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Medical emergency;</li>
                    <li>Serious accident;</li>
                    <li>Natural disaster;</li>
                    <li>Government restrictions;</li>
                    <li>Death of an immediate family member; or</li>
                    <li>Any other genuine emergency supported by reasonable evidence.</li>
                  </ul>
                  <p>
                    The burden of proof rests entirely with the Service Provider to substantiate such claims to the satisfaction of the Platform's compliance department. ATW maintains the final adjudicatory authority regarding the validity of such exceptions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1.8 Platform Discretion
                  </h3>
                  <p className="mb-3">
                    ATW retains the irrevocable right to conduct comprehensive investigations into any instance of cancellation, operational delay, or non-performance. Subject to the findings of such investigations, the Platform may exercise its discretion to implement any remedial or disciplinary actions permitted under these Terms, including:
                  </p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Warning the Service Provider;</li>
                    <li>Reducing ratings or performance metrics;</li>
                    <li>Withholding incentives or promotional benefits;</li>
                    <li>Temporarily or permanently suspending the account; or</li>
                    <li>Initiating legal proceedings where fraudulent or malicious conduct is identified.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2: Cancellation Policy for Services Seeker (Company) */}
            <section className="border-b border-gray-150 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                2. Cancellation Policy for Services Seeker (Company)
              </h2>
              <p className="mb-4">
                You acknowledge that you do not have any statutory right to cancel a Vacancy, Shift, or Booking made through the ATW Platform. However, you have a contractual entitlement to cancel any Vacancy or Booking created through the Platform in the following circumstances and on the described terms.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2.1 Free Cancellation
                  </h3>
                  <p className="mb-3">
                    Subject to the cancellation not being a Late Cancellation or Very Late Cancellation (as described below), you may cancel a Vacancy or Booking without payment of any applicable Service Fee or cancellation charges if you cancel through the ATW Website, Mobile Application, or any other official booking channel:
                  </p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>At least fourteen (14) hours prior to the agreed Service Start Time ("Service Time"); or</li>
                    <li>Where the Service Time falls within fourteen (14) hours from the time of posting the Vacancy or Booking, within ten (10) minutes of creating such Vacancy or Booking ("Grace Period").</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2.2 Late Cancellation
                  </h3>
                  <p className="mb-3">
                    If your cancellation of a Vacancy or Booking is:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Within fourteen (14) hours but more than three (3) hours before the Service Time; or</li>
                    <li>After the applicable Grace Period has elapsed,</li>
                  </ul>
                  <p>
                    then, unless such cancellation constitutes a Very Late Cancellation, ATW and/or the Independent Professional(s) shall be entitled to retain or charge, as the case may be, fifty percent (50%) of the applicable Service Fee.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2.3 Very Late Cancellation
                  </h3>
                  <p className="mb-3">
                    If your cancellation of a Vacancy or Booking is:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Within three (3) hours but more than one (1) hour before the Service Time; and</li>
                    <li>The applicable Grace Period has elapsed,</li>
                  </ul>
                  <p>
                    then ATW and/or the Independent Professional(s) shall be entitled to retain or charge, as the case may be, fifty percent (50%) of the applicable Service Fee.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2.4 Full Service Fee
                  </h3>
                  <p className="mb-3">
                    You shall be liable to pay the full applicable Service Fee if you:
                  </p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>Cancel a Vacancy or Booking other than as permitted above;</li>
                    <li>Attempt to cancel a Vacancy or Booking on or after the Service Time;</li>
                    <li>Fail to permit the assigned Independent Professional(s) to commence work at the agreed Service Time or Designated Premises;</li>
                    <li>Fail to provide accurate, complete, or accessible work location details, gate pass, entry permissions, or site instructions;</li>
                    <li>Fail to provide accurate and complete contact details, including but not limited to the authorised person's name, mobile number, email address, or worksite address;</li>
                    <li>Refuse, without reasonable cause, to engage the assigned Independent Professional(s) after they have reported for duty;</li>
                    <li>Reduce, modify, or materially alter the confirmed Vacancy requirements after the Independent Professional(s) have accepted the assignment, resulting in cancellation of the engagement; or</li>
                    <li>Fail to make payment in accordance with the agreed payment terms after the Services have been rendered.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2.5 Cancellation Fee
                  </h3>
                  <p>
                    A cancellation fee is charged in order to reasonably compensate the Independent Professional(s) for reserving their availability and declining other work opportunities. It is not reasonable to expect an Independent Professional to secure another assignment where a Vacancy or Booking is cancelled with short notice or without notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2.6 Waiver of Cancellation Fee
                  </h3>
                  <p className="mb-3">
                    Cancellation fees may, at the sole and absolute discretion of ATW, be waived where you are unable to cancel a Vacancy or Booking due to genuine circumstances beyond your reasonable control, including but not limited to:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Natural disasters;</li>
                    <li>Government restrictions;</li>
                    <li>Medical emergencies;</li>
                    <li>Civil disturbances; or</li>
                    <li>Any other exceptional circumstance accepted by ATW.</li>
                  </ul>
                  <p>
                    Where any cancellation fee is waived, ATW shall act only as the facilitator and agent of the Independent Professional(s), who remain the principal provider(s) of the Services.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Cancellation Policy for Agents / Partners */}
            <section className="border-b border-gray-150 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                3. Cancellation Policy for Agents / Partners
              </h2>
              <p className="mb-4">
                You acknowledge that upon accepting any assignment, onboarding request, field visit, verification task, client meeting, or other business activity through the ATW Platform, you undertake to perform such assignment professionally and within the agreed timeline. Unnecessary cancellations or failure to fulfil accepted assignments may adversely affect the Platform, Service Seekers, Service Providers, and ATW's business operations.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3.1 Free Cancellation
                  </h3>
                  <p className="mb-3">
                    An Agent/Partner may cancel an accepted assignment without any penalty if the cancellation is made:
                  </p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>At least twenty-four (24) hours prior to the scheduled assignment, meeting, or activity; or</li>
                    <li>Within ten (10) minutes of accepting the assignment, provided the scheduled activity is due within the next twenty-four (24) hours ("Grace Period").</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3.2 Late Cancellation
                  </h3>
                  <p className="mb-3">
                    If an Agent/Partner cancels an accepted assignment:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Within twenty-four (24) hours but more than three (3) hours before the scheduled time; or</li>
                    <li>After the applicable Grace Period has expired,</li>
                  </ul>
                  <p className="mb-2 font-semibold">ATW may, at its sole discretion:</p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Record a Late Cancellation;</li>
                    <li>Reduce the Agent's or Partner's performance score;</li>
                    <li>Reduce priority for future assignments;</li>
                    <li>Withhold or reduce any applicable commission, incentive, or bonus associated with the cancelled assignment; and/or</li>
                    <li>Issue a warning.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3.3 Very Late Cancellation
                  </h3>
                  <p className="mb-3">
                    If an Agent/Partner cancels:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Within three (3) hours before the scheduled assignment; or</li>
                    <li>After confirming attendance but before arriving at the designated location,</li>
                  </ul>
                  <p className="mb-2 font-semibold">ATW may:</p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Record a Very Late Cancellation;</li>
                    <li>Suspend assignment eligibility temporarily;</li>
                    <li>Deduct applicable incentives or commissions relating to the assignment;</li>
                    <li>Reduce platform ranking or performance score; and/or</li>
                    <li>Take any other reasonable action necessary to protect the interests of ATW and its users.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3.5 Repeated Cancellations
                  </h3>
                  <p className="mb-3">
                    If an Agent/Partner repeatedly cancels accepted assignments, repeatedly fails to attend scheduled activities, or demonstrates poor reliability, ATW reserves the right to:
                  </p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Issue warnings;</li>
                    <li>Restrict access to future assignments;</li>
                    <li>Suspend the Agent/Partner account temporarily;</li>
                    <li>Permanently terminate the partnership; and/or</li>
                    <li>Recover any outstanding liabilities arising from contractual obligations.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3.6 False Acceptance of Assignments
                  </h3>
                  <p>
                    Agents/Partners shall not accept assignments without intending to complete them. Accepting assignments merely to block opportunities for other Agents/Partners, manipulate commission eligibility, delay business operations, or otherwise misuse the Platform shall constitute misconduct and may result in immediate suspension or permanent termination.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3.7 Emergency Exceptions
                  </h3>
                  <p className="mb-3">
                    ATW may, at its sole discretion, waive cancellation penalties where the Agent/Partner demonstrates that the cancellation resulted from circumstances beyond their reasonable control, including but not limited to:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 mb-3">
                    <li>Medical emergencies;</li>
                    <li>Serious accidents;</li>
                    <li>Natural disasters;</li>
                    <li>Government restrictions;</li>
                    <li>Death of an immediate family member; or</li>
                    <li>Any other genuine emergency supported by reasonable evidence.</li>
                  </ul>
                  <p>
                    ATW shall have the sole authority to determine whether such circumstances justify the waiver of any applicable penalties.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3.8 Platform Discretion
                  </h3>
                  <p className="mb-3">
                    ATW reserves the right, in its sole and absolute discretion, to investigate any cancellation, delay, misconduct, fraudulent activity, or failure to perform assignments and may take appropriate action, including but not limited to:
                  </p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Issuing warnings;</li>
                    <li>Reducing ratings or performance metrics;</li>
                    <li>Withholding commissions, incentives, or bonuses;</li>
                    <li>Suspending or permanently terminating the Agent/Partner account;</li>
                    <li>Recovering losses caused to ATW or its users, where legally permissible; and/or</li>
                    <li>Initiating appropriate civil or criminal proceedings where fraudulent, unlawful, or malicious conduct is identified.</li>
                  </ul>
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

export default CancellationPolicy;
