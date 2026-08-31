import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Building,
  User,
  Scale,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ActivePageView } from '../types';

interface LegalDocumentPageProps {
  initialTab?: 'privacy' | 'terms';
  onNavigate: (view: ActivePageView) => void;
}

export const LegalDocumentPage: React.FC<LegalDocumentPageProps> = ({
  initialTab = 'privacy',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-sm border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => onNavigate('home')}
            className="text-[#2874F0] font-bold hover:underline"
          >
            Home (Apna Bazaar)
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('profile')}
            className="text-[#2874F0] font-bold hover:underline"
          >
            Profile &amp; Settings
          </button>
          <span>/</span>
          <span className="text-gray-800 font-semibold">
            {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-sm transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2874F0] hover:bg-[#1a5bc4] text-white text-xs font-bold rounded-sm shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
        </div>
      </div>

      {/* Main Document Container */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Document Header */}
        <div className="bg-[#172337] text-white p-6 sm:p-8 border-b-4 border-[#2874F0]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#2874F0]/30 text-[#ffe500] px-2.5 py-0.5 rounded text-xs font-bold">
                <Scale className="w-3.5 h-3.5" />
                <span>OFFICIAL LEGAL NOTICE &amp; POLICIES</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Privacy Policy &amp; Terms of Service
              </h1>
              <p className="text-xs sm:text-sm text-gray-300">
                Official legal agreements governing digital product transactions, downloads, and developer attributions.
              </p>
            </div>

            {/* Quick Metadata Box */}
            <div className="bg-[#121c2d] p-3.5 rounded border border-gray-700 text-xs space-y-1.5 shrink-0">
              <div className="flex items-center gap-1.5 text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-[#ffe500]" />
                <span className="font-semibold text-white">Effective Date:</span> August 28, 2026
              </div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">Business Name:</span> Scorp
              </div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-white">Developer &amp; Builder:</span> Abhinav Dutta
              </div>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-700">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'privacy'
                  ? 'bg-[#2874F0] text-white shadow-md'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>1. Full Privacy Policy &amp; Terms Document</span>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'terms'
                  ? 'bg-[#2874F0] text-white shadow-md'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Limitation of Liability &amp; Disclaimers</span>
            </button>
          </div>
        </div>

        {/* Document Body (Exact Legal Text) */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-800 text-sm leading-relaxed">
          
          {/* Metadata Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-blue-50/60 rounded border border-blue-100 text-xs">
            <div>
              <span className="text-gray-500 font-medium">Business Entity:</span>
              <p className="font-bold text-gray-900 text-sm mt-0.5">Scorp</p>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Platform / Store Name:</span>
              <p className="font-bold text-gray-900 text-sm mt-0.5">Apna Bazaar for Digital Products</p>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Website Developer &amp; Builder:</span>
              <p className="font-bold text-gray-900 text-sm mt-0.5">Abhinav Dutta</p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white flex items-center justify-center text-xs font-extrabold">
                1
              </span>
              <span>Introduction</span>
            </h2>
            <p className="text-gray-700">
              Welcome to <strong>Apna Bazaar for Digital Products</strong> (operated under <strong>Scorp</strong>). By accessing, browsing, or using this website, purchasing digital goods, or utilizing any features provided herein, you agree to be bound by the terms outlined in this Privacy Policy &amp; Legal Notice. If you do not agree with any part of these terms, you must refrain from using the site immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white flex items-center justify-center text-xs font-extrabold">
                2
              </span>
              <span>General Information &amp; Scope</span>
            </h2>
            <p className="text-gray-700">
              Apna Bazaar for Digital Products acts solely as an online platform for distributing and facilitating access to digital assets, media, files, and resources.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-700 font-medium">
              <li><strong>Business Entity:</strong> Scorp</li>
              <li><strong>Store Name:</strong> Apna Bazaar for Digital Products</li>
              <li><strong>Website Developer &amp; Builder:</strong> Abhinav Dutta</li>
            </ul>
          </section>

          {/* Section 3 (Highlight Box) */}
          <section className="space-y-4 bg-amber-50/80 p-5 rounded border border-amber-200">
            <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2 border-b border-amber-300 pb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>3. Absolute Limitation of Liability &amp; Disclaimers</span>
            </h2>

            {/* 3.A */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">
                A. Non-Responsibility for Scams, Viruses, Malware, or System Damages
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm">
                While reasonable steps are taken to ensure the security of this platform, Apna Bazaar for Digital Products, its parent entity <strong>Scorp</strong>, its owner(s), and the website developer (<strong>Abhinav Dutta</strong>) assume <strong>NO RESPONSIBILITY OR LIABILITY</strong> for:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-3 text-xs sm:text-sm text-gray-700">
                <li>Any computer viruses, malware, trojans, ransomware, spyware, or malicious code that may infect your device, hardware, operating system, or network as a result of using this website or downloading any digital files from it.</li>
                <li>Any loss of data, system crashes, hardware failures, or software corruptions resulting from downloaded files or website usage.</li>
                <li>Third-party scams, fraudulent activities, phishing attempts, or unauthorized access conducted by malicious actors pretending to represent or interlink with this platform.</li>
              </ul>
              <p className="text-xs font-semibold text-amber-900 bg-amber-100/80 p-2.5 rounded border border-amber-200">
                ⚠️ <strong>User Risk Acknowledgment:</strong> You expressly agree that your use of this website and downloading of any files is strictly at your sole risk. You are solely responsible for keeping active antivirus software and system protection on your device.
              </p>
            </div>

            {/* 3.B */}
            <div className="space-y-2 pt-2 border-t border-amber-200">
              <h3 className="font-bold text-gray-900 text-sm">
                B. Financial Transactions &amp; Failed Payment Disclaimer
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm">
                All financial transactions on this website are processed via third-party payment gateways (e.g., UPI providers, Razorpay, PhonePe, Paytm, or bank gateways).
              </p>
              <ul className="list-disc list-inside space-y-1 pl-3 text-xs sm:text-sm text-gray-700">
                <li><strong>Transaction Failures:</strong> Apna Bazaar for Digital Products, Scorp, its owner(s), and Abhinav Dutta are <strong>NOT RESPONSIBLE</strong> for any payment failures, double debits, pending bank authorizations, unauthorized transactions, or delay in money transfers caused by third-party UPI networks, banking servers, or gateway providers.</li>
                <li><strong>Refunds &amp; Disputes:</strong> If money is debited from your account during a failed transaction, you must contact your respective bank or UPI service provider to resolve the dispute. The website owner and builder hold no legal or financial liability for money stuck in transit within third-party banking systems.</li>
              </ul>
            </div>

            {/* 3.C */}
            <div className="space-y-2 pt-2 border-t border-amber-200">
              <h3 className="font-bold text-gray-900 text-sm">
                C. Digital File Use &amp; Assumption of Risk
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm">
                All digital products, files, and resources provided on this website are delivered <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> without warranties of any kind, whether express or implied.
              </p>
              <ul className="list-disc list-inside space-y-1 pl-3 text-xs sm:text-sm text-gray-700">
                <li><strong>No Guarantee of Performance:</strong> The seller and developer do not guarantee that the digital files will meet your specific hardware/software compatibility requirements or operate uninterrupted.</li>
                <li><strong>Limitation of Loss:</strong> Neither Scorp, the website owner, nor Abhinav Dutta shall be held liable for any direct, indirect, incidental, consequential, or monetary damages arising from the use or inability to use the digital products sold on this website.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white flex items-center justify-center text-xs font-extrabold">
                4
              </span>
              <span>Privacy &amp; Information Collection</span>
            </h2>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">A. Data We Collect</h3>
              <p className="text-gray-700">
                We may collect minimal user information necessary to fulfill digital orders and maintain security, including:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-3 text-gray-700">
                <li>Contact details (e.g., Email address, Phone number).</li>
                <li>Transaction IDs and order timestamps generated during payment processing.</li>
                <li>Standard technical log data (IP address, browser type, device information).</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-gray-900 text-sm">B. Usage of Information</h3>
              <p className="text-gray-700">Collected data is exclusively used for:</p>
              <ul className="list-disc list-inside space-y-1 pl-3 text-gray-700">
                <li>Delivering purchased digital files and access links.</li>
                <li>Verifying payment completions.</li>
                <li>Improving website function and technical performance.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-gray-900 text-sm">C. Data Protection &amp; Third-Party Sharing</h3>
              <p className="text-gray-700">
                We do not sell, rent, or trade your personal information to third parties. Information may only be shared with verified third-party tools (such as payment processors) required to execute transaction services.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white flex items-center justify-center text-xs font-extrabold">
                5
              </span>
              <span>Indemnification</span>
            </h2>
            <p className="text-gray-700">
              By using this platform, you agree to defend, indemnify, and hold harmless <strong>Apna Bazaar for Digital Products</strong>, <strong>Scorp</strong>, its business owner(s), and website builder <strong>Abhinav Dutta</strong> against any legal claims, demands, liabilities, expenses, damages, or legal fees resulting from:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-3 text-gray-700">
              <li>Your violation of these terms and conditions.</li>
              <li>Your misuse of digital files purchased or downloaded from this platform.</li>
              <li>Any dispute regarding payment failures or unauthorized third-party transactions.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 bg-blue-50/50 p-4 rounded border border-blue-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-blue-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white flex items-center justify-center text-xs font-extrabold">
                6
              </span>
              <span>Intellectual Property &amp; Developer Attribution</span>
            </h2>
            <p className="text-gray-700">
              All intellectual property, website design, structure, code layout, and custom configurations built by <strong>Abhinav Dutta</strong> for <strong>Scorp / Apna Bazaar for Digital Products</strong> are protected. Unauthorized copying, scraping, or redistribution of the platform's proprietary build is strictly prohibited.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white flex items-center justify-center text-xs font-extrabold">
                7
              </span>
              <span>Changes to This Privacy Policy</span>
            </h2>
            <p className="text-gray-700">
              <strong>Scorp</strong> reserves the right to modify, amend, or replace this Privacy Policy and Disclaimer at any time without prior notice. Continued usage of the website following any changes constitutes full acceptance of the revised policy.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white flex items-center justify-center text-xs font-extrabold">
                8
              </span>
              <span>Contact Information</span>
            </h2>
            <p className="text-gray-700">
              For inquiries regarding this Privacy Policy or store support, please reach out via the official customer support channels provided on Apna Bazaar for Digital Products.
            </p>
          </section>

          {/* Footer Action Buttons */}
          <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              Platform: <strong>Apna Bazaar for Digital Products</strong> • Entity: <strong>Scorp</strong>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('profile')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-sm transition-colors cursor-pointer"
              >
                Back to Profile &amp; Settings
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="px-5 py-2 bg-[#2874F0] hover:bg-[#1a5bc4] text-white text-xs font-bold rounded-sm shadow-xs transition-colors cursor-pointer"
              >
                Accept &amp; Return to Store
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
