"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "How do I transfer money between accounts?",
    answer:
      "Go to the Transfers section, choose the account you want to transfer from and the destination account, enter the amount, then confirm the payment.",
  },
  {
    question: "How long do bank transfers take?",
    answer:
      "Most transfers between Eagle Bank accounts are instant. Transfers to other banks may take up to one business day depending on the receiving bank.",
  },
  {
    question: "Can I freeze my debit card?",
    answer:
      "Yes. You can temporarily freeze or unfreeze your debit card at any time from the Cards section of the app.",
  },
  {
    question: "What should I do if I notice suspicious activity?",
    answer:
      "If you see a transaction you do not recognise, immediately freeze your card and contact Eagle Bank support through the Help section.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Select ‘Forgot Password’ on the sign in page and follow the instructions sent to your registered email address.",
  },
  {
    question: "Can I set up spending notifications?",
    answer:
      "Yes. You can enable instant notifications for card payments, transfers, and account activity in Notification Settings.",
  },
  {
    question: "Are my payments secure?",
    answer:
      "Eagle Bank uses encrypted connections and multi-factor authentication to help keep your account and payments secure.",
  },
  {
    question: "How can I download my transaction history?",
    answer:
      "You can export your transactions as a CSV or PDF from the Transactions page using the download option.",
  },
  {
    question: "Can I schedule recurring payments?",
    answer:
      "Yes. Recurring payments can be managed in the Payments section where you can create, edit, or cancel scheduled transfers.",
  },
  {
    question: "What happens if a payment fails?",
    answer:
      "If a payment cannot be processed, you will receive a notification explaining the reason and any steps required to retry the transaction.",
  },
  {
    question: "How do I update my personal information?",
    answer:
      "You can update your contact details, address, and communication preferences from the Profile & Settings section.",
  },
  {
    question: "Is there a daily transfer limit?",
    answer:
      "Daily transfer limits may apply depending on your account type and security settings. Your available limit is displayed before confirming a transfer.",
  },
  {
    question: "Can I view pending transactions?",
    answer:
      "Yes. Pending transactions appear in your transaction history with a pending status until they are fully processed.",
  },
  {
    question: "How do I enable dark mode?",
    answer:
      "Dark mode can be enabled from Appearance Settings and will automatically apply across the Eagle Bank app.",
  },
  {
    question: "Does Eagle Bank support biometric login?",
    answer:
      "Yes. Face ID and fingerprint login can be enabled on supported devices for faster and more secure access.",
  },
];

export default function FaqPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">FAQ</h1>
        <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
          Frequently asked questions
        </p>
      </div>

      <Accordion type="single" collapsible>
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
